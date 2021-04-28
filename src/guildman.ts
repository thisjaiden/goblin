import { Guild, Message, ReactionEmoji, TextChannel } from "discord.js";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

const fs = require('fs');

export class Guildman {
    constructor() {
        this.guild_data = [];
        this.general_data = {};
    }
    /**
     * Saves the data in `Guildman` to the disk
     * @param filename - The name of the file to save to. Do not add a file extension.
     */
    public export(filename: string) {
        let tmp_dta: DiskData = {
            general: this.general_data,
            guild: this.guild_data
        };
        fs.writeFileSync(
            `${filename}.json`,
            JSON.stringify(tmp_dta),
            function(err) {
                if (err) throw err;
                console.log('saved to savedata.json');
            }
        );
    }
    /**
     * Loads data from the disk into `Guildman`
     * @param filename - The name of the file to load from. Do not add a file extension.
     */
    public import(filename: string) {
        let tmp_dta = JSON.parse(fs.readFileSync(`${filename}.json`, 'utf8'));
        this.general_data = tmp_dta.general;
        this.guild_data = tmp_dta.guild;
        this.migrate();
    }
    public guildPrefix(guild_id: string): string {
        let ptr = this.getGuildPointer(guild_id);
        return this.guild_data[ptr].prefix;
    }
    public guildSupportsUnprefixed(guild_id: string): boolean {
        let ptr = this.getGuildPointer(guild_id);
        return this.guild_data[ptr].no_prefix;
    }
    public guildAddAdmin(guild_id: string, user_id: string) {
        let ptr = this.getGuildPointer(guild_id);
        this.guild_data[ptr].admins.push(user_id);
    }
    public guildHasGeneral(guild_id: string): boolean {
        let ptr = this.getGuildPointer(guild_id);
        if (this.guild_data[ptr].channels.general_channel == "none") {
            return false;
        }
        else {
            return true;
        }
    }
    public guildSetGeneral(guild_id: string, channel_id: string) {
        let ptr = this.getGuildPointer(guild_id);
        this.guild_data[ptr].channels.general_channel = channel_id;
    }
    public guildGeneral(guild_id: string): string {
        let ptr = this.getGuildPointer(guild_id);
        return this.guild_data[ptr].channels.general_channel;
    }
    public guildHasLogging(guild_id: string): boolean {
        let ptr = this.getGuildPointer(guild_id);
        if (this.guild_data[ptr].channels.logging_channel == "none") {
            return false;
        }
        else {
            return true;
        }
    }
    public guildSetPrefix(guild_id: string, prefix: string) {
        let ptr = this.getGuildPointer(guild_id);
        this.guild_data[ptr].prefix = prefix;
    }
    public guildSetLogging(guild_id: string, channel_id: string) {
        let ptr = this.getGuildPointer(guild_id);
        this.guild_data[ptr].channels.logging_channel = channel_id;
    }
    public guildLogging(guild_id: string): string {
        let ptr = this.getGuildPointer(guild_id);
        return this.guild_data[ptr].channels.logging_channel;
    }
    public guildLog(guild: Guild, message: string) {
        if (!this.guildHasLogging(guild.id)) {
            return;
        }
        let channel_id = this.guildLogging(guild.id);
        let channel = guild.channels.resolve(channel_id);
        if (!channel) return;
        if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;

        channel.send(message);
    }
    public guildRemoveAdmin(guild_id: string, user_id: string): boolean {
        let ptr = this.getGuildPointer(guild_id);
        let mod = [];
        let did_mod: boolean = false;
        this.guild_data[ptr].admins.forEach((admin) => {
            if (admin == user_id) {
                did_mod = true;
            }
            else {
                mod.push(admin);
            }
        });
        if (did_mod) {
            this.guild_data[ptr].admins = mod;
            return true;
        }
        else {
            return false;
        }
    }
    public guildCheckAdminStatus(guild_id: string, user_id: string): boolean {
        let ptr = this.getGuildPointer(guild_id);
        for (let i = 0; i < this.guild_data[ptr].admins.length; i++) {
            if (this.guild_data[ptr].admins[i] == user_id) {
                return true;
            }
        }
        return false;
    }
    public addReactionCallback(message: Message, reaction: string, callback: (reaction: ReactionEmoji, man: Guildman) => null) {
        let ptr = this.getGuildPointer(message.guild.id);
        this.guild_data[ptr].reaction_callbacks.push({emoji: reaction, callback: callback});
    }
    private migrate() {
        let fresh_guild: GuildData = {
            id: 'null',
            channels: {
                general_channel: 'none',
                logging_channel: 'none',
                update_channel: 'none'
            },
            prefix: "!",
            no_prefix: false,
            reaction_callbacks: [],
            features: {
                banme: false
            },
            admins: []
        };
        let fresh_general: GeneralData = {

        };
        for (let key in fresh_guild) {
            for (let i = 0; i < this.guild_data.length; i++) {
                if (!this.guild_data[i][key]) {
                    this.guild_data[i][key] = fresh_guild[key]
                }
            }
        }
        for (let key in fresh_general) {
            if (!this.general_data[key]) {
                this.general_data[key] = fresh_general[key];
            }
        }
    }

    /**
     * Sets the general channel for a given guild. This is where messages will usually be sent.
     * @param guild_id - A Discord guild id.
     * @param channel_id - A Discord channel id
     */
    public setGeneralChannel(guild_id: string, channel_id: string) {
        let ptr = this.getGuildPointer(guild_id);
        this.guild_data[ptr].channels.general_channel = channel_id;
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
            if (thisguild.id == guild_id) {
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
            channels: {
                general_channel: "none",
                logging_channel: "none",
                update_channel: "none"
            },
            prefix: "!",
            no_prefix: false,
            reaction_callbacks: [],
            features: {
                banme: false
            },
            admins: []
        });
        guild.members.cache.forEach((member) => {
            // console.log(`INFORMATION ON POTENTIAL ADMIN USER: ${JSON.stringify(member)}`);
            if (member.permissions.has("ADMINISTRATOR") || member.id == guild.owner.id) {
                // console.log("Found a match.");
                this.guild_data[this.guild_data.length - 1].admins.push(member.id);
            }
        });
        return this.guild_data.length - 1;
    }

    private guild_data: Array<GuildData> = [];
    private general_data: GeneralData = {};
}

interface GuildData {
    id: string,
    channels: {
        general_channel: string,
        logging_channel: string,
        update_channel: string
    },
    /**
     * The prefix used before commands
     */
    prefix: string,
    /**
     * If commands run with no prefix should work
     */
    no_prefix: boolean,
    reaction_callbacks: Array<ReactionCallback>,
    admins: Array<string>,
    features: {
        banme: boolean
    }
};

interface DiskData {
    guild: Array<GuildData>,
    general: GeneralData
};

interface GeneralData {

};

interface ReactionCallback {
    emoji: string,
    callback: (reaction: ReactionEmoji, man: Guildman) => null
}
