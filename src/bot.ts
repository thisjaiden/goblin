// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;


const fs = require('fs');

// bot version and latest patch notes
export const BOT_VERSION = "4.0.0-alpha-4+";

export const PATCH_NOTES = stripIndents`
**Goblin Child v${BOT_VERSION}**
*Features and New Content*
- Rewrote the bot from scratch. Enjoy buttons, a more uniform experience, and general across the board upgrades.
`;

// discord.js for accessing the discord api
import { Client, Guild, Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js';

export class Bot {
    // discord.js Client object used for interfacing with Discord
    private client: Client;
    // token needed to connect `client` to the Discord API
    private readonly token: string;

    private reminders;

    private poll_data;
    
    constructor(client: Client, token: string) {
        this.client = client;
        this.token = token;
        this.reminders = JSON.parse(fs.readFileSync(`reminders.json`, 'utf8'));
        this.poll_data = JSON.parse(fs.readFileSync(`polls.json`, 'utf8'));
        console.log(`Constructed client. Found ${this.reminders.length} reminders and ${this.poll_data.length} polls cached on disk.`);
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
            console.log(`Saved ${this.reminders.length} reminders to reminders.json and ${this.poll_data.length} polls to polls.json.`);
        }, 300_000);
        
        // Check reminders every min, and remind users if appropriate
        setInterval(() => {
            let current_time = new Date().getTime();
            let new_reminders = [];
            for (let i = 0; i < this.reminders.length; i++) {
                let this_reminder = this.reminders[i];
                if (this_reminder.when <= current_time) {
                    let chan = this.client.guilds.resolve(this_reminder.guild_id).channels.resolve(this_reminder.channel_id) as TextChannel;
                        chan.send(`Hello ${this_reminder.user_atable}! This is your reminder! (${this_reminder.reminder})`);
                    console.log(`A reminder has been sent and removed from the list!`);
                }
                else {
                    new_reminders.push(this_reminder);
                }
            }
            this.reminders = new_reminders;
        }, 60_000);

        // Post patch notes for the bot, if applicable
        this.postUpdates();
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
                "name": "remindme",
                "description": "Set a reminder for the future",
                "options": [
                    {
                        "type": 4,
                        "name": "time",
                        "description": "How long until your reminder?",
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
            }
        ]);
    }
    /**
     * Check if the bot has updated to a new SemVer, and if it has, post patch notes.
     */
    private postUpdates() {
        // TODO: Check if we've updated, then post patch notes to update channels.
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
                /// TODO: all commands should be switched or hooked here
                console.log(`Interaction begin: /${interaction.commandName}`);
                switch (interaction.commandName) {
                    case "poll":
                        let poll_options = interaction.options.array();
                        let poll_question;
                        let poll_responses = [];
                        poll_options.forEach((option) => {
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
                            val_tmp.push(0);
                        });
                        visuals.setTitle(poll_question);
                        visuals.setDescription(tmp_text);
                        visuals.setFooter("make your own with /poll!");
                        interaction.reply({embeds: [visuals], components: [buttons]});
                        let msg = await interaction.fetchReply();
                        this.poll_data.push({
                            buttons: buttons.components,
                            message_id: msg.id,
                            values: val_tmp,
                            question: poll_question,
                            voted: []
                        });
                        break;
                    case "balls":
                        let message = new MessageEmbed();
                        message.setTitle("balls");
                        message.setDescription("balls");
                        message.setFooter("balls");
                        message.setImage(balls_responses[randZeroToMax(balls_responses.length)]);
                        message.setThumbnail(balls_responses[randZeroToMax(balls_responses.length)]);
                        interaction.reply({embeds: [message]});
                        break;
                    case "remindme":
                        let reminder = {};
                        let reminder_options = interaction.options.array();
                        let time_amount;
                        let time_unit;
                        let text;
                        reminder_options.forEach((option) => {
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
                        reminder["guild_id"] = interaction.guildId;
                        reminder["reminder"] = text;
                        interaction.reply({content: `Reminder set! \nYou will be reminded in ${time_amount} ${time_unit}.`});
                        this.reminders.push(reminder);
                        console.log(`Reminder added. Current count: ${this.reminders.length}`);
                        break;
                    default:
                        console.error("Encountered an interaction for a command that wasn't avalable!");
                        break;
                }
                console.log(`Interaction end: /${interaction.commandName}`);
            }
            if (interaction.isButton()) {
                /// TODO: all buttons should be managed here
                console.log(`Button interaction (customId: ${interaction.customId})`);
                switch (interaction.customId.split("|")[0]) {
                    case "poll":
                        this.poll_data.forEach((poll) => {
                            if (poll.message_id == interaction.message.id) {
                                for (let i = 0; i < poll.voted.length; i++) {
                                    if (interaction.member.user.id == poll.voted[i]) {
                                        interaction.reply({ephemeral: true, content: "You've already voted on this poll idiot :P"});
                                        console.log("User had already voted on this poll.");
                                        return;
                                    }
                                }
                                let button_index = 0;
                                let finished = false;
                                poll.buttons.forEach((button) => {
                                    if (button.customId == interaction.customId) {
                                        finished = true;
                                    }
                                    if (finished) {
                                        return;
                                    }
                                    button_index++;
                                });
                                poll.values[button_index]++;
                                let visuals = new MessageEmbed();
                                let tmp_text = "";
                                let total_votes = poll.voted.length;
                                for (let i = 0; i < poll.buttons.length; i++) {
                                    tmp_text = tmp_text + poll.buttons[i].label;
                                    tmp_text = tmp_text + ": ";
                                    tmp_text = tmp_text + poll.values[i];
                                    tmp_text = tmp_text + " ";
                                    tmp_text = tmp_text + '▇'.repeat(poll.values[i]);
                                    tmp_text = tmp_text + "\n";
                                }
                                visuals.setTitle(poll.question);
                                visuals.setDescription(tmp_text);
                                visuals.setFooter("make your own with /poll!");
                                let test_msg = interaction.message as Message;
                                test_msg.edit({embeds: [visuals]});
                                poll.voted.push(interaction.member.user.id);
                                console.log("Edited /poll message with new values following interaction.");
                                interaction.reply({ephemeral: true, content: "Voted!"});
                                return;
                            }
                        });
                        break;
                    default:
                        console.error("Encountered a button interaction for a command that wasn't avalable!");
                        break;
                }
            }
        })
        this.client.on('guildCreate', (guild: Guild) => {
            console.log(`Goblin was invited to a new guild! (${guild.name} with ${guild.memberCount} members)`);
        });
        this.client.on('guildDelete', (guild: Guild) => {
            console.log(`Goblin was removed from a guild... (${guild.name})`)
        })
        return this.client.login(this.token);
    }
}

// [0-max)
/**
 * Generates a random number between 0 and max, [inclusive, exclusive)
 * @param max - The maximum number to generate (exclusive)
 * @returns The number generated
 */
function randZeroToMax(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

/** This is the list of images used for `/balls`. */
const balls_responses = [
    // ball pit balls (1)
    "https://funandfunction.com/media/catalog/product/cache/d836d0aca748fb9367c92871c4ca1707/E/Q/EQ1643P_001.jpg",
    // various balls (2)
    "https://images-na.ssl-images-amazon.com/images/I/81S%2B7h513XL._AC_SL1500_.jpg",
    // basketballs (3)
    "https://i5.walmartimages.com/asr/a6545c29-961f-46ce-a02b-7f983c1b1d68_1.e895b89031a169c5768024a481465af8.jpeg",
    // tennis balls (4)
    "https://cdn.shopify.com/s/files/1/2006/8755/articles/unnamed_07beb919-3965-4407-9e81-1ad788eac4ca_1260x.jpg?v=1596476114",
    // ping pong balls (5)
    "https://i.pinimg.com/originals/b9/58/30/b9583014b1b7fd6aaafe3c7215145952.jpg",
    // volleyballs (6)
    "https://media.istockphoto.com/photos/white-volleyballs-picture-id1030316400",
    // footballs (7)
    "https://www.gophersport.com/cmsstatic/g-62318-wilsonncaa-Sizes.jpg?medium",
    // soccer balls (8)
    "https://s7.orientaltrading.com/is/image/OrientalTrading/VIEWER_ZOOM/realistic-soccer-ball-stress-balls~42_2092a",
    // pickle balls (9)
    "https://pickleballguide.net/wp-content/uploads/2019/12/Best-Pickleball-Balls-Thumbnail.jpg",
    // bowling balls (10)
    "https://www.gophersport.com/cmsstatic/img/834/G-45570-RainbowStrikerRubberBowlingBalls-clean.jpg",
    // ball mouse (11)
    "https://images-na.ssl-images-amazon.com/images/I/71lMgtxpDmL._AC_SL1500_.jpg",
    // yoga balls (12)
    "https://www.kakaos.com/prodimages/ka-abyb-2200-Lg.jpg",
    // bouncy balls (13)
    "https://images-na.ssl-images-amazon.com/images/I/71rPt9VjYNL._AC_SL1500_.jpg",
    // stress balls (14)
    "https://images-na.ssl-images-amazon.com/images/I/51W3-YY%2BAcL._AC_.jpg",
    // poke balls (15)
    "https://images-na.ssl-images-amazon.com/images/I/81JUMEWEhIL._AC_SL1500_.jpg",
    // pool balls (16)
    "https://cdn11.bigcommerce.com/s-c1tzcg0txe/images/stencil/1280x1280/products/1916/2672/ozonepark_2465_773603528__63614.1490639043.jpg?c=2",
    // cheese balls (17)
    "https://images-na.ssl-images-amazon.com/images/I/717BQwpafqL._SL1500_.jpg",
    // baseballs (18)
    "https://sportshub.cbsistatic.com/i/r/2019/09/25/d32d28df-c89b-46d4-855c-c243af545fdb/thumbnail/1200x675/507126c5b7e654fdc1f629b87139ede8/mlb-baseballs.jpg",
    // dodgeballs (19)
    "https://m.media-amazon.com/images/I/81CCz-2TTSL._AC_SL1500_.jpg",
    // beach balls (20)
    "https://res.cloudinary.com/gray-malin/image/upload/c_scale,w_1000,q_80,f_auto/gray-malin/products/Beach-Balls_(2).jpg?updated=1507731558",
    // gumballs (21)
    "https://m.media-amazon.com/images/I/51z7Zc2RwFL._SX425_.jpg",
    // cricket balls (22)
    "https://m.media-amazon.com/images/I/718v4VFCBHL._AC_.jpg",
    // disco balls (23)
    "https://previews.123rf.com/images/pilgrimiracle/pilgrimiracle1701/pilgrimiracle170100002/69770390-disco-balls-on-the-ceiling.jpg",
    // yarn balls (24)
    "https://previews.123rf.com/images/pjjaruwan/pjjaruwan1501/pjjaruwan150100003/35077423-colorful-wool-yarn-balls.jpg",
];
