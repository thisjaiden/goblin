// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

// bot version and latest patch notes
export const BOT_VERSION = "2.4.0";

export const PATCH_NOTES = stripIndents`
**Goblin Child v${BOT_VERSION}**
*Features and New Content*
- Added the new command \`balls\`
- Added 6 new flavors to \`flavor\`
*Polishing Changes*
- Changed many of \`eightball\`'s responses
- Adjusted \`invite\`'s message
|  • Now an embed
|  • No more default embed popup
- Adjusted \`help\`'s message
|  • Now uses the server's prefix, if changed from the default
|  • "I wonder what this does?" -> "Ban yourself?"
|  • Removed the "..." at the end of the eightball command description
|  • "Beat the shit out of your friends" -> "Who would win in a fight?"
- Adjusted \`adminhelp\`'s message
|  • Now uses the server's prefix, if changed from the default
|  • Moved \`preferences\` to the end of the list for consistency
|  • Fixed a typo in the spelling of "preferences"
- Removed the footer from \`banme\`'s message
- \`fight\` now assumes the person running the command is involved if only one person is mentioned
`;

// discord.js for accessing the discord api
import { Client, Guild, GuildAuditLogs, Message, MessageReaction, NewsChannel, TextChannel, VoiceChannel } from 'discord.js';

import { Guildman } from './guildman';
import { CommandManager } from './command';
import { registerBanme } from './commands/banme';
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
import { registerPrefrences } from './commands/admin/prefrences';
import { registerSetupdate } from './commands/admin/setupdate';
import { registerBalls } from './commands/balls';

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
        // Autosave every 5 mins
        setInterval(() => {
            this.man.export("savedata");
        }, 300_000);
        // Post patch notes for the bot, if applicable
        this.postUpdates();
    }
    private registerCommands() {
        registerBanme(this.command_manager);
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
        registerPrefrences(this.command_manager);
        registerSetupdate(this.command_manager);
        registerBalls(this.command_manager);
    }
    private postUpdates() {
        // Check if we've updated, then post patch notes to update channels.
        let guilds = this.man.allGuildIds();
        guilds.forEach((guild) => {
            if (this.man.getGuildField(guild, "latest_version") != BOT_VERSION) {
                this.man.setGuildField(guild, "latest_version", BOT_VERSION);
                let update_channel = this.man.getGuildField(guild, "update_channel");
                if (update_channel != "none") {
                    let mod_chan = this.client.guilds.resolve(guild).channels.resolve(update_channel) as TextChannel | NewsChannel;
                    mod_chan.send(PATCH_NOTES);
                }
            }
        });
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
        this.client.on('messageReactionAdd', (reaction: MessageReaction) => {
            this.man.handleReactionCallbacks(reaction);
        })
        this.client.on('guildCreate', (guild: Guild) => {
            this.man.registerNewGuild(guild);
            console.log(`Goblin was invited to a new guild! (${guild.name} with ${guild.memberCount} members)`);
        });
        this.client.on('guildDelete', (guild: Guild) => {
            this.man.unregisterGuild(guild);
            console.log(`Goblin was removed from a guild... (${guild.name})`)
        })
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
