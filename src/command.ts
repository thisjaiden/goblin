import { Client, Message } from "discord.js";
import { Guildman } from "./guildman";

export class CommandManager {
    constructor() {

    }
    public registerCommand(name: string, requires_admin: boolean, onTrigger: (message: Message, parsed_message: string, man: Guildman) => boolean) {
        this.commands.push(new Command(name, requires_admin, onTrigger));
    }
    public registerClientCommand(name: string, requires_admin: boolean, onTrigger: (message: Message, parsed_message: string, man: Guildman, client: Client) => boolean) {
        this.commands.push(new Command(name, requires_admin, (_a, _b, _c) => {return false;}));
        this.commands[this.commands.length - 1].setClient(onTrigger);
    }
    public runCommands(message: Message, man: Guildman, client: Client) {
        this.commands.forEach(command => {
            if (command.requiresAdmin()) {
                if (man.guildCheckAdminStatus(message.guild.id, message.author.id)) {
                    // continue
                }
                else {
                    // not an admin, can't run this command!
                    // TODO: does return here cancel all possible future commands or just this
                    // instance of the closure? `break` is invalid typescript here, as well as
                    // using `continue`.
                    return;
                }
            }
            let no_prefix = man.guildSupportsUnprefixed(message.guild.id);
            let prefix = man.guildPrefix(message.guild.id);
            let first_segment = message.content.split(' ')[0];
            if ((prefix + command.getName() == first_segment) || (command.getName() == first_segment && no_prefix)) {
                if (command.requiresClient()) {
                    command.trigger(message, message.content.slice(first_segment.length + 1), man, client);
                }
                else {
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
