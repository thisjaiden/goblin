import { Client, CommandInteraction, User } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

const fight_inf = {
    "name": "fight",
    "description": "Fight a friend or foe",
    "options": [
      {
        "type": 6,
        "name": "opponent",
        "description": "The person to fight",
        "default": false,
        "required": true
      },
      {
        "type": 6,
        "name": "opponent2",
        "description": "An additional person to replace yourself in the fight",
        "default": false,
        "required": false
      }
    ]
};

export function registerFight(commandman: CommandManager) {
    commandman.registerInteraction(fight_inf, fight);
}

function fight(interaction: CommandInteraction, man: Guildman, client: Client) {
    if (!interaction.channel) {
        new EmbedBuilder()
            .title("This command does not work in DMs.")
            .color("red")
            .interact(interaction, client, man);
        return;
    }
    let users_mentioned: Array<User> = [];
    if (interaction.options.array().length == 1) {
        users_mentioned.push(interaction.options[0].user);
        users_mentioned.push(interaction.user);
    }
    else {
        users_mentioned.push(interaction.options[0].user);
        users_mentioned.push(interaction.options[1].user);
    }
    if (randInt(2) == 1) {
        let tmp = users_mentioned[0];
        users_mentioned[0] = users_mentioned[1];
        users_mentioned[1] = tmp;
    }
    let rand_select = responses[randInt(responses.length)];
    new EmbedBuilder()
        .title(rand_select[0])
        .text(users_mentioned[0].toString() + rand_select[1] + users_mentioned[1].toString() + rand_select[2])
        .thumbnail(rand_select[3])
        .color(rand_select[4])
        .footer("/fight to start your own")
        .interact(interaction, client, man);
    return true;
}

const responses = [
    [
        "A fight breaks out in the cafeteria.",
        " beats the everloving SHIT out of ",
        ", who dies from their wounds.",
        "https://cdn.britannica.com/73/191073-050-BCEB0132/reaper-death.jpg",
        "red"
    ],
    [
        "Well this is akward...",
        " summons a baby which throws up on ",
        ".",
        "https://i0.wp.com/post.healthline.com/wp-content/uploads/2020/05/yawning_overtired_baby-1296x728-header.jpg?w=1155&h=1528",
        "yellow"
    ],
    [
        "Someone's been taking boxing lessons.",
        " sucker punches ",
        ".",
        "",
        "yellow"
    ],
    [
        "Who's laughing now?",
        " kicked ",
        " in the balls.",
        "",
        "red"
    ],
    [
        "__**FATALITY**__",
        " snapped ",
        " neck.",
        "",
        "red"
    ],
    [
        "Fuck you gargy, you're responsible for me adding this",
        " pissed on ",
        ". Fucking disgusting.",
        "",
        "yellow"
    ],
    [
        "Celery more like you're dead.",
        " tried to take Jasper's celery, and ",
        " beat them up over it.",
        "https://freshpoint.com/wp-content/uploads/commodity-celery.jpg",
        "green"
    ],
    [ // 10
        "Now watch me whip!",
        " nae naed on ",
        ".",
        "",
        "yellow"
    ]
];

// [0-max)
function randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
