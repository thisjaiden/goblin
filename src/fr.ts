import { random_string } from "./lang";

// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

export function translate_fr(key) {
    switch (key) {
        case "lang.en_us":
            return "Anglais (Américain)";
        case "lang.en_ca":
            return "Anglais (Canadien)";
        case "lang.fr":
            return "Français";
        case "lang.sp":
            return "Espagnol";
        case "lang.switch.en_us":
            return "Langue changée en anglais (américain)";
        case "lang.switch.en_ca":
            return "Langue changée en anglais (canadien)";
        case "lang.switch.fr":
            return "Langue changée en français";
        case "lang.switch.sp":
            return "Langue changée en espagnol";
        case "bot.version":
            return "4,8,0";
        default:
            return key;
    }
}


