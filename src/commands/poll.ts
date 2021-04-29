import { Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerPoll(commandman: CommandManager) {
    commandman.registerCommand("poll", false, poll);
}

function poll(message: Message, parsed: string, man: Guildman): boolean {
    let admins = [];
    if (parsed.split("|").length < 2) {
        new EmbedBuilder()
            .title("Not enough arguments.")
            .text(`Use the format \`${man.guildPrefix(message.guild.id)}poll question here | answer 1 | answer 2 | ...\``)
            .color("red")
            .send(message.channel, man);
        return false;
    }
    let question = parsed.split("|")[0].trim();
    let responses = [];
    let dataset = parsed.split("|");
    for (let i = 1; i < dataset.length; i++) {
        responses.push(dataset[i].trim());
    }
    let managed_responses = "";
    for (let i = 0; i < responses.length; i++) {
        managed_responses = managed_responses + number_to_letter(i);
        managed_responses = managed_responses + " - ";
        managed_responses = managed_responses + responses[i];
        managed_responses = managed_responses + "\n";
    }
    let partial_message = new EmbedBuilder()
        .title(question)
        .text(managed_responses)
        .color("blue")
        .footer(`Use ${man.guildPrefix(message.guild.id)}poll to make your own`);
    for (let i = 0; i < responses.length; i++) {
        partial_message
            .response(number_to_letter(i), (_a, _b) => {})
    }
    partial_message.send(message.channel, man);
    if (message.deletable) {
        message.delete();
    }
    return true;
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
