import { Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerDababy(commandman: CommandManager) {
    commandman.registerCommand("dababy", false, dababy);
}

function dababy(message: Message, parsed_message: string, man: Guildman): boolean {
    let rand_select = responses[randInt(responses.length)];
    new EmbedBuilder()
        .title(rand_select[0])
        .image(rand_select[1])
        .color(rand_select[2])
        .send(message.channel);
    return true;
}

const responses = [
    ["DaBaby", "https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_600/Dababy_BabyOnBaby.jpg", "blue"],
    ["DACAR", "https://i.kym-cdn.com/entries/icons/original/000/036/822/cover4.jpg", "blue"],
    ["Da Baby", "https://pbs.twimg.com/profile_images/1356244521697353728/XBzZkFo__400x400.jpg", "green"],
    ["Dayoda", "https://i.redd.it/t9oehkeos8741.jpg", "yellow"]
];

// [0-max)
function randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
