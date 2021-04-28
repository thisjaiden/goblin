// Invite code:
// https://discord.com/api/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot

// Access our token safely
require('dotenv').config();

import { Client } from 'discord.js';
import { Bot } from './bot';
import { Guildman } from './guildman';

// Create a new `Bot` instance
let bot = new Bot(new Client, process.env.token, new Guildman);

// Start up the Discord bot.
bot.listen().catch((err) => {
    console.log(`Error creating a Bot instance: ${err}`);
});
