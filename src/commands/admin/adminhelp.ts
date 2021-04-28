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
            Goblin keeps an internal list of admins who can use elevated goblin commands.
            You can see this list with
            !listadmins - show all goblin admins
            !adminhelp - shows this message
            !addadmin - adds an admin to goblin
            !removeadmin - removes an admin from goblin
            !setprefix - sets the prefix of the bot.
            !setlogging - designates a channel for log messages like removed or edited messages
            !prefrences - **WIP, Disabled**
            !setgeneral - **WIP, Disabled**
            !unprefixed - **WIP, Disabled**
            !setupdate - **WIP, Disabled**
        `)
        .footer("I'm goblin child | !help | !invite")
        .color("blue")
        .send(message.channel)
    return true;
}