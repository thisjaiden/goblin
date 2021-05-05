import { TextChannel, DMChannel, NewsChannel } from "discord.js";
import { Guildman } from "../../guildman";
import { getGameData, randZeroToMax } from "./utils";
import { encounterRoom as fightRoom } from "./rooms/fight";
import { encounterRoom as merchantRoom } from "./rooms/merchant";

export function encounterNewRoom(channel: TextChannel | NewsChannel, man: Guildman) {
    let possible_rooms = getGameData(man, channel.guild.id)["room_allocations"];
    let room_picked = possible_rooms[randZeroToMax(possible_rooms.length)]
    switch (room_picked) {
        case "fight":
            fightRoom(channel, man);
            break;
        case "merchant":
            merchantRoom(channel, man);
            break;
        default:
            console.error(`An unknown room with the dynamic name ${room_picked} was requested.`);
            encounterNewRoom(channel, man);
            break;
    }
}