import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

export function registerSetprefix(commandman: CommandManager) {
    //commandman.registerCommand("setprefix", true, setprefix);
}

function setprefix(message: Message, parsed: string, man: Guildman): boolean {
    if (parsed) {
        man.setGuildField(message.guild.id, "prefix", parsed);
        new EmbedBuilder()
            .title(`Set bot prefix to \`${parsed}\`.`)
            .color("blue")
            .send(message.channel, man);
        return true;
    }
    else {
        new EmbedBuilder()
            .title(`Not enough arguments.`)
            .text(`Use the format \`setprefix prefix\``)
            .color("red")
            .send(message.channel, man);
        return false;
    }
}