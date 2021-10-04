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
        case "poll.dms":
            return "You can't create a poll in DMs.";
        case "help.text":
            return stripIndents`
                /admin - Run basic admin commands.
                /anon - Post a message anonomously.
                /balls - Shows a picture of balls. Genuinely SFW.
                /eightball - Answers all your deepest questions.
                /feedback - Give feedback and suggest features.
                /flavor - Ever wondered what flavor you are? Find out now.
                /game - Play a fun game!
                /invite - Get the invite link for Goblin. <3
                /poll - Ask everyone a question.
                /language - Select a language for Goblin to use with you.
                /remindme - Set a reminder for yourself.
                /riddle - Get a riddle.
                /rps - Challenge someone to rock paper scissors.
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
        case "role.remove":
            return "Role removed!";
        case "role.grant":
            return "Role given!";
        case "snitch.text":
            return "Hey, someone said some concerning things as anon in your server. Here's a bit more info on them. Make sure they're ok!"
        case "admin.permission":
            return "You don't have permission to use /admin here!";
        case "admin.unknown":
            return "Unknown command. Try `/admin help` for a list of commands.";
        case "admin.roles.text":
            return "Reaction roles!";
        case "admin.roles.arguments":
            return "Invalid arguments.";
        case "admin.help.text":
            return "removeMessages x \\|| reactionRoles a b c ... z \\|| disableAnon \\|| enableAnon \\|| enableSnitching \\|| disableSnitching";
        case "balls.url":
            return random_string([
                "https://funandfunction.com/media/catalog/product/cache/d836d0aca748fb9367c92871c4ca1707/E/Q/EQ1643P_001.jpg",
                "https://images-na.ssl-images-amazon.com/images/I/81S%2B7h513XL._AC_SL1500_.jpg",
                "https://i5.walmartimages.com/asr/a6545c29-961f-46ce-a02b-7f983c1b1d68_1.e895b89031a169c5768024a481465af8.jpeg",
                "https://cdn.shopify.com/s/files/1/2006/8755/articles/unnamed_07beb919-3965-4407-9e81-1ad788eac4ca_1260x.jpg?v=1596476114",
                "https://i.pinimg.com/originals/b9/58/30/b9583014b1b7fd6aaafe3c7215145952.jpg",
                "https://media.istockphoto.com/photos/white-volleyballs-picture-id1030316400",
                "https://www.gophersport.com/cmsstatic/g-62318-wilsonncaa-Sizes.jpg?medium",
                "https://s7.orientaltrading.com/is/image/OrientalTrading/VIEWER_ZOOM/realistic-soccer-ball-stress-balls~42_2092a",
                "https://pickleballguide.net/wp-content/uploads/2019/12/Best-Pickleball-Balls-Thumbnail.jpg",
                "https://www.gophersport.com/cmsstatic/img/834/G-45570-RainbowStrikerRubberBowlingBalls-clean.jpg",
                "https://images-na.ssl-images-amazon.com/images/I/71lMgtxpDmL._AC_SL1500_.jpg",
                "https://www.kakaos.com/prodimages/ka-abyb-2200-Lg.jpg",
                "https://images-na.ssl-images-amazon.com/images/I/71rPt9VjYNL._AC_SL1500_.jpg",
                "https://images-na.ssl-images-amazon.com/images/I/51W3-YY%2BAcL._AC_.jpg",
                "https://images-na.ssl-images-amazon.com/images/I/81JUMEWEhIL._AC_SL1500_.jpg",
                "https://cdn11.bigcommerce.com/s-c1tzcg0txe/images/stencil/1280x1280/products/1916/2672/ozonepark_2465_773603528__63614.1490639043.jpg?c=2",
                "https://images-na.ssl-images-amazon.com/images/I/717BQwpafqL._SL1500_.jpg",
                "https://sportshub.cbsistatic.com/i/r/2019/09/25/d32d28df-c89b-46d4-855c-c243af545fdb/thumbnail/1200x675/507126c5b7e654fdc1f629b87139ede8/mlb-baseballs.jpg",
                "https://m.media-amazon.com/images/I/81CCz-2TTSL._AC_SL1500_.jpg",
                "https://res.cloudinary.com/gray-malin/image/upload/c_scale,w_1000,q_80,f_auto/gray-malin/products/Beach-Balls_(2).jpg?updated=1507731558",
                "https://m.media-amazon.com/images/I/51z7Zc2RwFL._SX425_.jpg",
                "https://m.media-amazon.com/images/I/718v4VFCBHL._AC_.jpg",
                "https://previews.123rf.com/images/pilgrimiracle/pilgrimiracle1701/pilgrimiracle170100002/69770390-disco-balls-on-the-ceiling.jpg",
                "https://previews.123rf.com/images/pjjaruwan/pjjaruwan1501/pjjaruwan150100003/35077423-colorful-wool-yarn-balls.jpg",
            ]);
        case "bot.version":
            return "4.8.0";
        default:
            return key;
    }
}


