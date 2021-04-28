import { Client, Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

export function registerStats(commandman: CommandManager) {
    commandman.registerClientCommand("stats", false, stats);
}

function stats(message: Message, parsed_message: string, man: Guildman, client: Client): boolean {
    if (message.author.id == "453332405537996820") {
        new EmbedBuilder()
            .title("Watching:")
            .text(stripIndents`
                - \`${client.users.cache.size}\` users
                - \`${client.channels.cache.size}\` channels
                - \`${client.guilds.cache.size}\` servers
                Online for \`${Math.round((client.uptime)/1000/60/60*100)/100}\` hours
                Running \`shardless\`
            `)
            .footer(`I'm ${client.user.tag}. | !help | !invite`)
            .color("blue")
            .send(message.channel);
        return true;
    }
    return false;
}
