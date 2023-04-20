// Invite code:
// https://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands

// Access our token safely
require('dotenv').config();

import { Client } from 'discord.js';
import { Bot } from './bot';

// Create a new `Bot` instance
let bot = new Bot(
    new Client(
        {
            intents: [
                "GuildIntegrations",
                "DirectMessages",
                "Guilds",
                "GuildMessages"
            ]
        }
    ),
    process.env.TOKEN as string
);

// Start up the Discord bot.
bot.listen().catch((err) => {
    console.log(`Error creating a Bot instance: ${err}`);
});
