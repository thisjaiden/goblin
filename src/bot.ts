const fs = require('fs');

import { Client, ColorResolvable, Guild, Message, MessageActionRow, MessageButton, MessageButtonStyleResolvable, MessageEmbed, NewsChannel, Permissions, TextChannel, Webhook } from 'discord.js';
import { translate_string } from './lang';

export class Bot {
    // discord.js Client object used for interfacing with Discord
    private client: Client;
    // token needed to connect `client` to the Discord API
    private readonly token: string;

    // /remindeme reminders
    private reminders: Array<object>;
    // /poll data
    private poll_data: Array<object>;
    // /rps data
    private rps_games: Array<object>;
    // /ttt data
    private ttt_games: Array<object>;
    // /admin reactionRoles data
    private reaction_roles: Array<object>;
    // /admin disableAnon data
    private disabled_anon: Array<String>;
    // /admin enableSnitching data
    private report_anon: Array<String>;
    
    constructor(client: Client, token: string) {
        this.client = client;
        this.token = token;
        this.reminders = JSON.parse(fs.readFileSync(`reminders.json`, 'utf8'));
        this.poll_data = JSON.parse(fs.readFileSync(`polls.json`, 'utf8'));
        this.disabled_anon = JSON.parse(fs.readFileSync(`anon_blocked.json`, 'utf8'));
        this.report_anon = JSON.parse(fs.readFileSync(`report_anon.json`, 'utf8'));
        this.reaction_roles = JSON.parse(fs.readFileSync(`reaction_roles.json`, 'utf8'));

        this.rps_games = [];
        this.ttt_games = [];
        console.log(`
Constructed client.
========================================
${this.reminders.length} reminders
${this.poll_data.length} polls
${this.disabled_anon.length} anons disabled
${this.report_anon.length} anon snitchers
${this.reaction_roles.length} reaction roles
========================================`);
    }

    /**
     * Runs all tasks required to get the bot fully functional, like scheduling repeat functions.
     */
    private startTasks() {
        // Set the status of the bot to update every 2 mins with the amount of servers Goblin is in.
        setInterval(() => {
            this.client.user.setActivity(`${this.client.guilds.cache.size} servers | /help`, {type: 'WATCHING'});
        }, 120_000);

        // Autosave data that might be needed between restarts every 5 mins.
        setInterval(() => {
            fs.writeFileSync(
                `reminders.json`,
                JSON.stringify(this.reminders)
            );
            fs.writeFileSync(
                `polls.json`,
                JSON.stringify(this.poll_data)
            );
            fs.writeFileSync(
                `anon_blocked.json`,
                JSON.stringify(this.disabled_anon)
            );
            fs.writeFileSync(
                `report_anon.json`,
                JSON.stringify(this.report_anon)
            );
            fs.writeFileSync(
                `reaction_roles.json`,
                JSON.stringify(this.reaction_roles)
            );
            console.log(`Saved ${this.reminders.length} reminders to reminders.json and ${this.poll_data.length} polls to polls.json.`);
        }, 300_000);
        
        // Check reminders every min, and remind users if appropriate
        setInterval(() => {
            let current_time = new Date().getTime();
            let new_reminders = [];
            for (let i = 0; i < this.reminders.length; i++) {
                let this_reminder = this.reminders[i];
                if (this_reminder["when"] <= current_time) {
                    let chan = this.client.channels.resolve(this_reminder["channel_id"]) as TextChannel;
                    chan.send(`Hello ${this_reminder["user_atable"]}! This is your reminder! (${this_reminder["reminder"]})`);
                    console.log(`A reminder has been sent and removed from the list!`);
                }
                else {
                    new_reminders.push(this_reminder);
                }
            }
            this.reminders = new_reminders;
        }, 60_000);

        // Make sure slash commands are up to date
        this.slashCommands();

        console.log("Finished start tasks.");
    }

    /**
     * Adds all slash commands to the application command list. This respects similarity,
     * preventing long startup times while making sure everything is registered.
     */
    private slashCommands() {
        this.client.application.commands.set([
            {
                name: "poll",
                description: "Create a poll and get results",
                options: [
                    {
                        type: 3,
                        name: "question",
                        description: "The question to ask in this poll",
                        required: true
                    },
                    {
                        type: 3,
                        name: "answer",
                        description: "The first answer to this poll",
                        required: true
                    },
                    {
                        type: 3,
                        name: "answer2",
                        description: "The second answer to this poll",
                        required: true
                    },
                    {
                        type: 3,
                        name: "answer3",
                        description: "The third answer to this poll (optional)",
                        required: false
                    },
                    {
                        type: 3,
                        name: "answer4",
                        description: "The fourth answer to this poll (optional)",
                        required: false
                    },
                    {
                        type: 3,
                        name: "answer5",
                        description: "The fifth answer to this poll (optional)",
                        required: false
                    }
                ]
            },
            {
                name: "balls",
                description: "Get a picture of balls"
            },
            {
                name: "remindme",
                description: "Set a reminder for the future",
                options: [
                    {
                        type: 4,
                        name: "time",
                        description: "How long until your reminder?",
                        "required": true
                    },
                    {
                        "type": 3,
                        "name": "unit",
                        "description": "What unit of time?",
                        "required": true,
                        "choices": [
                            {
                                "name": "minutes",
                                "value": "minutes"
                            },
                            {
                                "name": "hours",
                                "value": "hours"
                            },
                            {
                                "name": "days",
                                "value": "days"
                            }
                        ]
                    },
                    {
                        "type": 3,
                        "name": "reminder",
                        "description": "What do you want to be reminded?",
                        "required": true
                    }
                ]
            },
            {
                name: "invite",
                description: "Get Goblin's invite link"
            },
            {
                name: "game",
                description: "Play a very fun game!"
            },
            {
                name: "flavor",
                description: "Get your flavor!"
            },
            {
                name: "feedback",
                description: "Give feedback about Goblin!",
                options: [
                    {
                        type: 3,
                        name: "feedback",
                        description: "Provide feedback here.",
                        required: true
                    }
                ]
            },
            {
                name: "help",
                description: "Returns a list of Goblin's commands"
            },
            {
                name: "eightball",
                description: "Ask the magic 8 ball a question!",
                options: [
                    {
                        type: 3,
                        name: "question",
                        description: "The question you want to ask",
                        required: true
                    }
                ]
            },
            {
                name: "rps",
                description: "Challenge someone to Rock Paper Scissors.",
                options: [
                    {
                        type: 6,
                        name: "user",
                        description: "The user to challenge",
                        required: true
                    }
                ]
            },
            {
                name: "ttt",
                description: "Challenge someone to Tic Tac Toe.",
                options: [
                    {
                        type: 6,
                        name: "user",
                        description: "The user to challenge",
                        required: true
                    }
                ]
            },
            {
                name: "anon",
                description: "Post an anonymous message.",
                options: [
                    {
                        type: 3,
                        name: "message",
                        description: "The message to send.",
                        required: true
                    },
                    {
                        type: 3,
                        name: "name",
                        description: "A name for this anon."
                    }
                ]
            },
            {
                name: "admin",
                description: "Complete various admin actions.",
                options: [
                    {
                        type: 3,
                        name: "command",
                        description: "The command to use.",
                        required: true
                    }
                ]
            },
        ]);
    }

    /**
     * Starts up the bot, logging in and initalizing all functions.
     */
    public listen(): Promise<string> {
        this.client.on('ready', () => {
            this.startTasks();
        });
        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.isCommand()) {
                console.log(`Interaction begin: /${interaction.commandName}`);
                switch (interaction.commandName) {
                    case "admin":
                        if (interaction.inGuild() == false) {
                            interaction.reply(translate_string("admin.dm"));
                            return;
                        }
                        if (interaction.guild.members.resolve(interaction.user).roles.highest.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || interaction.guild.ownerId == interaction.user.id) {
                            let section_response = interaction.options.data[0].value.toString(); 
                            if (section_response == "disableAnon") {
                                let already_disabled = false;
                                for (let i = 0; i < this.disabled_anon.length; i++) {
                                    if (this.disabled_anon[i] == interaction.guildId) {
                                        already_disabled = true;
                                    }
                                }
                                if (already_disabled == false) {
                                    this.disabled_anon.push(interaction.guildId);
                                    interaction.reply({content: translate_string("admin.anon.disable"), ephemeral: true});
                                }
                                else {
                                    interaction.reply({content: translate_string("admin.anon.disabled"), ephemeral: true});
                                }
                            }
                            else if (section_response == "enableAnon") {
                                let new_state = [];
                                for (let i = 0; i < this.disabled_anon.length; i++) {
                                    if (this.disabled_anon[i] == interaction.guildId) {
                                        interaction.reply({content: translate_string("admin.anon.enable"), ephemeral: true});
                                    }
                                    else {
                                        new_state.push(this.disabled_anon[i]);
                                    }
                                }
                                this.disabled_anon = new_state;
                            }
                            else if (section_response == "enableSnitching") {
                                let already_enabled = false;
                                for (let i = 0; i < this.report_anon.length; i++) {
                                    if (this.report_anon[i] == interaction.guildId) {
                                        already_enabled = true;
                                    }
                                }
                                if (already_enabled == false) {
                                    this.report_anon.push(interaction.guildId);
                                    interaction.reply({content: translate_string("admin.snitching.enable")});
                                }
                                else {
                                    interaction.reply({content: translate_string("admin.snitching.enabled"), ephemeral: true});
                                }
                            }
                            else if (section_response == "disableSnitching") {
                                let new_state = [];
                                for (let i = 0; i < this.report_anon.length; i++) {
                                    if (this.report_anon[i] == interaction.guildId) {
                                        interaction.reply({content: translate_string("admin.snitching.disable")});
                                    }
                                    else {
                                        new_state.push(this.report_anon[i]);
                                    }
                                }
                                this.report_anon = new_state;
                            }
                            else if (section_response == "help") {
                                interaction.reply({content: translate_string("admin.help.text"), ephemeral: true})
                            }
                            else {
                                if (section_response.split(" ")[0] == "removeMessages") {
                                    let messages = (await interaction.channel.messages.fetch({"limit": parseInt(section_response.split(" ")[1])}));
                                    messages.forEach((message) => {
                                        interaction.channel.messages.delete(message);
                                    });
                                    interaction.reply({content: "Deleted.", ephemeral: true});
                                }
                                else if (section_response.split(" ")[0] == "reactionRoles") {
                                    let buttons = [];
                                    if (section_response.split(" ").length < 2) {
                                        interaction.reply(translate_string("admin.roles.arguments"));
                                        return;
                                    }
                                    let content = section_response.split(" ")[1];
                                    for (let i = 0; i < content.split(">").length - 1; i++) {
                                        console.log(`Attempting to resolve ${content.split(">")[i]} via ${content.split(">")[i].replace("<@&", "")}.`);
                                        let role = interaction.guild.roles.resolve(content.split(">")[i].replace("<@&", ""));
                                        let new_button = new MessageButton();
                                        new_button.setCustomId(`role|${randZeroToMax(999_999_999_999)}`);
                                        new_button.setStyle("PRIMARY");
                                        new_button.setLabel(role.name);
                                        console.log(`Registered reaction role button: ${JSON.stringify(new_button.toJSON())}`);
                                        buttons.push(new_button);
                                        this.reaction_roles.push({
                                            button_id: new_button.customId,
                                            guild_id: interaction.guildId,
                                            role_id: role.id
                                        });
                                    }
                                    let rows = [];
                                    for (let i = 0; i < buttons.length; i += 5) {
                                        rows.push(new MessageActionRow());
                                    }
                                    for (let i = 0; i < buttons.length; i++) {
                                        rows[Math.floor(i/5)].addComponents(buttons[i]);
                                    }
                                    interaction.reply({content: translate_string("admin.roles.text"), components: rows});
                                }
                                else {
                                    interaction.reply({content: translate_string("admin.unknown"), ephemeral: true});
                                }
                            }
                        }
                        else {
                            interaction.reply({content: translate_string("admin.permission"), ephemeral: true});
                            return;
                        }
                        break;
                    case "anon":
                        if (interaction.inGuild() == false) {
                            interaction.reply("You can't anon post in DMs.");
                            return;
                        }
                        for (let i = 0; i < this.disabled_anon.length; i++) {
                            if (this.disabled_anon[i] == interaction.guildId) {
                                interaction.reply({"content": translate_string("anon.disabled"), "ephemeral": true});
                                return;
                            }
                        }
                        interaction.reply({"content": translate_string("anon.sent"), "ephemeral": true});
                        
                        let post_options = interaction.options;

                        for (let i = 0; i < post_options.data[0].value.toString().split(" ").length; i++) {
                            for (let j = 0; j < concerning_words.length; j++) {
                                if (post_options.data[0].value.toString().split(" ")[i] == concerning_words[j]) {
                                    // THIS POST CONTAINS POTENTIALLY SENSITIVE CONTENT
                                    console.log("An anon message contained potentially concerning phrases.");
                                    let server_reports = false;
                                    for (let k = 0; k < this.report_anon.length; k++) {
                                        if (this.report_anon[k] == interaction.guildId) {
                                            server_reports = true;
                                        }
                                    }
                                    if (server_reports) {
                                        console.log("The server with this message reported it to the server owner.");
                                        console.log(`${interaction.user.toString()}|${interaction.user.id}: (${post_options.data[0].value})`);
                                        (await interaction.guild.fetchOwner()).send(translate_string("snitch.text"));
                                        (await interaction.guild.fetchOwner()).send(`${interaction.user.toString()}|${interaction.user.id}: (${post_options.data[0].value})`);
                                    }
                                    else {
                                        console.log("The server with this message has snitching disabled.");
                                    }
                                }
                            }
                        }

                        let webhooks = (await interaction.guild.fetchWebhooks());
                        let contains_goblin_hook = false;
                        let has_name = false;
                        let anon_name = "Anon";
                        if (interaction.options.data.length > 1) {
                            has_name = true;
                        }
                        if (has_name) {
                            anon_name = interaction.options.data[1].value as string;
                        }
                        webhooks.forEach(async (hook) => {
                            if (hook.owner.id == this.client.user.id) {
                                contains_goblin_hook = true;
                                (await hook.edit({channel: interaction.channelId}));
                                (await hook.edit({name: anon_name}));
                                hook.send(`${post_options.data[0].value}`);
                                return;
                            }
                        });
                        let chan = interaction.channel as TextChannel | NewsChannel;
                        if (!contains_goblin_hook) {
                            let new_webhook = chan.createWebhook(anon_name, {"avatar": "https://cdn.discordapp.com/attachments/882260949006966826/891006265923354634/image0.gif"});
                            (await new_webhook).send(`${post_options.data[0].value}`);
                        }
                        break;
                    case "poll":
                        if (interaction.inGuild() == false) {
                            interaction.reply(translate_string("poll.dms"));
                            return;
                        }
                        let poll_options = interaction.options;
                        let poll_question;
                        let poll_responses = [];
                        poll_options.data.forEach((option) => {
                            if (option.name == "question") {
                                poll_question = option.value;
                            }
                            else {
                                poll_responses.push(option.value);
                            }
                        });
                        let buttons = new MessageActionRow();
                        let visuals = new MessageEmbed();
                        let tmp_text = "";
                        let val_tmp = [];
                        poll_responses.forEach((response) => {
                            let new_button = new MessageButton();
                            new_button.setCustomId(`poll|${randZeroToMax(999_999_999_999)}`);
                            new_button.setStyle("PRIMARY");
                            new_button.setLabel(response);
                            console.log(`Registered button for this poll: ${JSON.stringify(new_button.toJSON())}`);
                            buttons.addComponents(new_button);
                            tmp_text = tmp_text + response;
                            tmp_text = tmp_text + ": 0\n";
                            val_tmp.push([]);
                        });
                        visuals.setTitle(poll_question);
                        visuals.setDescription(tmp_text);
                        visuals.setFooter("make your own with /poll!");
                        interaction.reply({embeds: [visuals], components: [buttons]});
                        let msg = await interaction.fetchReply();
                        this.poll_data.push({
                            buttons: buttons.components,
                            message_id: msg.id,
                            question: poll_question,
                            voted: val_tmp
                        });
                        break;
                    case "balls":
                        let message = new MessageEmbed();
                        message.setTitle("balls");
                        message.setDescription("balls");
                        message.setFooter("balls");
                        message.setImage(translate_string("balls.url"));
                        message.setThumbnail(translate_string("balls.url"));
                        interaction.reply({embeds: [message]});
                        break;
                    case "remindme":
                        let reminder = {};
                        let reminder_options = interaction.options;
                        let time_amount;
                        let time_unit;
                        let text;
                        reminder_options.data.forEach((option) => {
                            if (option.name == "time") {
                                time_amount = option.value;
                            }
                            else if (option.name == "unit") {
                                time_unit = option.value;
                            }
                            else if (option.name == "reminder") {
                                text = option.value;
                            }
                        });
                        if (time_unit == "minutes") {
                            reminder["when"] = new Date().getTime() + (1000 * 60 * time_amount);
                        }
                        if (time_unit == "hours") {
                            reminder["when"] = new Date().getTime() + (1000 * 60 * 60 * time_amount);
                        }
                        if (time_unit == "days") {
                            reminder["when"] = new Date().getTime() + (1000 * 60 * 60 * 24 * time_amount);
                        }
                        reminder["user_atable"] = interaction.user.toString();
                        reminder["channel_id"] = interaction.channelId;
                        reminder["reminder"] = text;
                        interaction.reply({content: `Reminder set! \nYou will be reminded in ${time_amount} ${time_unit}.`});
                        this.reminders.push(reminder);
                        console.log(`Reminder added. Current count: ${this.reminders.length}`);
                        break;
                    case "invite":
                        interaction.reply(
                            {
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle("Add Goblin Child!")
                                        .setDescription("You can invite Goblin Child by clicking the button below.")
                                ],
                                components: [
                                    new MessageActionRow().addComponents(
                                        new MessageButton()
                                            .setStyle("LINK")
                                            .setLabel("Invite me!")
                                            .setURL("https://discord.com/oauth2/authorize?client_id=763525517931839520&permissions=8&scope=bot%20applications.commands")
                                    )
                                ]
                            }
                        );
                        break;
                    case "flavor":
                        let repo = translate_string("flavor.flavor");
                        interaction.reply({embeds: [
                            new MessageEmbed()
                                .setTitle(translate_string("flavor.title"))
                                .setDescription(`"${interaction.member}${translate_string("flavor.text")}__${repo[0]}__"`)
                                .setColor(repo[1] as ColorResolvable)
                        ]});
                        break;
                    case "ttt":
                        if (interaction.options.data[0].user.bot) {
                            interaction.reply("You can't challenge a bot to TTT! (weirdo...)");
                            return;
                        }
                        if (interaction.options.data[0].user.id == interaction.user.id) {
                            interaction.reply("You can't challenge yourself to TTT, idiot.");
                            return;
                        }
                        let ttt_instance = {};
                        ttt_instance["challenger"] = interaction.user.id;
                        ttt_instance["challenged"] = interaction.options.data[0].user.id;
                        let board = [];
                        for (let i = 0; i < 9; i++) {
                            board.push({button_id: "ttt|" + randZeroToMax(999_999_999_999), state: 0});
                        }
                        ttt_instance["board"] = board;
                        ttt_instance["turn"] = 0;
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle("Tic Tac Toe Time")
                                    .setDescription(`<@${ttt_instance["challenged"]}>, you have been challenged to TTT by ${interaction.user.toString()}`)
                                    .setFooter("challenge someone else with /ttt")
                            ],
                            components: [
                                new MessageActionRow().addComponents([
                                    new MessageButton()
                                        .setLabel(" ")
                                        .setStyle("SECONDARY")
                                        .setCustomId(ttt_instance["board"][0]["button_id"]),
                                    new MessageButton()
                                        .setLabel(" ")
                                        .setStyle("SECONDARY")
                                        .setCustomId(ttt_instance["board"][1]["button_id"]),
                                    new MessageButton()
                                        .setLabel(" ")
                                        .setStyle("SECONDARY")
                                        .setCustomId(ttt_instance["board"][2]["button_id"])
                                ]),
                                new MessageActionRow().addComponents([
                                    new MessageButton()
                                        .setLabel(" ")
                                        .setStyle("SECONDARY")
                                        .setCustomId(ttt_instance["board"][3]["button_id"]),
                                    new MessageButton()
                                        .setLabel(" ")
                                        .setStyle("SECONDARY")
                                        .setCustomId(ttt_instance["board"][4]["button_id"]),
                                    new MessageButton()
                                        .setLabel(" ")
                                        .setStyle("SECONDARY")
                                        .setCustomId(ttt_instance["board"][5]["button_id"])
                                ]),
                                new MessageActionRow().addComponents([
                                    new MessageButton()
                                        .setLabel(" ")
                                        .setStyle("SECONDARY")
                                        .setCustomId(ttt_instance["board"][6]["button_id"]),
                                    new MessageButton()
                                        .setLabel(" ")
                                        .setStyle("SECONDARY")
                                        .setCustomId(ttt_instance["board"][7]["button_id"]),
                                    new MessageButton()
                                        .setLabel(" ")
                                        .setStyle("SECONDARY")
                                        .setCustomId(ttt_instance["board"][8]["button_id"])
                                ])
                            ]
                        });
                        let ttt_msg = await interaction.fetchReply();
                        ttt_instance["message_id"] = ttt_msg.id;
                        this.ttt_games.push(ttt_instance);
                        break;
                    case "rps":
                        if (interaction.options.data[0].user.bot) {
                            interaction.reply("You can't challenge a bot to RPS! (weirdo...)");
                            return;
                        }
                        if (interaction.options.data[0].user.id == interaction.user.id) {
                            interaction.reply("You can't challenge yourself to RPS, idiot.");
                            return;
                        }
                        let rps_instance = {};
                        rps_instance["rock"] = "rps|" + randZeroToMax(999_999_999_999);
                        rps_instance["paper"] = "rps|" + randZeroToMax(999_999_999_999);
                        rps_instance["scissors"] = "rps|" + randZeroToMax(999_999_999_999);
                        rps_instance["challenger"] = interaction.user.id;
                        rps_instance["challenged"] = interaction.options.data[0].user.id;
                        rps_instance["result_challenger"] = 0;
                        rps_instance["result_challenged"] = 0;
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle("Rock, Paper, Scissors, Shoot!")
                                    .setDescription(`<@${rps_instance["challenged"]}>, you have been challenged to RPS by ${interaction.user.toString()}`)
                                    .setFooter("challenge someone else with /rps")
                            ],
                            components: [
                                new MessageActionRow().addComponents([
                                    new MessageButton()
                                        .setLabel("Rock")
                                        .setStyle("SECONDARY")
                                        .setCustomId(rps_instance["rock"]),
                                    new MessageButton()
                                        .setLabel("Paper")
                                        .setStyle("PRIMARY")
                                        .setCustomId(rps_instance["paper"]),
                                    new MessageButton()
                                        .setLabel("Scissors")
                                        .setStyle("DANGER")
                                        .setCustomId(rps_instance["scissors"])
                                ])
                            ]
                        });
                        let rps_msg = await interaction.fetchReply();
                        rps_instance["message_id"] = rps_msg.id;
                        this.rps_games.push(rps_instance);
                        break;
                    case "feedback":
                        console.log("Feedback received!");
                        console.log(`(${interaction.options.data[0].value})`);
                        let fbtm = JSON.parse(fs.readFileSync(`feedback.json`, 'utf8'))
                        fbtm.push(interaction.options.data[0].value);
                        fs.writeFileSync(
                            `feedback.json`,
                            JSON.stringify(fbtm)
                        );
                        interaction.reply({content: translate_string("feedback.text")});
                        break;
                    case "help":
                        let snitch_status = translate_string("help.snitch.disabled");   
                        for (let i = 0; i < this.report_anon.length; i++) {
                            if (this.report_anon[i] == interaction.guildId) {
                                snitch_status = translate_string("help.snitch.enabled");
                            }
                        }
                        interaction.reply(
                            {
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(`Goblin Child v${translate_string("bot.version")}`)
                                        .setDescription(translate_string("help.text"))
                                        .setFooter(`${translate_string("help.snitch.pre")}${snitch_status}${translate_string("help.snitch.post")}`)
                                ]
                            }
                        );
                        break;
                    case "eightball":
                        let response = translate_string("eightball.response");
                        interaction.reply(
                            {
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(`${interaction.user.username}${translate_string("eightball.title")}${translate_string("format.quote.left")}${interaction.options.data[0].value}${translate_string("format.quote.right")}`)
                                        .setDescription(`${translate_string("eightball.text")}"${response[0]}"`)
                                        .setColor(response[1] as ColorResolvable)
                                ]
                            }
                        );
                        break;
                    case "game":
                        interaction.reply(
                            {
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(`${interaction.user.username}${translate_string("game.title")}`)
                                        .setDescription(`${translate_string("game.description")}${translate_string("game.url")}`)
                                        .setURL(translate_string("game.url"))
                                        .setColor("#8B4513")
                                ]
                            }
                        );
                        break;
                    default:
                        console.error("Encountered an interaction for a command that wasn't avalable!");
                        break;
                }
                console.log(`Interaction end: /${interaction.commandName}`);
            }
            if (interaction.isButton()) {
                console.log(`Button interaction (customId: ${interaction.customId})`);
                switch (interaction.customId.split("|")[0]) {
                    case "role":
                        this.reaction_roles.forEach((rrole) => {
                            if (rrole["button_id"] == interaction.customId) {
                                if (this.client.guilds.resolve(rrole["guild_id"]).members.resolve(interaction.user).roles.cache.has(rrole["role_id"])) {
                                    this.client.guilds.resolve(rrole["guild_id"]).members.resolve(interaction.user).roles.remove(interaction.guild.roles.resolve(rrole["role_id"]));
                                    console.log("Role removed via reaction roles.");
                                    interaction.reply({ephemeral: true, content: translate_string("role.remove")});
                                }
                                else {
                                    this.client.guilds.resolve(rrole["guild_id"]).members.resolve(interaction.user).roles.add(interaction.guild.roles.resolve(rrole["role_id"]));
                                    console.log("Role given via reaction roles.");
                                    interaction.reply({ephemeral: true, content: translate_string("role.grant")});
                                }
                            }
                        });
                        break;
                    case "poll":
                        this.poll_data.forEach((poll) => {
                            if (poll["message_id"] == interaction.message.id) {
                                let button_index = 0;
                                let finished = false;
                                poll["buttons"].forEach((button) => {
                                    if (button.customId == interaction.customId) {
                                        finished = true;
                                    }
                                    if (finished) {
                                        return;
                                    }
                                    button_index++;
                                });
                                let updated = false;
                                rootlevel:
                                for (let i = 0; i < poll["voted"].length; i++) {
                                    for (let j = 0; j < poll["voted"][i].length; j++) {
                                        if (interaction.member.user.id == poll["voted"][i][j]) {
                                            poll["voted"][i].splice(j, 1);
                                            poll["voted"][button_index].push(interaction.member.user.id);
                                            updated = true;
                                            interaction.reply({ephemeral: true, content: "Vote updated."});
                                            console.log("User updated poll vote.");
                                            break rootlevel;
                                        }
                                    }
                                }
                                if (updated == false) {
                                    poll["voted"][button_index].push(interaction.member.user.id);
                                }
                                let visuals = new MessageEmbed();
                                let tmp_text = "";
                                for (let i = 0; i < poll["voted"].length; i++) {
                                    tmp_text = tmp_text + poll["buttons"][i].label;
                                    tmp_text = tmp_text + ": ";
                                    tmp_text = tmp_text + poll["voted"][i].length;
                                    tmp_text = tmp_text + " ";
                                    tmp_text = tmp_text + '▇'.repeat(poll["voted"][i].length);
                                    tmp_text = tmp_text + "\n";
                                }
                                visuals.setTitle(poll["question"]);
                                visuals.setDescription(tmp_text);
                                visuals.footer = { text: "make your own with /poll!" };
                                let test_msg = interaction.message as Message;
                                test_msg.edit({embeds: [visuals]});
                                console.log("Edited /poll message with new values following interaction.");
                                if (!updated) {
                                    interaction.reply({ephemeral: true, content: "Voted!"});
                                }
                                return;
                            }
                        });
                        break;
                    case "rps":
                        let new_games_list = [];
                        this.rps_games.forEach(game => {
                            new_games_list.push(game);
                            if (interaction.message.id == game["message_id"]) {
                                let interaction_user = "none";
                                if (interaction.user.id == game["challenger"]) {
                                    interaction_user = "result_challenger";
                                }
                                else if (interaction.user.id == game["challenged"]) {
                                    interaction_user = "result_challenged";
                                }
                                if (interaction_user == "none") {
                                    interaction.reply({ephemeral: true, content: "This game doesn't involve *you*. >:("});
                                    return;
                                }
                                else {
                                    if (game[interaction_user] != 0) {
                                        interaction.reply({ephemeral: true, content: "You've already made your choice idiot :P"});
                                        return;
                                    }
                                    switch (interaction.customId) {
                                        case game["rock"]:
                                            game[interaction_user] = 1;
                                            break;
                                        case game["paper"]:
                                            game[interaction_user] = 2;
                                            break;
                                        case game["scissors"]:
                                            game[interaction_user] = 3;
                                            break;
                                    }
                                    if (game["result_challenger"] != 0 && game["result_challenged"] != 0) {
                                        // game finished, show results and remove from list of wip games
                                        new_games_list.pop();
                                        let convert_a = num_to_word_rps(game["result_challenger"]);
                                        let convert_b = num_to_word_rps(game["result_challenged"]);
                                        if (game["result_challenger"] == game["result_challenged"]) {
                                            interaction.reply(`Both <@${game["challenger"]}> and <@${game["challenged"]}> chose ${convert_a}. TIED!`);
                                            return;
                                        }
                                        else if (game["result_challenger"] == 1 && game["result_challenged"] == 2) {
                                            // r v p
                                            interaction.reply(`<@${game["challenger"]}> chose ${convert_a}, but <@${game["challenged"]}> chose ${convert_b}.`);
                                            return;
                                        }
                                        else if (game["result_challenger"] == 1 && game["result_challenged"] == 3) {
                                            // r v s
                                            interaction.reply(`<@${game["challenger"]}> chose ${convert_a}, beating <@${game["challenged"]}>'s ${convert_b}.`);
                                            return;
                                        }
                                        else if (game["result_challenger"] == 2 && game["result_challenged"] == 1) {
                                            // p v r
                                            interaction.reply(`<@${game["challenger"]}> chose ${convert_a}, beating <@${game["challenged"]}>'s ${convert_b}.`);
                                            return;
                                        }
                                        else if (game["result_challenger"] == 2 && game["result_challenged"] == 3) {
                                            // p v s
                                            interaction.reply(`<@${game["challenger"]}> chose ${convert_a}, but <@${game["challenged"]}> chose ${convert_b}.`);
                                            return;
                                        }
                                        else if (game["result_challenger"] == 3 && game["result_challenged"] == 1) {
                                            // s v r
                                            interaction.reply(`<@${game["challenger"]}> chose ${convert_a}, but <@${game["challenged"]}> chose ${convert_b}.`);
                                            return;
                                        }
                                        else if (game["result_challenger"] == 3 && game["result_challenged"] == 2) {
                                            // s v p
                                            interaction.reply(`<@${game["challenger"]}> chose ${convert_a}, beating <@${game["challenged"]}>'s ${convert_b}.`);
                                            return;
                                        }
                                    }
                                    else {
                                        interaction.reply({ephemeral: true, content: "Final decision submitted."});
                                        return;
                                    }
                                }
                            }
                        });
                        this.rps_games = new_games_list;
                        break;
                    case "ttt":
                        let new_games_list_ttt = [];
                        this.ttt_games.forEach(game => {
                            new_games_list_ttt.push(game);
                            if (interaction.message.id == game["message_id"]) {
                                if (interaction.user.id != game["challenger"] && interaction.user.id != game["challenged"]) {
                                    interaction.reply({ephemeral:true,content:"This isn't your game, loser. Fuck off."});
                                    return;
                                }
                                if ((interaction.user.id == game["challenger"] && game["turn"] == 0) || (interaction.user.id == game["challenged"] && game["turn"] == 1)) {
                                    interaction.reply({ephemeral:true,content:"It's not your turn!"});
                                    return;
                                }
                                for (let w = 0; w < game["board"].length; w++) {
                                    let spot = game["board"][w];
                                    if (spot["button_id"] == interaction.customId) {
                                        if (spot["state"] == 0) {
                                            if (interaction.user.id == game["challenger"]) {
                                                spot["state"] = 2;
                                            }
                                            else {
                                                spot["state"] = 1;
                                            }
                                            game["turn"]++;
                                            if (game["turn"] == 2) {
                                                game["turn"] = 0;
                                            }
                                            
                                            // TODO: update board
                                            let button_colors = [];
                                            let button_words = [];
                                            for (let i = 0; i < game["board"].length; i++) {
                                                button_colors.push(num_to_button_color(game["board"][i]["state"]));
                                                button_words.push(num_to_button_word(game["board"][i]["state"]))
                                            }
                                            let root_rows = [];
                                            for (let i = 0; i < 3; i++) {
                                                let this_row = new MessageActionRow();
                                                for (let j = 0; j < 3; j++) {
                                                    let this_button = new MessageButton();
                                                    this_button.setCustomId(game["board"][i*3+j]["button_id"]);
                                                    this_button.setStyle(button_colors[i*3+j]);
                                                    this_button.setLabel(button_words[i*3+j]);
                                                    this_row.addComponents([this_button]);
                                                }
                                                root_rows.push(this_row);
                                            }
                                            let msg = interaction.message as Message;
                                            msg.edit({ components: root_rows });
                                            // TODO: check win cond
                                            let consumed_tiles = 0;
                                            for (let x = 0; x < game["board"].length; x++) {
                                                let part = game["board"][x];
                                                if (part["state"] != 0) {
                                                    consumed_tiles++;
                                                }
                                            }
                                            if (consumed_tiles < 5) {
                                                interaction.reply({ephemeral:true, content:"Move made."});
                                                return;
                                            }
                                            for (let i = 0; i < 3; i++) {
                                                if ((game["board"][(i*3)]["state"] === game["board"][(i*3)+1]["state"]) === true && (game["board"][(i*3)+1]["state"] === game["board"][(i*3)+2]["state"]) === true) {
                                                    console.log(`wincon1: ${JSON.stringify(game["board"])}`);
                                                    switch (game["turn"]) {
                                                        case 1:
                                                            interaction.reply(`<@${game["challenged"]}> wins!`);
                                                            new_games_list_ttt.pop();
                                                            return;
                                                        case 0:
                                                            msg.reply(`<@${game["challenger"]}> wins!`);
                                                            new_games_list_ttt.pop();
                                                            return;
                                                    }
                                                }
                                                else if ((game["board"][i]["state"] === game["board"][3+i]["state"]) === true && (game["board"][3+i]["state"] === game["board"][6+i]["state"]) === true) {
                                                    console.log(`wincon2: ${JSON.stringify(game["board"])}`);
                                                    switch (game["turn"]) {
                                                        case 1:
                                                            interaction.reply(`<@${game["challenged"]}> wins!`);
                                                            new_games_list_ttt.pop();
                                                            return;
                                                        case 0:
                                                            interaction.reply(`<@${game["challenger"]}> wins!`);
                                                            new_games_list_ttt.pop();
                                                            return;
                                                    }
                                                }
                                            }
                                            // X
                                            //   X
                                            //     X
                                            if ((game["board"][0]["state"] === game["board"][4]["state"]) && (game["board"][4]["state"] === game["board"][8]["state"])) {
                                                console.log(`wincon3: ${JSON.stringify(game["board"])}`);
                                                switch (game["turn"]) {
                                                    case 1:
                                                        interaction.reply(`<@${game["challenged"]}> wins!`);
                                                        new_games_list_ttt.pop();
                                                        return;
                                                    case 0:
                                                        interaction.reply(`<@${game["challenger"]}> wins!`);
                                                        new_games_list_ttt.pop();
                                                        return;
                                                }
                                            }
                                            //   X
                                            //  X
                                            // X
                                            if ((game["board"][2]["state"] === game["board"][4]["state"]) && (game["board"][4]["state"] === game["board"][6]["state"])) {
                                                console.log(`wincon4: ${JSON.stringify(game["board"])}`);
                                                switch (game["turn"]) {
                                                    case 1:
                                                        interaction.reply(`<@${game["challenged"]}> wins!`);
                                                        new_games_list_ttt.pop();
                                                        return;
                                                    case 0:
                                                        interaction.reply(`<@${game["challenger"]}> wins!`);
                                                        new_games_list_ttt.pop();
                                                        return;
                                                }
                                            }
                                            interaction.reply({ephemeral:true, content:"Move made."});
                                            return;
                                        }
                                        else {
                                            interaction.reply({ephemeral:true,content:"A move has already been made in this spot!"});
                                            return;
                                        }
                                    }
                                }
                            }
                        });
                        this.ttt_games = new_games_list_ttt;
                        break;
                    default:
                        console.error("Encountered a button interaction for a command that wasn't avalable!");
                        break;
                }
            }
        });
        this.client.on('guildCreate', (guild: Guild) => {
            console.log(`Goblin was invited to a new guild! (${guild.name} with ${guild.memberCount} members)`);
        });
        this.client.on('guildDelete', (guild: Guild) => {
            console.log(`Goblin was removed from a guild... (${guild.name})`)
        });
        return this.client.login(this.token);
    }
}

/**
 * Generates a random number between 0 and max, [inclusive, exclusive)
 * @param max - The maximum number to generate (exclusive)
 * @returns The number generated
 */
 function randZeroToMax(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

const concerning_words = [
    "ending",
    "cut",
    "cutter",
    "cutting",
    "suicide",
    "suicidal",
    "kill",
    "killing",
    "killer",
    "bomb",
    "bombing",
    "bomber",
    "terrorist"
];

function num_to_word_rps(number: number): string {
    switch (number) {
        case 0:
            return "NO CHOICE";
        case 1:
            return "rock";
        case 2:
            return "paper";
        case 3:
            return "scissors";
        default:
            return "UNKNOWN INDEX";
    }
}

function num_to_button_color(number: number): MessageButtonStyleResolvable {
    switch (number) {
        case 0:
            return "SECONDARY";
        case 1:
            return "DANGER";
        case 2:
            return "PRIMARY";
        default:
            return "SUCCESS";
    }
}

function num_to_button_word(number: number): string {
    switch (number) {
        case 0:
            return " ";
        case 1:
            return "X";
        case 2:
            return "O";
        default:
            return "ERR";
    }
}
