import { Guildman } from "../../guildman";

// [0-max)
export function randZeroToMax(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// [min, max)
export function randMinToMax(min, max) {
    return Math.floor(Math.random() * Math.floor(max - min)) + min;
}

export function newGameDataStructure(): Object {
    return {
        setup: true,
        player_stats: {
            hp: 10,
            max_hp: 10,
            mana: 10,
            max_mana: 10,
            strength: 10,
            agility: 10,
            gold: 0
        },
        player_equipment: [

        ],
        player_spells: [

        ],
        room_allocations: [
            "fight",
            "merchant"
        ]
    };
}

export function getGameData(man: Guildman, guild_id: string): Object {
    return man.getGuildField(guild_id, "game");
}

export function setGameData(man: Guildman, guild_id: string, data: Object) {
    man.setGuildField(guild_id, "game", data);
}

export function isGameActive(man: Guildman, guild_id: string): boolean {
    if (man.getGuildField(guild_id, "game").setup) {
        return true;
    }
    return false;
}
