import { Message } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

export function registerBalls(commandman: CommandManager) {
    commandman.registerCommand("game", false, game);
}

function game(message: Message, parsed_message: string, man: Guildman): boolean {
    if (!(man.getGuildField(message.guild.id, "game_enabled"))) {
        // This command is disabled by guild prefrences.
        return;
    }
    
    return true;
}


