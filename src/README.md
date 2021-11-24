Goblin Child - "your resident shitposting bot"
===

![](https://img.shields.io/badge/15-servers-blueviolet)
[Invite](https://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands) | [Patch notes](patch_notes.md)

Features
---
- Dumb commands! (/balls!)
- Polls!
- Reaction roles!
- IDK why you wouldn't just use another bot.

Building
---

Required:
- [Rust](https://rust-lang.org)
- A valid Discord bot/application token

You will need to modify some files to set up the bot.  
1. Create a file called `token.rs` in the `src` folder.
2. Put your Discord bot token and application id in the file as shown in `token.rs.example`.
3. Run `cargo build --release` in the root folder.
4. Run `/target/release/goblin` - that's it!
