import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

export function registerAddadmin(commandman: CommandManager) {
    commandman.registerCommand("addadmin", true, addadmin);
}

function addadmin(message: Message, parsed: string, man: Guildman): boolean {
    let contents = message.mentions.users.first();
    if (contents) {
        if (man.guildCheckAdminStatus(message.guild.id, contents.id)) {
            new EmbedBuilder()
                .title(`${contents.username} is already an admin.`)
                .color("blue")
                .send(message.channel, man);
            return false;
        }
        else {
            man.guildAddAdmin(message.guild.id, contents.id);
            new EmbedBuilder()
                .title(`Successfully added ${contents.username} to the list of admins!`)
                .color("green")
                .send(message.channel, man);
            return true;
        }
    }
    else {
        new EmbedBuilder()
            .title(`Invalid usage.`)
            .text(`Please include a user in the command.\nex: \`addadmin @user\``)
            .color("red")
            .send(message.channel, man);
        return false;
    }
}