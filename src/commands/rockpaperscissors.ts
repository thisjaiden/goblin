import { Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerRockpaperscissors(commandman: CommandManager) {
    commandman.registerCommand("rps", false, rps);
    commandman.registerCommand("rockpaperscissors", false, rps)
}

function rps(message: Message, parsed_message: string, man: Guildman): boolean {
    let users_mentioned = message.mentions.users.array();
    if (!(users_mentioned.length == 1)) {
        new EmbedBuilder()
            .title("Not enough arguments.")
            .text("Usage: `!rps @user`")
            .footer("!fight to start your own")
            .color("red")
            .send(message.channel);
        return false;
    }
    if (randInt(2) == 1) {
        let tmp = users_mentioned[0];
        users_mentioned[0] = users_mentioned[1];
        users_mentioned[1] = tmp;
    }
    let rand_select = responses[randInt(responses.length)];
    new EmbedBuilder()
        .title("Rock, Paper, Scissors, Shoot!")
        .text("test")
        .thumbnail(rand_select[3])
        .color(rand_select[4])
        .footer("!fight to start your own")
        .send(message.channel);
    return true;
}

const responses = [
    "rock",
    "paper",
    "scissors"
]

// [0-max)
function randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
