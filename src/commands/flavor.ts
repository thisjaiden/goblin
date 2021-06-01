import { CommandInteraction } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerFlavor(commandman: CommandManager) {
    commandman.registerInteraction(
        {
            name: "flavor",
            description: "Get your flavor!"
        },
        flv_interact
    );
}

function flv_interact(interaction: CommandInteraction, man: Guildman): boolean {
    let rand_select = responses[randInt(responses.length)];
    new EmbedBuilder()
        .title("**ANNOUNCEMENT**")
        .text(`"${interaction.member} is __${rand_select[0]}__"`)
        .footer("Get your own: /flavor")
        .color(rand_select[1])
        .interact(interaction);
    return true;
}

const responses = [
    // Real flavors (14)
    ["Grape Flavored", "#ab339f"],
    ["Strawberry Flavored", "#db2323"],
    ["Blueberry Flavored", "#243fd6"],
    ["Lemon Flavored", "#edfa7d"],
    ["Sour Flavored", "#a8db74"],
    ["Sweet Flavored", "#f78172"],
    ["Blueberry Flavored", "#3f3dd9"],
    ["Avacado Flavored", "#1c613b"],
    ["Not Flavored :cry:", "#3b6fd1"],
    ["Cotton Candy Flavored", "#87eaf5"],
    ["Apple Flavored", "#c41b1b"],
    ["Banana Flavored", "#e6da32"],
    ["Cherry Flavored", "#7d040a"],
    ["Cinnamon Flavored", "#913f04"],
    // Unusual flavors (15)
    ["Green Flavored", "#24d63f"],
    ["**~~VOID~~** Flavored", "#000000"],
    ["Heaven Flavored", "#ffffff"],
    ["War Crime Flavored", "#ff0000"],
    ["Sky Flavored", "#5fc5ed"],
    ["Weed Flavored", "#31f76a"],
    ["Shart Flavored", "#5e2d0f"],
    ["Milf Flavored", "#a221bf"],
    ["Ronald Flavored :beronald:", "#000000"],
    ["Gasoline Flavored", "#a9d9ae"],
    ["Cum Flavored", "#d4d4d4"],
    ["Breast Milk Flavored", "#d4d4d4"],
    ["Blood Flavored", "#941212"],
    ["Unseasoned :cry:", "#3b6fd1"],
    ["Unsweetened :cry:", "#3b6fd1"],
    // Unrelated to flavors (6)
    ["Orange Orange Orange Orange Orange", "#f2992c"],
    ["dead", "#473838"],
    ["wanted on multiple counts of manslaughter", "#75161d"],
    ["**Chunky Monkey**", "#693d15"],
    ["Piss", "#dde080"],
    ["not avalable. Please leave a message, after the tone. **BEEEEEEP**", "#52876c"]
];

// [0-max)
function randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
