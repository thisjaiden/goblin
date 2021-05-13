import { Interaction } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerInvite(commandman: CommandManager) {
    commandman.registerInteraction({name: "invite", description: "Get Goblin's invite link"}, false, inv);
}

function inv(interaction: Interaction, man: Guildman): boolean {
    new EmbedBuilder()
        .title("Add Goblin Child!", "https://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands")
        .text("You can invite Goblin with this link:\nhttps://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands")
        .color("blue")
        .footer("Use `/preferences` when you've added Goblin to tweak as needed")
        .interact(interaction);
    return true;
}
