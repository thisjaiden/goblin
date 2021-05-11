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
            // we request access to all non-priviledged interfaces
            intents: [
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
