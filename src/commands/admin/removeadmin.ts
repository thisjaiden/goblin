import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

export function registerRemoveadmin(commandman: CommandManager) {
    commandman.registerCommand("removeadmin", true, removeadmin);
}

function removeadmin(message: Message, parsed: string, man: Guildman): boolean {
    let contents = message.mentions.users.first();
    if (contents) {
        if (!man.guildCheckAdminStatus(message.guild.id, contents.id)) {
            new EmbedBuilder()
                .title(`${contents.username} is not an admin.`)
                .color("red")
                .send(message.channel, man);
            return false;
        }
        else {
            if (message.guild.owner.id == contents.id) {
                new EmbedBuilder()
                    .title(`You cannot remove the server owner ${contents.username} from the list of admins.`)
                    .color("red")
                    .send(message.channel, man)
                return false;
            }
            else {
                man.guildRemoveAdmin(message.guild.id, contents.id);
                new EmbedBuilder()
                    .title(`Successfully removed ${contents.username} from the list of admins.`)
                    .color("blue")
                    .send(message.channel, man);
                return true;
            }
        }
    }
    else {
        new EmbedBuilder()
            .title(`Invalid usage.`)
            .text(`Please include a user in the command.\nex: \`removeadmin @user\``)
            .color("red")
            .send(message.channel, man);
        return false;
    }
}