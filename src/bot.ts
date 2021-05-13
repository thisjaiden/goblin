// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

// bot version and latest patch notes
export const BOT_VERSION = "3.0.0";

export const PATCH_NOTES = stripIndents`
**Goblin Child v${BOT_VERSION}**
**IMPORTANT ANNOUNCEMENT**
Goblin's new features require you to kick the bot and add it back. Slash command support can *only*
be added this way due to an oversight on Discord's part. Sorry in advance.
*Features and New Content*
- Slash commands! Try them today with \`/\`, supporting autofill and such!
*Polishing Changes*
- For technical and security reasons, Goblin's status has changed to \`Watching x servers\`.
- Old prefix based commands have been **removed**. Slash commands are the only way to use Goblin.
- \`help\` has been removed as it is not needed with slash commands.
- \`setprefix\` has been removed as it is not needed with slash commands.
- \`preferences\` has been reworked to be easier with slash commands.
- \`invite\` has been tweaked to better fit slash commands.
- \`eightball\` has been tweaked to better fit slash commands.
- \`banme\` has been tweaked to better fit slash commands.
- \`fight\` has been tweaked to better fit slash commands.
- \`dababy\` has been temporarily removed while it goes through an upgrade.
- logging functions may be impared while they go through an upgrade.
*Technical Changes*
- Server owners! If you do not have a role with \`Administrator\` power, you will be unable to use Goblin's admin features. There is currently NO workaround for this, sorry.
- Updated to \`discord.js\` v13, improving security and adding new Discord features
- Updated to Discord API v8
- Updated to \`node.js\` 14.x
- Goblin no longer collects **ANY** user or server data. Feel safe again!
**This is a big update. Report issues and things you don't like or want please, feedback does help.**
`;


// const INVITE_URL = "https://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands";
// const LEGACY_REINVITE_MESSAGE = `Goblin needs to be reconnected to update. I promise this is the only time you'll need to do this. Please kick Goblin and reinvite her using this link:\n${INVITE_URL}`;

// discord.js for accessing the discord api
import { Client, Guild, GuildAuditLogs, MessageReaction, NewsChannel, Permissions, TextChannel, VoiceChannel } from 'discord.js';

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
            this.client.user.setActivity(`${this.man.allGuildIds().length} servers | !help`, {type: 'WATCHING'});
        }, 120_000);
        // Autosave every 5 mins
        setInterval(() => {
            this.man.export("savedata");
        }, 300_000);
        // Post patch notes for the bot, if applicable
        this.postUpdates();
        this.slashCommands();
        console.log("Invite URL:\n" + this.client.generateInvite({permissions:[Permissions.FLAGS.ADMINISTRATOR,Permissions.FLAGS.USE_APPLICATION_COMMANDS,Permissions.FLAGS.VIEW_GUILD_INSIGHTS]}))
    }
    private slashCommands() {
        this.command_manager.pushInteractions(this.client, this.man);
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
        registerFight(this.command_manager);
        registerPrefrences(this.command_manager);
        registerSetupdate(this.command_manager);
        registerBalls(this.command_manager);
    }
    private postUpdates() {
        // Check if we've updated, then post patch notes to update channels.
        let guilds = this.man.allGuildIds();
        guilds.forEach((guild) => {
            if (!this.man.getGuildField(guild, "slash_command_support")) {
                // legacy reinvite notice
                let real_guild = this.client.guilds.resolve(guild);
                let found_channel = false;
                if (real_guild == null) {
                    return;
                }
                if (real_guild.publicUpdatesChannel) {
                    //real_guild.publicUpdatesChannel.send(LEGACY_REINVITE_MESSAGE);
                    found_channel = true;
                }
                if (real_guild.rulesChannel) {
                    //real_guild.rulesChannel.send(LEGACY_REINVITE_MESSAGE);
                    found_channel = true;
                }
                if (real_guild.systemChannel) {
                    //real_guild.systemChannel.send(LEGACY_REINVITE_MESSAGE);
                    found_channel = true;
                }
                if (!found_channel) {
                    let first_chan = real_guild.channels.cache.first();
                    if (first_chan.isText()) {
                        //first_chan.send(LEGACY_REINVITE_MESSAGE);
                    }
                }
            }
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
        this.client.on('roleCreate', role => {
            this.command_manager.pushGuildInteractions(role.guild, this.man);
        });
        this.client.on('roleDelete', role => {
            this.command_manager.pushGuildInteractions(role.guild, this.man);
        });
        this.client.on('roleUpdate', role => {
            this.command_manager.pushGuildInteractions(role.guild, this.man);
        });
        this.client.on('interaction', interaction => {
            // we only handle command interactions
            if (!interaction.isCommand()) return;
            this.command_manager.runInteractions(interaction, this.man, this.client);
            return true;
        })
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
            // TODO: We need to track message history to log edits.
            // For now this is disabled.
            return;
            // The bot doesn't log bots
            if (message.author.bot) return;
            // The bot doesn't log webhooks
            if (message.webhookID) return;
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
