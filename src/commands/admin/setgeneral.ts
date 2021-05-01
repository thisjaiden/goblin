import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

export function registerSetgeneral(commandman: CommandManager) {
    commandman.registerCommand("setgeneral", true, setgeneral);
}

function setgeneral(message: Message, parsed: string, man: Guildman): boolean {
    let contents = message.mentions.channels.first();
    let current_chan = man.getGuildField(message.guild.id, "general_channel");
    if (contents) {
        if (!(current_chan == "none")) {
            new EmbedBuilder()
                .title(`Updated general channel.`)
                .text(`<#${current_chan}> -> ${contents.name}`)
                .color("blue")
                .send(message.channel, man);
                man.setGuildField(message.guild.id, "general_channel", contents.id);
            return true;
        }
        else {
            new EmbedBuilder()
                .title(`Set general channel to ${contents.name}.`)
                .color("green")
                .send(message.channel, man);
            man.setGuildField(message.guild.id, "general_channel", contents.id);
            return true;
        }
    }
    else {
        new EmbedBuilder()
            .title(`Invalid usage.`)
            .text(`Please include a channel in the command.\nex: \`setgeneral #channel\``)
            .color("red")
            .send(message.channel, man);
        return false;
    }
}