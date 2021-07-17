import { Client, Interaction } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerInvite(commandman: CommandManager) {
    commandman.registerInteraction(
        {
            name: "math",
            description: "Math.",
            options: [
                {
                    type: 3,
                    name: "formula",
                    description: "Add your formula here.",
                    default: false,
                    required: true
                }
            ]
        },
        math
    );
}

function math(interaction: Interaction, man: Guildman, client: Client): boolean {
    new EmbedBuilder()
        .title("Add Goblin Child!", "https://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands")
        .text("You can invite Goblin with this link:\nhttps://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands")
        .color("blue")
        .footer("Use `/preferences` when you've added Goblin to tweak as needed")
        .interact(interaction, client, man);
    return true;
}
