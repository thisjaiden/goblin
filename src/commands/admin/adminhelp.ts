// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";
import { BOT_VERSION } from '../../bot';

export function registerAdminhelp(commandman: CommandManager) {
    commandman.registerCommand("helpadmin", true, adminhelp);
    commandman.registerCommand("adminhelp", true, adminhelp);
}

function adminhelp(message: Message, parsed: string, man: Guildman): boolean {
    let prefix = man.getGuildField(message.guild.id, "prefix");
    new EmbedBuilder()
        .title(`Goblin Child ${BOT_VERSION}`)
        .text(stripIndents`
            Goblin allows users with Administrator or who own a server to use elevated goblin commands.
            ${prefix}adminhelp - shows this message
            ${prefix}setprefix - sets the prefix of the bot. Default: \`!\`
            ${prefix}setlogging - designates a channel for log messages like removed or edited messages
            ${prefix}setgeneral - designates a channel for random shitposts and other event based responses
            ${prefix}setupdate - designates a channel for patch notes and update logs from goblin
            ${prefix}preferences - allows the enabling and disabling of particular commands and functions
        `)
        .footer(`I'm goblin child | ${prefix}help | ${prefix}invite`)
        .color("blue")
        .send(message.channel)
    return true;
}