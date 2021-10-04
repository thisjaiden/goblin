import { translate_en_us } from "./en_us";
import { translate_en_ca } from "./en_ca";
import { translate_fr } from "./fr";
import { translate_sp } from "./sp";

/// Default language
export const DEFAULT_LANG = "en_us";

export function translate_string(key, lang) {
    switch (lang) {
        case "en_us":
            return translate_en_us(key);
        case "en_ca":
            return translate_en_ca(key);
        case "fr":
            return translate_fr(key);
        case "sp":
            return translate_sp(key);
        default:
            return "ERROR: INVALID LANG";
    }
}

export function find_lang(list, inter) {
    for (let i = 0; i < list.length; i++) {
        if (inter.user.id == list[i]["user_id"]) {
            return list[i]["lang_id"];
        }
    }
    return DEFAULT_LANG;
}

export function random_string(list) {
    return list[randZeroToMax(list.length)];
}

/**
 * Generates a random number between 0 and max, [inclusive, exclusive)
 * @param max - The maximum number to generate (exclusive)
 * @returns The number generated
 */
 function randZeroToMax(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}
