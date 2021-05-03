import { Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerEightball(commandman: CommandManager) {
    commandman.registerCommand("8b", false, ball);
    commandman.registerCommand("eightball", false, ball);
    commandman.registerCommand("8ball", false, ball);
}

function ball(message: Message, parsed_message: string, man: Guildman): boolean {
    if (!(man.getGuildField(message.guild.id, "eightball_enabled"))) {
        // This command is disabled by guild prefrences.
        return;
    }

    let rand_select = responses[randInt(responses.length)];
    new EmbedBuilder()
        .title("Magic eight ball says...")
        .text(`"${rand_select[0]}"`)
        .color(rand_select[1])
        .send(message.channel);
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
