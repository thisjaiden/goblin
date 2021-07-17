import { ButtonInteraction, Client, Interaction } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

const poll_inf = {
    name: "poll",
    description: "Create a poll and get results",
    options: [
        {
            type: 3,
            name: "question",
            description: "The question to ask in this poll",
            default: false,
            required: true
        },
        {
            type: 3,
            name: "answer",
            description: "The first answer to this poll",
            default: false,
            required: true
        },
        {
            type: 3,
            name: "answer2",
            description: "The second answer to this poll",
            default: false,
            required: true
        },
        {
            type: 3,
            name: "answer3",
            description: "The third answer to this poll (optional)",
            default: false,
            required: false
        },
        {
            type: 3,
            name: "answer4",
            description: "The fourth answer to this poll (optional)",
            default: false,
            required: false
        },
        {
            type: 3,
            name: "answer5",
            description: "The fifth answer to this poll (optional)",
            default: false,
            required: false
        }
    ]
};

export function registerPoll(commandman: CommandManager) {
    commandman.registerInteraction(poll_inf, poll_interaction);
}

function poll_interaction(interaction: Interaction, man: Guildman, client: Client): boolean {
    if (interaction.isCommand()) {
        if (!interaction.channel) {
            new EmbedBuilder()
                .title("This command is disabled in DMs. No point in polling yourself anyways.")
                .color("red")
                .interact(interaction, client, man);
            return;
        }
        let question = interaction.options.array()[0].value as string;
        let options: Array<string> = [];
        for (let i = 1; i < interaction.options.array().length; i++) {
            options.push(interaction.options.array()[i].value as string);
        }
        let polls = man.getGuildField(interaction.guildId, "active_polls");
        let responses_wip = [];
        for (let i = 0; i < options.length; i++) {
            responses_wip.push(0);
        }
        let new_poll = {
            options,
            responses: responses_wip,
            author: interaction.member.toString(),
            command_id: interaction.commandId
        };
        polls.push(new_poll);
        man.setGuildField(interaction.guildId, "active_polls", polls);
        let partial = "";
        for (let j = 0; j < new_poll.responses.length; j++) {
            partial += new_poll.options[j];
            partial += ": ";
            partial += new_poll.responses[j];
            partial += "\n";
        }
        let partial_message = new EmbedBuilder()
            .title(question)
            .text(partial)
            .color("blue")
            .footer(`Use /poll to make your own`);
        for (let i = 0; i < options.length; i++) {
            partial_message
                .button("PRIMARY", options[i], (bi: ButtonInteraction, gm: Guildman) => {
                    console.log("callback arrived!");
                    let polls = man.getGuildField(bi.guildId, "active_polls");
                    polls.forEach(poll => {
                        bi.fetchReply().then((reply) => {
                            if (reply.interaction.id == poll.command_id) {
                                console.log(`proper poll found, using val ${i} for i`);
                                poll.responses[i] += 1;
                            }
                        })
                        let partial = "";
                        for (let j = 0; j < poll.responses.length; j++) {
                            partial += poll.options[j];
                            partial += ": ";
                            partial += poll.responses[j];
                            partial += "\n";
                        }
                        bi.editReply(partial);
                    });
                    man.setGuildField(bi.guildId, "active_polls", polls);
                });
        }
        partial_message.interact(interaction, client, man);
        return true;
    }
}
