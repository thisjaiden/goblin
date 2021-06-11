// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

// bot version and latest patch notes
export const BOT_VERSION = "3.1.0";

export const PATCH_NOTES = stripIndents`
**Goblin Child v${BOT_VERSION}**
*Features and New Content*
- \`/remindme\`
*Fixes and Tweaks*
- Fixed unintentional characters in Goblin's status
- Added an indication if Goblin is currently updating
`;

// discord.js for accessing the discord api
import { Client, Guild, MessageReaction, NewsChannel, Permissions, TextChannel } from 'discord.js';

import { Guildman } from './guildman';
import { CommandManager } from './command';
import { registerBanme } from './commands/banme';
import { registerPoll } from './commands/poll';
import { registerEightball } from './commands/eightball';
import { registerDababy } from './commands/dababy';
import { registerFlavor } from './commands/flavor';
import { registerInvite } from './commands/invite';
import { registerFight } from './commands/fight';
import { registerBalls } from './commands/balls';
import { registerGame } from './commands/game/setup';
import { registerHelp } from './commands/help';
import { EmbedBuilder } from './embed';
import { registerRemindme } from './commands/remindme';

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
        // Start everything one hour later after updating
        setTimeout(() => {
            // Set the status of the bot to update every 2 mins
            setInterval(() => {
                this.client.user.setActivity(`${this.man.allGuildIds().length} servers | /help`, {type: 'WATCHING'});
            }, 120_000);
            // Autosave every 5 mins
            setInterval(() => {
                this.man.export("savedata");
            }, 300_000);
            this.client.user.setStatus("online")
        }, 3_600_000);
        this.client.user.setStatus("dnd");
        this.client.user.setActivity(`Goblin is restarting...`, {type: 'WATCHING'});
        // Post patch notes for the bot, if applicable
        this.postUpdates();
        this.slashCommands();
        // Check reminders every min
        setInterval(() => {
            let all_guilds = this.man.allGuildIds;
            let current_time = new Date().getTime();
            for (let i = 0; i < all_guilds.length; i++) {
                let these_reminders = this.man.getGuildField(all_guilds[i], "reminders");
                let new_reminders = [];
                for (let j = 0; j < these_reminders.length; j++) {
                    if (these_reminders[j].when <= current_time) {
                        let chan = this.client.guilds.resolve(all_guilds[i]).channels.resolve(these_reminders[j].channel) as TextChannel;
                        new EmbedBuilder()
                            .title(`${these_reminders[j].reminder}`)
                            .text(`${these_reminders[j].user}, I am reminding you!`)
                            .color("green")
                            .send(chan);
                    }
                    else {
                        new_reminders.push(these_reminders[j]);
                    }
                }
                this.man.setGuildField(all_guilds[i], "reminders", new_reminders);
            }
        }, 60_000)
        console.log("Invite URL:\n" + this.client.generateInvite({permissions:[Permissions.FLAGS.ADMINISTRATOR,Permissions.FLAGS.USE_APPLICATION_COMMANDS,Permissions.FLAGS.VIEW_GUILD_INSIGHTS]}))
    }
    private slashCommands() {
        this.command_manager.pushInteractions(this.client, this.man);
    }
    private registerCommands() {
        registerBanme(this.command_manager);
        registerPoll(this.command_manager);
        registerEightball(this.command_manager);
        registerDababy(this.command_manager);
        registerFlavor(this.command_manager);
        registerInvite(this.command_manager);
        registerFight(this.command_manager);
        registerBalls(this.command_manager);
        registerGame(this.command_manager);
        registerHelp(this.command_manager);
        registerRemindme(this.command_manager);
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
        return this.client.login(this.token);
    }
}
