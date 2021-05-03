import { Guild, Message, ReactionEmoji, TextChannel } from "discord.js";

import { BOT_VERSION, PATCH_NOTES } from "./bot";

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
    }
];

export class Guildman {
    constructor() {
        this.guild_data = [];
    }
    /**
     * Saves the data in `Guildman` to the disk
     * @param filename - The name of the file to save to. Do not add a file extension.
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
    public allGuildIds(): Array<string> {
        let wip = [];
        this.guild_data.forEach((guild) => {
            wip.push(guild["id"]);
        });
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
    public getGuildField(guild_id: string, field: string): any {
        let ptr = this.getGuildPointer(guild_id);
        if (this.guild_data[ptr][field] === undefined) {
            this.setFieldDefault(ptr, field);
        }
        return this.guild_data[ptr][field];
    }
    private setFieldDefault(guild_ptr: number, field_to_set: string) {
        for (let i = 0; i < field_info.length; i++) {
            for (let j = 0; j < field_info[i].types.length; j++) {
                if (field_info[i].types[j].key == field_to_set) {
                    this.guild_data[guild_ptr][field_to_set] = field_info[i].types[j].inital_value;
                    return;
                }
            }
        }
        console.warn(`Default for field ${field_to_set} was requested, but not avalable.`);
    }
    public setGuildField(guild_id: string, field: string, value: any) {
        let ptr = this.getGuildPointer(guild_id);
        typeof value
        this.guild_data[ptr][field] = value;
    }
    public guildLog(guild: Guild, message: string) {
        let channel_id = this.getGuildField(guild.id, "logging_channel");
        if (channel_id == "none") {
            return;
        }
        let channel = guild.channels.resolve(channel_id);
        if (!channel) return;
        if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;

        channel.send(message);
    }
    public guildCheckAdminStatus(guild: Guild, user_id: string): boolean {
        if (guild.member(user_id).permissions.has("ADMINISTRATOR") || guild.member(user_id).id == guild.ownerID) {
            return true;
        }
        return false;
    }
    public addReactionCallback(message: Message, reaction: string, callback?: (reaction: ReactionEmoji, man: Guildman) => null) {
        if (!callback) {
            return;
        }
        let ptr = this.getGuildPointer(message.guild.id);
        this.guild_data[ptr]["reaction_callbacks"].push({emoji: reaction, callback: callback});
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
