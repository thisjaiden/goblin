import { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";
import { encounterNewRoom } from "./loop";
import { isGameActive, newGameDataStructure, setGameData } from "./utils";

export function registerBalls(commandman: CommandManager) {
    commandman.registerCommand("game", false, game);
}

function game(message: Message, parsed_message: string, man: Guildman): boolean {
    if (!(man.getGuildField(message.guild.id, "game_enabled"))) {
        // This command is disabled by guild prefrences.
        return;
    }

    let guild_id = message.guild.id;
    
    if (isGameActive(man, guild_id)) {
        new EmbedBuilder()
            .title("A game is already active.")
            .text("Would you like to overwrite that game and start a new one?")
            .footer("This action is irreversable.")
            .response("✅", (reaction, man) => {
                // time to overwrite the save and restart!
                setGameData(man, reaction.message.guild.id, newGameDataStructure());
                enterGameLoop(reaction.message.channel as TextChannel | NewsChannel, man);
            })
            .response("❌", (reaction, man) => {
                // attempt to delete this message
                reaction.message.delete().catch((_e) => {
                    // we were unable to delete this message, but that's fine. Just ignore
                });
            });
    }
    else {
        new EmbedBuilder()
            .title("Starting a new game...")
            .text("Please wait while data is set up and generated.")
            .color("blue")
            .send(message.channel);
        enterGameLoop(message.channel as TextChannel | NewsChannel, man);
    }
    return true;
}

function enterGameLoop(channel: TextChannel | NewsChannel, man: Guildman) {
    encounterNewRoom(channel, man);    
}
