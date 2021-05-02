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
    new EmbedBuilder()
        .title(`Goblin Child ${BOT_VERSION}`)
        .text(stripIndents`
            Goblin allows users with Administrator or who own a server to use elevated goblin commands.
            !adminhelp - shows this message
            !setprefix - sets the prefix of the bot. Default: \`!\`
            !setlogging - designates a channel for log messages like removed or edited messages
            !prefrences - allows the enabling and disabling of particular commands and functions
            !setgeneral - designates a channel for random shitposts and other event based responses
            !setupdate - designates a channel for patch notes and update logs from goblin
        `)
        .footer("I'm goblin child | !help | !invite")
        .color("blue")
        .send(message.channel)
    return true;
}