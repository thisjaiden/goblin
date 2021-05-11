import { Guild, Message, MessageReaction, ReactionEmoji, TextChannel } from "discord.js";

import { BOT_VERSION } from "./bot";

const fs = require('fs');

const field_info = [
    {
        key: "essentials-v2-3-0",
        types: [
            {
                key: "id",
                type: "string",
                inital_value: "null"
            },
            {
                key: "prefix",
                type: "string",
                inital_value: "!"
            },
            {
                key: "no_prefix",
                type: "bool",
                inital_value: false
            }
        ]
    },
    {
        key: "channels-v1",
        types: [
            {
                key: "general_channel",
                type: "string",
                inital_value: "none"
            },
            {
                key: "logging_channel",
                type: "string",
                inital_value: "none"
            },
            {
                key: "update_channel",
                type: "string",
                inital_value: "none"
            }
        ]
    },
    {
        key: "reaction-callbacks-v1",
        types: [
            {
                key: "reaction_callbacks",
                type: "list",
                inital_value: []
            }
        ]
    },
    {
        key: "preferences-v1",
        types: [
            {
                key: "banme_enabled",
                type: "bool",
                inital_value: false
            },
            {
                key: "poll_enabled",
                type: "bool",
                inital_value: true
            },
            {
                key: "flavor_enabled",
                type: "bool",
                inital_value: true
            },
            {
                key: "fight_enabled",
                type: "bool",
                inital_value: false
            },
            {
                key: "dababy_enabled",
                type: "bool",
                inital_value: false
            },
            {
                key: "eightball_enabled",
                type: "bool",
                inital_value: true
            },
            {
                key: "twitch_prime_refrences_enabled",
                type: "bool",
                inital_value: false
            }
        ]
    },
    {
        key: "preferences-v2",
        types: [
            {
                key: "balls_enabled",
                type: "bool",
                inital_value: true
            },
            {
                key: "game_enabled",
                type: "bool",
                inital_value: true
            }
        ]
    },
    {
        key: "updates-v1",
        types: [
            {
                key: "latest_version",
                type: "string",
                inital_value: BOT_VERSION
            }
        ]
    },
    {
        key: "game-v1",
        types: [
            {
                key: "game",
                type: "object",
                inital_value: {
                    setup: false
                }
            }
        ]
    },
    {
        key: "essentials-v3-0-0",
        types: [
            {
                key: "slash_command_support",
                type: "bool",
                inital_value: false
            }
        ]
    }
];

export class Guildman {
    constructor() {
        this.guild_data = [];
    }
    /**
     * Saves the data in `Guildman` to the disk
     * @param filename - The name of the file to save to. Do not add a file extension
     */
    public export(filename: string) {
        fs.writeFileSync(
            `${filename}.json`,
            JSON.stringify(this.guild_data),
            function(err) {
                if (err) throw err;
                console.log('saved to savedata.json');
            }
        );
    }
    /**
     * Gets a list of all the Guild ids managed by this `Guildman`
     * @returns A list of Guild ids that are managed by this `Guildman`
     */
    public allGuildIds(): Array<string> {
        // create an empty list to store the guild ids
        let wip = [];
        // for every guild we track
        this.guild_data.forEach((guild) => {
            // add the id of this guild to our list
            wip.push(guild["id"]);
        });
        // return the list
        return wip;
    }
    /**
     * Loads data from the disk into `Guildman`
     * @param filename - The name of the file to load from. Do not add a file extension.
     */
    public import(filename: string) {
        let tmp_dta = JSON.parse(fs.readFileSync(`${filename}.json`, 'utf8'));
        this.guild_data = tmp_dta;
    }
    /**
     * Reads data for a specific guild
     * @param guild_id - The id of the guild we are reading from
     * @param field - The field to get
     * @returns Whatever data was stored
     */
    public getGuildField(guild_id: string, field: string): any {
        // get the guild pointer
        let ptr = this.getGuildPointer(guild_id);
        // if there is no data for this field...
        if (this.guild_data[ptr][field] === undefined) {
            // set it to the default value
            this.setFieldDefault(ptr, field);
        }
        // return the data
        return this.guild_data[ptr][field];
    }
    /**
     * Sets data for a specific guild
     * @param guild_id - The id of the guild we are modifying
     * @param field - The field to set
     * @param value - What we are setting the field's value to
     */
    public setGuildField(guild_id: string, field: string, value: any) {
        // get the guild pointer
        let ptr = this.getGuildPointer(guild_id);
        // set the data
        this.guild_data[ptr][field] = value;
    }
    /**
     * Retrieves the default value for a field, and then sets a given guild's field to that value
     * @param guild_ptr - The id of the guild we are modifying
     * @param field_to_set - The field we need to set
     */
    private setFieldDefault(guild_ptr: number, field_to_set: string) {
        // for each group of defaults...
        for (let i = 0; i < field_info.length; i++) {
            // for each default value...
            for (let j = 0; j < field_info[i].types.length; j++) {
                // if this is the correct field...
                if (field_info[i].types[j].key == field_to_set) {
                    // set the value and return
                    this.guild_data[guild_ptr][field_to_set] = field_info[i].types[j].inital_value;
                    return;
                }
            }
        }
        // We were unable to find a default value to set this field to.
        console.warn(`Default for field ${field_to_set} was requested, but not avalable.`);
    }

    /**
     * Sends a message to a given guild's logging channel, if applicable
     * @param guild - The guild to send a message to
     * @param message - The message to be sent
     */
    public guildLog(guild: Guild, message: string) {
        // get logging channel id
        let channel_id = this.getGuildField(guild.id, "logging_channel");

        // if there is no channel, return
        if (channel_id == "none") return;

        let channel = guild.channels.resolve(channel_id);
        // if there is no channel, return
        if (!channel) return;
        // if the channel is not a text channel, return
        if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;

        // send the message
        channel.send(message);
    }
    public guildCheckAdminStatus(guild: Guild, user_id: string): boolean {
        if (guild.members.resolve(user_id).permissions.has("ADMINISTRATOR") || guild.members.resolve(user_id).id == guild.ownerID) {
            return true;
        }
        return false;
    }
    public addReactionCallback(message: Message, reaction: string, callback?: (reaction: ReactionEmoji, man: Guildman) => null, allow_multiple_uses?: boolean) {
        if (!callback) {
            return;
        }
        let ptr = this.getGuildPointer(message.guild.id);
        if (typeof this.guild_data[ptr]["reaction_callbacks"] === 'undefined') {
            this.guild_data[ptr]["reaction_callbacks"] = [];
        }
        if (allow_multiple_uses) {
            this.guild_data[ptr]["reaction_callbacks"].push({emoji: reaction, message_id: message.id, callback: callback, uid: -1});
            return;
        }
        this.guild_data[ptr]["reaction_callbacks"].push({emoji: reaction, message_id: message.id, callback: callback, uid: randInt(100_000)});
    }

    public handleReactionCallbacks(reaction: MessageReaction) {
        let message_id = reaction.message.id;
        // for every guild
        this.guild_data.forEach((guild) => {
            if (typeof guild["reaction_callbacks"] === 'undefined') {
                return;
            }
            // for every waiting reaction callback
            guild["reaction_callbacks"].foreach((reaction_callback) => {
                if (reaction_callback.message_id == message_id) {
                    // run the callback
                    reaction_callback.callback(reaction, this);
                    // if it's appropriate to remove this callback, remove it
                    if (reaction_callback.uid != -1) {
                        this.removeReactionCallback(reaction.message.guild.id, reaction_callback.uid);
                    }
                }
            });
        });
    }
    private removeReactionCallback(guild_id: string, uid: number) {
        let ptr = this.getGuildPointer(guild_id);
        let indx = 0;
        this.guild_data[ptr]["reaction_callbacks"].foreach((reaction_callback) => {
            if (reaction_callback.uid == uid) {
                this.guild_data[ptr]["reaction_callbacks"].splice(indx, 1);
                return;
            }
            indx++;
        });
    }
    
    /**
     * Finds the pointer of `this.guild_data` to get to a given guild
     * @param guild_id - The Discord guild ID to look for
     * @returns The array pointer to the wanted guild **IF POINTER IS NOT FOUND, -1 WILL BE RETURNED**
     */
    private getGuildPointer(guild_id: string): number {
        // For every guild we have data on...
        for (let i = 0; i < this.guild_data.length; i++) {
            let thisguild = this.guild_data[i];
            // If the id of this guild matches our requested id...
            if (thisguild["id"] == guild_id) {
                // Found a guild matching requested id, return pointer
                return i;
            }
        }
        console.warn(`Guild ${guild_id} does not have a pointer. This is a semi-serious error.`);
        // Unable to find pointer, return -1
        return -1;
    }

    public registerNewGuild(guild: Guild): number {
        this.guild_data.push({
            id: guild.id,
            slash_command_support: true
        });
        return this.guild_data.length - 1;
    }

    public unregisterGuild(guild: Guild) {
        let index = 0;
        let found = false;
        this.guild_data.forEach((guild_spec) => {
            if (guild_spec["id"] == guild.id) {
                found = true;
                return;
            }
            index++;
        });
        if (found) {
            this.guild_data.splice(index, 1);
        }
        else {
            console.warn(`Guild ${guild.toString()} was not found during \`unregisterGuild\`!`);
        }
    }

    private guild_data: Array<Object> = [];
}

/**
 * Generates a random whole number from 0 to `max`, including 0 and excluding `max`
 * @param max - The largest number to generate (exclusive)
 * @returns The generated number
 */
function randInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}
