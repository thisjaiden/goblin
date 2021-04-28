// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

import { Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";
import { BOT_VERSION } from '../bot';

export function registerHelp(commandman: CommandManager) {
    commandman.registerCommand("help", false, hlp);
}

function hlp(message: Message, parsed_message: string, man: Guildman): boolean {
    new EmbedBuilder()
        .title(`Goblin Child ${BOT_VERSION}`)
        .text(stripIndents`
            !help - Shows this list
            !flavor - Get your flavor!
            !eightball - Ask the magic eightball a question...
            !poll - Create a poll and get results
            !dababy - Dababy
            !banme - I wonder what this does?
            !fight - Beat the shit out of your friends
            !game - **WIP, Disabled**
            !alias - **WIP, Disabled**
            !invite - Get an invite link for Goblin
            !adminhelp - Lists help for admin related commands
        `)
        .footer("I'm goblin child | !help | !invite")
        .color("blue")
        .send(message.channel)
    return true;
}
