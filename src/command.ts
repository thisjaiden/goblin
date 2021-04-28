import { Client, Message } from "discord.js";
import { Guildman } from "./guildman";

/**
 * CommandManager is a tool for regulating and activating all of the various commands and functions
 * of the bot
 */
export class CommandManager {
    constructor() {

    }
    /**
     * registerCommand adds a new command to the CommandManager. This is the main way to add
     * commands or features to the bot
     * @param name - The command name to be used to trigger the command
     * @param requires_admin - Should this command only work for goblin admins?
     * @param onTrigger - Code to run when the command is used
     */
    public registerCommand(name: string, requires_admin: boolean, onTrigger: (message: Message, parsed_message: string, man: Guildman) => boolean) {
        this.commands.push(new Command(name, requires_admin, onTrigger));
    }
    /**
     * registerClientCommand adds a new command to the CommandManager. This is the same as
     * registerCommand, but allows the command access to the bot's Client instance
     * @param name - The command name to be used to trigger the command
     * @param requires_admin - Should this command only work for goblin admins?
     * @param onTrigger - Code to run when the command is used
     */
    public registerClientCommand(name: string, requires_admin: boolean, onTrigger: (message: Message, parsed_message: string, man: Guildman, client: Client) => boolean) {
        this.commands.push(new Command(name, requires_admin, (_a, _b, _c) => {return false;}));
        this.commands[this.commands.length - 1].setClient(onTrigger);
    }
    /**
     * runCommands takes a message as an input and runs all appropriate commands registered to
     * `this`. `man` and `client` are passed through to commands that need these features
     * @param message - The message to parse for potential commands
     * @param man - A `Guildman` instance to use for registered commands
     * @param client - A `Client` instance to use for registered commands
     */
    public runCommands(message: Message, man: Guildman, client: Client) {
        // For every registered command...
        this.commands.forEach(command => {
            // If this command needs admin privlege...
            if (command.requiresAdmin()) {
                // If the user has admin privlege...
                if (man.guildCheckAdminStatus(message.guild.id, message.author.id)) {
                    // Continue and run the command if appropriate
                }
                else {
                    // Not an admin, can't run this command! Exit the loop.
                    // TODO: does return here cancel all possible future commands or just this
                    // instance of the closure? `break` is invalid typescript here, as well as
                    // using `continue`.
                    return;
                }
            }
            // Check if this guild supports unprefixed commands
            let no_prefix = man.guildSupportsUnprefixed(message.guild.id);
            // Get the prefix this guild uses
            let prefix = man.guildPrefix(message.guild.id);
            // Get the first part of the message
            let first_segment = message.content.split(' ')[0];
            // If this message appears to start wtih a command...
            if ((prefix + command.getName() == first_segment) || (command.getName() == first_segment && no_prefix)) {
                // If this command requires access to the client...
                if (command.requiresClient()) {
                    // Run said command, with access to the client
                    command.trigger(message, message.content.slice(first_segment.length + 1), man, client);
                }
                else {
                    // Run said command
                    command.trigger(message, message.content.slice(first_segment.length + 1), man);
                }
                return;
            }
        });
    }
    private commands: Array<Command> = [];
}

class Command {
    constructor(name: string, requires_admin: boolean, onTrigger: (message: Message, parsed_message: string, man: Guildman) => boolean) {
        this.name = name;
        this.admin = requires_admin;
        this.onTrigger = onTrigger;
        this.times_used = 0;
        this.errors = 0;
        this.needs_client = false;
    }
    public trigger(message: Message, parsed_message: string, man: Guildman, client?: Client) {
        this.times_used++;
        if (client) {
            if (!this.onTriggerClient(message, parsed_message, man, client)) {
                this.errors++;
            }
        }
        else {
            if (!this.onTrigger(message, parsed_message, man)) {
                this.errors++;
            }
        }
    }
    public getName(): string {
        return this.name;
    }
    public requiresAdmin(): boolean {
        return this.admin;
    }
    public requiresClient(): boolean {
        return this.needs_client;
    }
    public setClient(ontrigger: (message: Message, parsed_message: string, man: Guildman, client: Client) => boolean) {
        this.onTriggerClient = ontrigger;
        this.needs_client = true;
    }
    private name: string;
    private admin: boolean;
    private onTrigger: (message: Message, parsed_message: string, man: Guildman) => boolean;
    private onTriggerClient: (message: Message, parsed_message: string, man: Guildman, client: Client) => boolean;
    private times_used: number;
    private errors: number;
    private needs_client: boolean
}
