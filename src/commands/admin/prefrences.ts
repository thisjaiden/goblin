// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

export function registerPrefrences(commandman: CommandManager) {
    //commandman.registerCommand("preferences", true, pref);
}

function pref(message: Message, parsed: string, man: Guildman): boolean {
    let prefix = man.getGuildField(message.guild.id, "prefix");
    if (parsed.startsWith("set")) {
        if (parsed.split(" ").length < 3) {
            console.log(JSON.stringify(parsed.split(" ")));
            new EmbedBuilder()
                .title(`Invalid Arguments.`)
                .text(stripIndents`
                    Please use one of the following:
                    \`${prefix}preferences list\`
                    \`${prefix}preferences set [prefrence] true/false\`
                `)
                .color("red")
                .send(message.channel)
            return false;
        }
        let field = parsed.split(" ")[1];
        let value = parsed.split(" ")[2];
        switch (field) {
            case "banme":
            case "poll":
            case "flavor":
            case "fight":
            case "dababy":
            case "eightball":
            case "balls":
            case "game":
            case "twitch_prime_refrences":
                if (value == "true") {
                    new EmbedBuilder()
                        .title(`Preference Updated!`)
                        .text(`Set ${field} to ${value}.`)
                        .color("green")
                        .send(message.channel);
                    man.setGuildField(message.guild.id, field + "_enabled", true);
                    return true;
                }
                else {
                    new EmbedBuilder()
                        .title(`Preference Updated!`)
                        .text(`Set ${field} to ${value}.`)
                        .color("red")
                        .send(message.channel);
                    man.setGuildField(message.guild.id, field + "_enabled", false);
                    return true;
                }
            case "needs_prefix":
                if (value == "true") {
                    new EmbedBuilder()
                        .title(`Preference Updated!`)
                        .text(`Set ${field} to ${value}.`)
                        .color("green")
                        .send(message.channel);
                    man.setGuildField(message.guild.id, "no_prefix", false);
                    return true;
                }
                else {
                    new EmbedBuilder()
                        .title(`Preference Updated!`)
                        .text(`Set ${field} to ${value}.`)
                        .color("red")
                        .send(message.channel);
                    man.setGuildField(message.guild.id, "no_prefix", true);
                    return true;
                }
            default:
                new EmbedBuilder()
                    .title(`Invalid Field.`)
                    .text(stripIndents`
                        Use \`${prefix}preferences list\` to get a list of possible fields.
                    `)
                    .color("red")
                    .send(message.channel)
                return false;
        }
    }
    switch (parsed) {
        case "list":
            let banme_ico = "❌";
            let poll_ico = "❌";
            let flavor_ico = "❌";
            let fight_ico = "❌";
            let dababy_ico = "❌";
            let eightball_ico = "❌";
            let twitch_prime_refrences_ico = "❌";
            let logging_ico = "❌";
            let prefix_ico = "❌";
            let updates_ico = "❌";
            let balls_ico = "❌";
            let game_ico = "❌";
            if (man.getGuildField(message.guild.id, "banme_enabled")) {
                banme_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "poll_enabled")) {
                poll_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "flavor_enabled")) {
                flavor_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "fight_enabled")) {
                fight_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "dababy_enabled")) {
                dababy_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "eightball_enabled")) {
                eightball_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "twitch_prime_refrences_enabled")) {
                twitch_prime_refrences_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "logging_channel") != "none") {
                logging_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "update_channel") != "none") {
                updates_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "no_prefix") == true) {
                prefix_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "balls_enabled")) {
                balls_ico = "✅";
            }
            if (man.getGuildField(message.guild.id, "game_enabled")) {
                game_ico = "✅";
            }
            new EmbedBuilder()
                .title(`Goblin Child Preferences`)
                // game              - ${game_ico}
                .text(stripIndents`
                    **Commands**
                    prefix            - \`${prefix}\`
                    banme             - ${banme_ico}
                    balls             - ${balls_ico}
                    poll              - ${poll_ico}
                    flavor            - ${flavor_ico}
                    fight             - ${fight_ico}
                    dababy            - ${dababy_ico}
                    eightball         - ${eightball_ico}
                    **Command Refrences**
                    Twitch Prime SMP  - ${twitch_prime_refrences_ico}
                    (twitch_prime_refrences)
                    **Events**
                    updates           - ${updates_ico} (<#${man.getGuildField(message.guild.id, "update_channel")}>)
                    logging           - ${logging_ico} (<#${man.getGuildField(message.guild.id, "logging_channel")}>)
                    **Special**
                    no prefix needed  - ${prefix_ico}
                    (needs_prefix)
                `)
                .color("blue")
                .send(message.channel);
            break;
        case "":
        default:
            new EmbedBuilder()
                .title(`Invalid Arguments.`)
                .text(stripIndents`
                    Please use one of the following:
                    \`${prefix}preferences list\`
                    \`${prefix}preferences set [prefrence] true/false\`
                `)
                .color("red")
                .send(message.channel)
            return false;
    }
    return true;
}