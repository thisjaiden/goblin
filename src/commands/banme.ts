import { Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerBanme(commandman: CommandManager) {
    commandman.registerCommand("ban", false, banme);
    commandman.registerCommand("banme", false, banme);
    commandman.registerCommand("selfban", false, banme);
}

function banme(message: Message, parsed_message: string, man: Guildman): boolean {
    // TODO: Decline if disabled by guild
    // TODO: read rest of message (`!ban me` doesn't work)
    if (parsed_message == "") {
        message.guild.member(message.author).ban({ reason: `This user ran ${message.content}. Automatic ban by Goblin.`}).then(() => {
            new EmbedBuilder()
                .title("Whoops!")
                .text(`Looks like ${message.author} was stupid enough to run ${message.content}.\nI've banned them from ${message.guild}.`)
                .footer("I'm Goblin Child. | !help/invite")
                .thumbnail("https://i.pinimg.com/originals/82/69/9d/82699d6571d0fa1bfc3bbefebfe302b6.png")
                .color("#730b1b")
                .send(message.channel);
            return true;
        }).catch(() => {
            new EmbedBuilder()
                .title("I would've banned you but...")
                .text("It looks like you have more permissions than me. Hate to dissapoint you.")
                .footer("I'm Goblin Child. | !help/invite")
                .color("#872b7c")
                .send(message.channel);
            return false;
        });
    }
    return false;
}
