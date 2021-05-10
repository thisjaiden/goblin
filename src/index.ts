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
            intents: [
                /*
                // messages
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGES,
                // reactions
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                // slash commands
                Intents.FLAGS.GUILD_INTEGRATIONS,
                // when invited setup
                Intents.FLAGS.GUILD_INVITES,
                */
                // all non privileged interfaces?
                Intents.NON_PRIVILEGED
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
