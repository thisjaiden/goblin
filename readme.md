Goblin Child
===

![](https://img.shields.io/badge/13-servers-blueviolet) "your resident shitposting bot"
[Invite](https://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands) | [Patch notes](patch_notes.md)

Building
---

Required:
- Node.js
- typescript
- A valid Discord bot token

You will need to modify some files to set up the bot.  
1. Create four files called `anon_blocked.json`, `report_anon.json`, `polls.json`, and `reminders.json` at the root directory, and put the text `[]` in all of them.
2. Create a file called `.env` at the root directory, putting your Discord bot token in the file as shown in `.env.example`.
3. Run `npm run watch` to compile the typescript.
4. Run the bot with `node src/index.js`!
