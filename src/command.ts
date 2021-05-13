import { GuildDefaultMessageNotifications, MembershipScreeningFieldType } from "discord-api-types";
import { ApplicationCommand, ApplicationCommandData, ApplicationCommandPermissionData, Client, Guild, Interaction, Message, Permissions } from "discord.js";
import { Guildman } from "./guildman";

/**
 * CommandManager is a tool for regulating and activating all of the various commands and functions
 * of the bot
 */
export class CommandManager {
    constructor() {

    }
    public registerInteraction(interaction_details: Object, requires_admin: boolean, onTrigger: (interaction: Interaction, man: Guildman) => boolean) {
        this.interactions.push(new InteractionCommand(interaction_details, requires_admin, onTrigger))
    }
    public pushGuildInteractions(guild: Guild, man: Guildman) {
        guild.commands.set([]).catch(e => {
            console.warn("WARNING: UNABLE TO CLEAR ANCIENT SLASH COMMANDS:\n" + e);
        });
        this.interactions.forEach(interaction_details => {
            if (
                interaction_details.getRegisterInfo()["name"] == "preferences" ||
                interaction_details.getRegisterInfo()["name"] == "invite"
            ) {
                guild.commands.create(interaction_details.getRegisterInfo() as unknown as ApplicationCommandData).catch(e => {
                    console.warn("WARNING: AN ERROR OCCURED ADDING A SLASH COMMAND:\n" + e);
                }).then(cmd => {
                    if (typeof cmd === "undefined") {
                        console.log("udef, returning");
                        return;
                    }
                    let command = cmd as ApplicationCommand;
                    if (interaction_details.requiresAdmin()) {
                        let perms_struct = [];
                        // console.log(`${guild.roles.cache.size} roles in cache`);
                        guild.roles.cache.forEach(role => {
                            if (role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                                perms_struct.push({id: role.id, type: "ROLE", permission: true});
                            }
                            else {
                                // perms_struct.push({id: role.id, type: "ROLE", permission: false});
                            }
                        });
                        if (perms_struct.length >= 10) {
                            console.error("Too many priveledged roles. This needs to be handled properly.");
                        }
                        else {
                            command.setPermissions(perms_struct);
                        }
                    }
                });
            }
            else if (man.getGuildField(guild.id, (interaction_details.getRegisterInfo()["name"] + "_enabled"))) {
                guild.commands.create(interaction_details.getRegisterInfo() as unknown as ApplicationCommandData).catch(e => {
                    console.warn("WARNING: AN ERROR OCCURED ADDING A SLASH COMMAND:\n" + e);
                });
            }
        })
    }
    public pushInteractions(client: Client, man: Guildman) {
        
        // reset all guild commands
        client.guilds.cache.forEach((guild) => {
            guild.commands.set([]).catch(e => {
                console.warn("WARNING: UNABLE TO CLEAR ANCIENT SLASH COMMANDS:\n" + e);
            });
        });
        client.application.commands.set([]).catch(e => {
            console.warn("WARNING: UNABLE TO CLEAR ANCIENT GLOBAL SLASH COMMANDS:\n" + e);
        });
        this.interactions.forEach(interaction_details => {
            client.application.commands.create(interaction_details.getRegisterInfo() as unknown as ApplicationCommandData).catch(e => {
                console.warn("WARNING: AN ERROR OCCURED ADDING A GLOBAL SLASH COMMAND:\n" + e);
            }).then(cmd => {
                if (typeof cmd === "undefined") {
                    console.log("udef, returning");
                    return;
                }
                let command = cmd as ApplicationCommand;
                if (interaction_details.requiresAdmin()) {
                    // well, fuck. IDK what the hell to do here.
                    // how do i disable/enable commands for certain roles/permissions globally
                    // without hitting rate limits?
                    // I'm going to yolo into this attempt.
                    let perms_struct: Array<ApplicationCommandPermissionData> = [];
                    client.guilds.cache.forEach(guild => {
                        guild.roles.cache.forEach(role => {
                            if (role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                                perms_struct.push({id: role.id, type: "ROLE", permission: true});
                            }
                        })
                    })
                    command.setPermissions(perms_struct);
                }
            })
            /*
            // console.log(`For an interaction named ${interaction_details.getRegisterInfo()["name"]}...`);
            client.guilds.cache.forEach((guild) => {
                // console.log(`Adding to guild called ${guild.name}.`);
                if (
                    interaction_details.getRegisterInfo()["name"] == "preferences" ||
                    interaction_details.getRegisterInfo()["name"] == "invite"
                ) {
                    guild.commands.create(interaction_details.getRegisterInfo() as unknown as ApplicationCommandData).catch(e => {
                        console.warn("WARNING: AN ERROR OCCURED ADDING A SLASH COMMAND:\n" + e);
                    }).then(cmd => {
                        if (typeof cmd === "undefined") {
                            console.log("udef, returning");
                            return;
                        }
                        let command = cmd as ApplicationCommand;
                        if (interaction_details.requiresAdmin()) {
                            let perms_struct = [];
                            // console.log(`${guild.roles.cache.size} roles in cache`);
                            guild.roles.cache.forEach(role => {
                                if (role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                                    perms_struct.push({id: role.id, type: "ROLE", permission: true});
                                }
                                else {
                                    // exculding for test
                                    // perms_struct.push({id: role.id, type: "ROLE", permission: false});
                                }
                            });
                            if (perms_struct.length >= 10) {
                                console.error("Too many priveledged roles. This needs to be handled properly.");
                            }
                            else {
                                command.setPermissions(perms_struct);
                            }
                        }
                    });
                }
                else if (man.getGuildField(guild.id, (interaction_details.getRegisterInfo()["name"] + "_enabled"))) {
                    guild.commands.create(interaction_details.getRegisterInfo() as unknown as ApplicationCommandData).catch(e => {
                        console.warn("WARNING: AN ERROR OCCURED ADDING A SLASH COMMAND:\n" + e);
                    });
                }
            });
            */
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
                if (message.commandName == "preferences") {
                    this.pushGuildInteractions(message.guild, man);
                }
            });
        }
    }
    private interactions: Array<InteractionCommand> = [];
}

class InteractionCommand {
    constructor(interaction_details: Object, requires_admin: boolean, onTrigger: (message: Interaction, man: Guildman) => boolean) {
        this.interaction_details = interaction_details;
        this.admin = requires_admin;
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
    public requiresAdmin(): boolean {
        return this.admin;
    }
    public requiresClient(): boolean {
        return this.needs_client;
    }
    public setClient(ontrigger: (interaction: Interaction, man: Guildman, client: Client) => boolean) {
        this.onTriggerClient = ontrigger;
        this.needs_client = true;
    }
    public getRegisterInfo(): Object {
        return this.interaction_details;
    }
    private interaction_details: Object;
    private admin: boolean;
    private onTrigger: (interaction: Interaction, man: Guildman) => boolean;
    private onTriggerClient: (interaction: Interaction, man: Guildman, client: Client) => boolean;
    private needs_client: boolean
}
