// Invite code:
// https://discord.com/api/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot
// Goblin Elevated Test:
// https://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands

// test code
// https://discord.com/api/oauth2/authorize?client_id=676788563504791562&permissions=8&scope=bot
// fuck elevated test:
// https://discord.com/api/oauth2/authorize?client_id=676788563504791562&permissions=8&scope=bot%20applications.commands


// Access our token safely
require('dotenv').config();

import { Client, Intents } from 'discord.js';
import { Bot } from './bot';
import { Guildman } from './guildman';

// Create a new `Bot` instance
let bot = new Bot(
    new Client(
        {
            // we request access to many interfaces
            intents: [
                Intents.FLAGS.GUILD_INTEGRATIONS,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_INTEGRATIONS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_MESSAGE_TYPING,
                Intents.FLAGS.GUILD_WEBHOOKS,
            ]
        }
    ),
    process.env.token,
    new Guildman
);

// Start up the Discord bot.
bot.listen().catch((err) => {
    console.log(`Error creating a Bot instance: ${err}`);
});
