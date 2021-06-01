import { ApplicationCommandData, Client, Interaction } from "discord.js";
import { Guildman } from "./guildman";

/**
 * CommandManager is a tool for regulating and activating all of the various commands and functions
 * of the bot
 */
export class CommandManager {
    constructor() {

    }
    public registerInteraction(interaction_details: Object, onTrigger: (interaction: Interaction, man: Guildman) => any | null) {
        this.interactions.push(new InteractionCommand(interaction_details, onTrigger))
    }
    public pushInteractions(client: Client, man: Guildman) {
        // reset all slash commands
        client.application.commands.set([]).catch(e => {
            console.warn("WARNING: UNABLE TO CLEAR ANCIENT GLOBAL SLASH COMMANDS:\n" + e);
        });
        this.interactions.forEach(interaction_details => {
            client.application.commands.create(interaction_details.getRegisterInfo() as unknown as ApplicationCommandData).catch(e => {
                console.warn("WARNING: AN ERROR OCCURED ADDING A GLOBAL SLASH COMMAND:\n" + e);
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
    constructor(interaction_details: Object, onTrigger: (message: Interaction, man: Guildman) => any | null) {
        this.interaction_details = interaction_details;
        this.onTrigger = onTrigger;
        this.needs_client = false;
    }
    public trigger(interaction: Interaction, man: Guildman, client?: Client) {
        if (this.needs_client) {
            this.onTriggerClient(interaction, man, client);
        }
        else {
            this.onTrigger(interaction, man);
        }
    }
    public requiresClient(): boolean {
        return this.needs_client;
    }
    public setClient(ontrigger: (interaction: Interaction, man: Guildman, client: Client) => any | null) {
        this.onTriggerClient = ontrigger;
        this.needs_client = true;
    }
    public getRegisterInfo(): Object {
        return this.interaction_details;
    }
    private interaction_details: Object;
    private onTrigger: (interaction: Interaction, man: Guildman) => any | null;
    private onTriggerClient: (interaction: Interaction, man: Guildman, client: Client) => any | null;
    private needs_client: boolean
}
