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
    // TODO: read rest of message (seeding)

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
    ["yes", "green"],
    ["nah", "red"],
    ["idk", "yellow"],
    ["stupid question", "red"],
    ["sure", "green"],
    ["absoulutely", "green"],
    ["no", "red"],
    ["maybe", "yellow"],
    ["i'm not telling you", "yellow"],
    ["try asking later i'm busy", "yellow"],
    ["**FUCK NO!**", "red"],
    ["wanna fuck around and find out?", "yellow"],
    ["why ask *me*? I don't know", "yellow"],
    ["okeydokey", "blue"],
    ["nope", "red"],
    ["mmhm.", "blue"],
    ["yeah...", "green"],
    ["i am __eight (8) ball__", "blue"]
];

// [0-max)
function randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
