import { Message } from "discord.js";
import { CommandManager } from "../command";
import { Guildman } from "../guildman";

export function registerInvite(commandman: CommandManager) {
    commandman.registerCommand("invite", false, inv);
    commandman.registerCommand("inv", false, inv)
}

function inv(message: Message, parsed_message: string, man: Guildman): boolean {
    message.channel.send("You can invite me to your server with the following link:\nhttps://discord.com/api/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot");
    return true;
}
