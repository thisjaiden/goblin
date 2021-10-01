// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

export function translate_en_us(key) {
    switch (key) {
        case "lang.en_us":
            return "English (American)";
        case "lang.en_ca":
            return "English (Canadian)";
        case "lang.fr":
            return "French";
        case "lang.sp":
            return "Spanish";
        case "lang.switch.en_us":
            return "Switched language to English (American)";
        case "lang.switch.en_ca":
            return "Switched language to English (Canadian)";
        case "poll.dms":
            return "You can't create a poll in DMs.";
        case "help.text":
            return stripIndents`
                /balls - Shows a picture of balls. Genuinely SFW.
                /eightball - Answers all your deepest questions.
                /flavor - Ever wondered what flavor you are? Find out now.
                /invite - Get the invite link for Goblin. <3
                /poll - Ask everyone a question.
                /rps - Challenge someone to rock paper scissors.
                /feedback - Give feedback and suggest features.
                /anon - Post a message anonomously.
                /game - Play a fun game!
                /remindme - Set a reminder for yourself.
                /riddle - Get a riddle.
                /admin - Run basic admin commands.
                /language - Select a language for Goblin to use with you.
            `;
        case "help.snitch.enabled":
            return "ENABLED";
        case "help.snitch.disabled":
            return "DISABLED";
        case "help.snitch.pre":
            return "Snitching is ";
        case "help.snitch.post":
            return " on this server.";
        case "game.title":
            return ", are you suffering from Gaming Disorder?";
        case "game.description":
            return "Try the following resource:\n";
        case "game.url":
            return "https://www.who.int/news-room/q-a-detail/addictive-behaviours-gaming-disorder";
        case "feedback.text":
            return "Feedback received!";
        case "bot.version":
            return "4.8.0";
        default:
            return key;
    }
}


