import { Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerFight(commandman: CommandManager) {
    commandman.registerCommand("fight", false, fight);
}

function fight(message: Message, parsed_message: string, man: Guildman): boolean {
    if (!(man.getGuildField(message.guild.id, "fight_enabled"))) {
        // This command is disabled by guild prefrences.
        return;
    }
    let users_mentioned = message.mentions.users.array();
    if (!(users_mentioned.length == 2)) {
        new EmbedBuilder()
            .title("Not enough arguments.")
            .text("Usage: `!fight @user1 @user2`")
            .footer("!fight to start your own")
            .color("red")
            .send(message.channel);
        return false;
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
        .footer("!fight to start your own")
        .send(message.channel);
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
        "Well this is akward...",
        " summons DaBaby who rap-battles ",
        " out of the room.",
        "https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_600/Dababy_BabyOnBaby.jpg",
        "yellow"
    ],
    [
        "Holy Shit It's TommyInnit Oh God Oh Fuck",
        " fell over after TommyInnit walked into the room, collapsing on top of ",
        ".",
        "https://static.wikia.nocookie.net/youtube/images/1/15/TommyOutit.jpg/revision/latest/zoom-crop/width/360/height/360?cb=20200916160817",
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
    [
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
