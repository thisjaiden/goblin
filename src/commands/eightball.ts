import { CommandInteraction, Interaction, Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

const eightball_inf = {
    name: "eightball",
    description: "Ask the magic 8 ball a question!",
    options: [
        {
            type: 3,
            name: "question",
            description: "The question you want to ask",
            default: false,
            required: true
        }
    ]
};

export function registerEightball(commandman: CommandManager) {
    commandman.registerInteraction(eightball_inf, ball);
}

function ball(interaction: CommandInteraction, man: Guildman): boolean {
    let rand_select = responses[randInt(responses.length)];
    new EmbedBuilder()
        .title(`${interaction.user.username} asked "${interaction.options[0].value}"`)
        .text(`**Magic eight ball says...**\n"${rand_select[0]}"`)
        .color(rand_select[1])
        .interact(interaction);
    return true;
}

const responses = [
    // yes (6)
    ["sure", "green"],
    ["absoulutely", "green"],
    ["yes", "green"],
    ["yeah...", "green"],
    ["of course!", "green"],
    ["indeed.", "green"],
    // unclear (3)
    ["okeydokey", "blue"],
    ["the answer is ambigous.", "blue"],
    ["i am __eight (8) ball__", "blue"],
    // maybe (4)
    ["idk", "yellow"],
    ["maybe", "yellow"],
    ["possibly.", "yellow"],
    ["why ask *me*? I don't know.", "yellow"],
    // no (7)
    ["nah", "red"],
    ["**FUCK NO!**", "red"],
    ["stupid question, obviously not", "red"],
    ["no", "red"],
    ["nope", "red"],
    ["no way", "red"],
    ["negative.", "red"]
];

// [0-max)
function randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
