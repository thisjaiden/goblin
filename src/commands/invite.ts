import { Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerInvite(commandman: CommandManager) {
    commandman.registerCommand("invite", false, inv);
    commandman.registerCommand("inv", false, inv)
}

function inv(message: Message, parsed_message: string, man: Guildman): boolean {
    new EmbedBuilder()
        .title("Add Goblin Child!", "https://discord.com/api/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot")
        .text("You can invite Goblin with this link:\nhttps://discord.com/api/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot")
        .color("blue")
        .footer("Use `!adminhelp` when you've added Goblin to tweak as needed")
        .send(message.channel);
    return true;
}
