import { Message } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerFlavor(commandman: CommandManager) {
    commandman.registerCommand("flavor", false, flv);
}

function flv(message: Message, parsed_message: string, man: Guildman): boolean {
    // TODO: Decline if disabled by guild
    // TODO: read rest of message (seeding)
    let rand_select = responses[randInt(responses.length)];
    new EmbedBuilder()
        .title("**ANNOUNCEMENT**")
        .text(`"${message.author} is __${rand_select[0]}__"`)
        .footer("Get your own: !flavor")
        .color(rand_select[1])
        .send(message.channel);
    return true;
}

const responses = [
    ["Grape Flavored", "#ab339f"],
    ["Strawberry Flavored", "#db2323"],
    ["Orange Orange Orange Orange Orange", "#f2992c"],
    ["Blueberry Flavored", "#243fd6"],
    ["Green Flavored", "#24d63f"],
    ["**~~VOID~~** Flavored", "#000000"],
    ["Heaven Flavored", "#ffffff"],
    ["War Crime Flavored", "#ff0000"],
    ["dead", "#473838"],
    ["wanted on multiple counts of manslaughter", "#75161d"],
    ["Lemon Flavored", "#edfa7d"],
    ["Sour Flavored", "#a8db74"],
    ["Sweet Flavored", "#f78172"],
    ["Blueberry Flavored", "#3f3dd9"],
    ["Sky Flavored", "#5fc5ed"],
    ["Weed Flavored", "#31f76a"],
    ["Shart Flavored", "#5e2d0f"],
    ["Milf Flavored", "#a221bf"],
    ["Ronald Flavored :beronald:", "#000000"],
    ["Avacado Flavored", "#1c613b"],
    ["**Chunky Monkey**", "#693d15"],
    ["Gasoline Flavored", "#a9d9ae"],
    ["Not Flavored :cry:", "#3b6fd1"],
    ["Unseasoned :cry:", "#3b6fd1"],
    ["Unsweetened :cry:", "#3b6fd1"],
    ["Cum Flavored", "#d4d4d4"],
    ["Breast Milk Flavored", "#d4d4d4"],
    ["Piss", "#dde080"],
    ["not avalable. Please leave a message, after the tone. **BEEEEEEP**", "#52876c"],
    
];

// [0-max)
function randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
