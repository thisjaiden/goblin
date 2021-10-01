export function translate_sp(key) {
    switch (key) {
        case "lang.en_us":
            return "English (American)";
        case "lang.en_ca":
            return "English (Canadian)";
        case "lang.fr":
            return "French";
        case "lang.sp":
            return "Spanish";
        case "bot.version":
            return "4,8,0";
        default:
            return "ERROR: INVALID KEY";
    }
}

