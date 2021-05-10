import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

export function registerSave(commandman: CommandManager) {
    //commandman.registerCommand("save", false, save);
}

function save(message: Message, parsed_message: string, man: Guildman): boolean {
    if (message.author.id == "453332405537996820") {
        man.export("savedata");
        new EmbedBuilder()
            .title("Saved data to disk!")
            .footer("No promises though.")
            .color("green")
            .send(message.channel);
        return true;
    }
    return false;
}
