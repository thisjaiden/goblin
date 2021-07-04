// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

import { Interaction } from "discord.js";
import { BOT_VERSION } from "../bot";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";
 
export function registerHelp(commandman: CommandManager) {
    commandman.registerInteraction(
        {
            name: "help",
            description: "Returns a list of Goblin's commands"
        },
        help
    );
}

function help(interaction: Interaction, man: Guildman): boolean {
    new EmbedBuilder()
        .title(`Goblin Child v${BOT_VERSION}`)
        .text(stripIndents`
            /balls - Shows a picture of balls. Genuinely SFW.
            /banme - Bans you from the server where you run this. Not recommended.
            /eightball - Answers all your deepest questions.
            /fight - Settles who would win in a fight.
            /flavor - Ever wondered what flavor you are? Find out now.
            /invite - Get the invite link for Goblin. <3
            /poll - Ask everyone a question.
        `)
        .color("blue")
        .footer(">:)")
        .interact(interaction);
    return true;
}

