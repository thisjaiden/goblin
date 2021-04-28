import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

export function registerListadmins(commandman: CommandManager) {
    commandman.registerCommand("listadmin", false, listadmins);
    commandman.registerCommand("listadmins", false, listadmins);
}

function listadmins(message: Message, parsed: string, man: Guildman): boolean {
    let admins = [];
    message.guild.members.cache.forEach((member) => {
        if (man.guildCheckAdminStatus(message.guild.id, member.id)) {
            admins.push(member);
        }
    });
    let textbuilder = "";
    admins.forEach((admin) => {
        console.log("adding admin to text");
        textbuilder = textbuilder + `- ${admin}\n`;
    });
    console.log(`text: ${textbuilder}`);
    new EmbedBuilder()
        .title(`Goblin admins of ${message.guild}`)
        .text(textbuilder)
        .color("blue")
        .send(message.channel, man);
    return true;
}