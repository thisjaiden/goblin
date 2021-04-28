export const BOT_VERSION = "2.2.0";


// discord.js for accessing the discord api
import { Client, Guild, GuildAuditLogs, Message, TextChannel, VoiceChannel } from 'discord.js';
// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

import { Guildman } from './guildman';
import { CommandManager } from './command';
import { registerBanme } from './commands/banme';
import { registerAddadmin } from './commands/admin/addadmin';
import { registerRemoveadmin } from './commands/admin/removeadmin';
import { registerListadmins } from './commands/admin/listadmins';
import { registerPoll } from './commands/poll';
import { registerSave } from './commands/bot_owner/save';
import { registerStats } from './commands/bot_owner/stats';
import { registerEightball } from './commands/eightball';
import { registerSetgeneral } from './commands/admin/setgeneral';
import { registerSetlogging } from './commands/admin/setlogging';
import { registerDababy } from './commands/dababy';
import { registerFlavor } from './commands/flavor';
import { registerInvite } from './commands/invite';
import { registerHelp } from './commands/help';
import { registerSetprefix } from './commands/admin/setprefix';
import { registerAdminhelp } from './commands/admin/adminhelp';
import { registerFight } from './commands/fight';

export class Bot {
    // discord.js Client object used for interfacing with Discord
    private client: Client;
    // token needed to connect `client` to the Discord API
    private readonly token: string;
    // `Guildman` instance used to track guild data
    private man: Guildman;
    // `CommandManager` instance used to track and manage various features of the bot
    private command_manager: CommandManager;
    
    constructor(client: Client, token: string, guildman: Guildman) {
        this.client = client;
        this.token = token;
        this.man = guildman;
        this.man.import('./savedata');
        this.command_manager = new CommandManager;
    }

    private startTasks() {
        // Set the status of the bot to update every 2 mins
        setInterval(() => {
            this.client.user.setActivity(`${this.client.users.cache.size} humans | !help`, {type: 'WATCHING'});
        }, 120_000);
        // Post patch notes for the bot, if applicable
        this.postUpdates();
    }
    private registerCommands() {
        registerBanme(this.command_manager);
        registerAddadmin(this.command_manager);
        registerRemoveadmin(this.command_manager);
        registerListadmins(this.command_manager);
        registerPoll(this.command_manager);
        registerSave(this.command_manager);
        registerStats(this.command_manager);
        registerEightball(this.command_manager);
        registerSetgeneral(this.command_manager);
        registerSetlogging(this.command_manager);
        registerDababy(this.command_manager);
        registerFlavor(this.command_manager);
        registerInvite(this.command_manager);
        registerHelp(this.command_manager);
        registerSetprefix(this.command_manager);
        registerAdminhelp(this.command_manager);
        registerFight(this.command_manager);
    }
    private postUpdates() {
        // Check if we've updated, then post patch notes to update channels.
    }
    public listen(): Promise<string> {
        this.client.on('ready', () => {
            this.registerCommands();
            this.startTasks();
        });
        this.client.on('message', (msg: Message) => {
            // The bot doesn't respond to other bots
            if (msg.author.bot) return;
            // The bot doesn't respond to discord system messages
            if (msg.author.system) return;
            // The bot doesn't respond to webhooks
            if (msg.webhookID) return;
            // DMs are not finished yet
            if (msg.channel.type == "dm") return;
            // Run all commands
            this.command_manager.runCommands(msg, this.man, this.client);
        });
        this.client.on('guildCreate', (guild: Guild) => {
            this.man.registerNewGuild(guild);
            console.log(`Goblin was invited to a new guild! (${guild.name} with ${guild.memberCount} members)`);
        });
        this.client.on('emojiCreate', emoji => {
            this.man.guildLog(emoji.guild, stripIndents`
                Action: Emoji Created
                Emoji Name: ${emoji.name}
                Author: ${emoji.author}
                Time: ${emoji.createdAt}
            `);
        });
        this.client.on('emojiDelete', emoji => {
            let auditlog: GuildAuditLogs;
            emoji.guild.fetchAuditLogs({limit: 1, type: "EMOJI_DELETE"}).then((auditlogs) => {
                auditlog = auditlogs;
            });
            this.man.guildLog(emoji.guild, stripIndents`
                Action: Emoji Deleted
                Emoji Name: ${emoji.name}
                Author: ${auditlog.entries.first().executor}
                Time: ${auditlog.entries.first().createdAt}
            `);
        });
        this.client.on('channelCreate', channel => {
            if (channel.type == "dm") return; // we don't deal with dms
            let spec_channel = channel as TextChannel | VoiceChannel;
            this.man.guildLog(spec_channel.guild, stripIndents`
                Action: Channel Created
                Channel Name: ${spec_channel.name}
                Time: ${spec_channel.createdAt}
            `);
        });
        this.client.on('channelDelete', channel => {
            let spec_channel = channel as TextChannel | VoiceChannel;
            let auditlog: GuildAuditLogs;
            spec_channel.guild.fetchAuditLogs({limit: 1, type: "CHANNEL_DELETE"}).then((auditlogs) => {
                auditlog = auditlogs;
            });
            if (!auditlog) {
                this.man.guildLog(spec_channel.guild, stripIndents`
                    Action: Channel Deleted
                    Channel Name: ${spec_channel.name}
                `);
            }
            else {
                this.man.guildLog(spec_channel.guild, stripIndents`
                    Action: Channel Deleted
                    Channel Name: ${spec_channel.name}
                    Author: ${auditlog.entries.first().executor}
                    Time: ${auditlog.entries.first().createdAt}
                `);
            }
        });
        this.client.on('messageUpdate', message => {
            // The bot doesn't log bots
            if (message.author.bot) return;
            // The bot doesn't log webhooks
            if (message.webhookID) return;
            let history = message.edits;
            let concat = "CURRENT MESSAGE <= ";
            for (let i = 1; i < history.length; i++) {
                let instance = history[i];
                concat = concat + instance.content;
                concat = concat + " <= ";
            };
            concat = concat + "MESSAGE CREATED";
            this.man.guildLog(message.guild, stripIndents`
                Action: Message Edited
                Message History:
                ${concat}
                Message Author: ${message.author}
            `);
        });
        this.client.on('messageDelete', message => {
            // The bot doesn't log bots
            if (message.author.bot) return;
            // The bot doesn't log webhooks
            if (message.webhookID) return;
            this.man.guildLog(message.guild, stripIndents`
                Action: Message Deleted
                Message Content: ${message.content}
                Message Author: ${message.author}
            `);
        })
        return this.client.login(this.token);
    }
}
