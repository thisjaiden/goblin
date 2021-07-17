import { ApplicationCommand, ApplicationCommandData, Client, Interaction } from "discord.js";
import { Guildman } from "./guildman";

/**
 * CommandManager is a tool for regulating and activating all of the various commands and functions
 * of the bot
 */
export class CommandManager {
    constructor() {

    }
    public registerInteraction(interaction_details: Object, onTrigger: (interaction: Interaction, man: Guildman, client: Client) => any | null): InteractionCommand {
        this.interactions.push(new InteractionCommand(interaction_details, onTrigger))
        return this.interactions[this.interactions.length - 1];
    }
    public pushInteractions(client: Client, man: Guildman) {
        // reset all slash commands
        client.application.commands.set([]).catch(e => {
            console.warn("WARNING: UNABLE TO CLEAR ANCIENT GLOBAL SLASH COMMANDS:\n" + e);
        });
        this.interactions.forEach(interaction_details => {
            client.application.commands.create(interaction_details.getRegisterInfo() as unknown as ApplicationCommandData).catch(e => {
                console.warn("WARNING: AN ERROR OCCURED ADDING A GLOBAL SLASH COMMAND:\n" + e);
            }).then((command) => {
                let cmd = command as ApplicationCommand;
                console.log(`slash command /${cmd.name} registered.`);
            });
        });
    }
    public runInteractions(message: Interaction, man: Guildman, client: Client) {
        if (message.isCommand()) {
            //console.log(`Recieved an interaction: ${message.commandName}`);
            this.interactions.forEach(interaction => {
                if (interaction.getRegisterInfo()["name"] == message.commandName) {
                    //console.log("An interaction has been found matching the request.");
                    interaction.trigger(message, man, client);
                }
            });
        }
    }
    private interactions: Array<InteractionCommand> = [];
}

class InteractionCommand {
    constructor(interaction_details: Object, onTrigger: (message: Interaction, man: Guildman, client: Client) => any | null) {
        this.interaction_details = interaction_details;
        this.onTrigger = onTrigger;
    }
    public trigger(interaction: Interaction, man: Guildman, client: Client) {
        this.onTrigger(interaction, man, client);
    }
    public getRegisterInfo(): Object {
        return this.interaction_details;
    }
    private interaction_details: Object;
    private onTrigger: (interaction: Interaction, man: Guildman, client: Client) => any | null;
}
