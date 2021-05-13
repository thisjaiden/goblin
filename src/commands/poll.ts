import { Interaction } from "discord.js";
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
    commandman.registerInteraction(poll_inf, false, poll_interaction);
}

function poll_interaction(interaction: Interaction, man: Guildman): boolean {
    if (!(man.getGuildField(interaction.guildID, "poll_enabled"))) {
        // This command is disabled by guild prefrences.
        return;
    }
    if (interaction.isCommand()) {
        let question = interaction.options[0].value as string;
        let options: Array<string> = [];
        for (let i = 1; i < interaction.options.length; i++) {
            options.push(interaction.options[i].value as string);
        }
        let managed_responses = "";
        for (let i = 0; i < options.length; i++) {
            managed_responses = managed_responses + number_to_letter(i);
            managed_responses = managed_responses + " - ";
            managed_responses = managed_responses + options[i];
            managed_responses = managed_responses + "\n";
        }
        let partial_message = new EmbedBuilder()
            .title(question)
            .text(managed_responses)
            .color("blue")
            .footer(`Use ${man.getGuildField(interaction.guildID, "prefix")}poll to make your own`);
        for (let i = 0; i < options.length; i++) {
            partial_message
                .response(number_to_letter(i))
        }
        partial_message.interact(interaction, man);
        return true;
    }
}

function number_to_letter(number) {
    switch (number) {
        case 0:
            return "🇦"
        case 1:
            return "🇧"
        case 2:
            return "🇨"
        case 3:
            return "🇩"
        case 4:
            return "🇪"
        case 5:
            return "🇫"
        case 6:
            return "🇬"
        case 7:
            return "🇭"
        case 8:
            return "🇮"
        case 9:
            return "🇯"
        case 10:
            return "🇰"
        case 11:
            return "🇱"
        case 12:
            return "🇲"
        default:
            return "🚫"
    }
}
