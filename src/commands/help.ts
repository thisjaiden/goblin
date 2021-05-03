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
    let prefix = man.getGuildField(message.guild.id, "prefix");
    new EmbedBuilder()
        .title(`Goblin Child ${BOT_VERSION}`)
        .text(stripIndents`
            ${prefix}help - Shows this list
            ${prefix}flavor - Get your flavor!
            ${prefix}eightball - Ask the magic eightball a question
            ${prefix}poll - Create a poll and get results
            ${prefix}dababy - Dababy
            ${prefix}banme - Ban yourself?
            ${prefix}fight - Who would win in a fight?
            ${prefix}balls - Get a picture of balls!
            ${prefix}game - **WIP, Disabled**
            ${prefix}alias - **WIP, Disabled**
            ${prefix}invite - Get an invite link for Goblin
            ${prefix}adminhelp - Lists help for admin related commands
        `)
        .footer(`I'm goblin child | ${prefix}help | ${prefix}invite`)
        .color("blue")
        .send(message.channel)
    return true;
}
