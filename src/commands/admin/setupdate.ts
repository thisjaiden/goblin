import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

export function registerSetupdate(commandman: CommandManager) {
    //commandman.registerCommand("setupdate", true, setupdate);
    //commandman.registerCommand("setupdates", true, setupdate);
}

function setupdate(message: Message, parsed: string, man: Guildman): boolean {
    let contents = message.mentions.channels.first();
    let current_chan = man.getGuildField(message.guild.id, "update_channel");
    if (contents) {
        if (!(current_chan == "none")) {
            new EmbedBuilder()
                .title(`Updated updates channel.`)
                .text(`<#${current_chan}> -> ${contents.toString()}`)
                .color("blue")
                .send(message.channel, man);
                man.setGuildField(message.guild.id, "update_channel", contents.id);
            return true;
        }
        else {
            new EmbedBuilder()
                .title(`Set updates channel to ${contents.toString()}.`)
                .color("green")
                .send(message.channel, man);
            man.setGuildField(message.guild.id, "update_channel", contents.id);
            return true;
        }
    }
    else {
        new EmbedBuilder()
            .title(`Invalid usage.`)
            .text(`Please include a channel in the command.\nex: \`setupdates #channel\``)
            .color("red")
            .send(message.channel, man);
        return false;
    }
}