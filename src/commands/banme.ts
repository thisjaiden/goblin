import { CommandInteraction, Interaction } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerBanme(commandman: CommandManager) {
    commandman.registerInteraction(
        {
            name: "banme",
            description: "Ban yourself from this server. No, this is not a joke."
        },
        false,
        banme
    )
}

function banme(interaction: CommandInteraction, man: Guildman) {
    if (interaction.channel.type == "dm") {
        new EmbedBuilder()
            .title("What are you trying to do?")
            .text("I can't ban you from your own DMs.")
            .color("#872b7c")
            .interact(interaction)
        return;
    }
    interaction.guild.members.resolve(interaction.user).ban({ reason: `This user ran \`/banme\`. Automatic ban by Goblin.`}).then(() => {
        new EmbedBuilder()
            .title("Whoops!")
            .text(`Looks like ${interaction.user.toString()} was stupid enough to run /banme.\nI've banned them from ${interaction.guild.toString()}.`)
            .thumbnail("https://i.pinimg.com/originals/82/69/9d/82699d6571d0fa1bfc3bbefebfe302b6.png")
            .color("#730b1b")
            .interact(interaction);
    }).catch(() => {
        new EmbedBuilder()
            .title("I would've banned you but...")
            .text("It looks like you have more permissions than me. Hate to dissapoint you.")
            .color("#872b7c")
            .interact(interaction);
    });
}
