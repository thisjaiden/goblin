// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

export function translate_string(key) {
    switch (key) {
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
                /remindme - Set a reminder for yourself.
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
        case "admin.dm":
            return "You can't use /admin in DMs.";
        case "admin.anon.disable":
            return "Anon has been disabled in this server.";
        case "admin.anon.disabled":
            return "Anon is already disabled in this server.";
        case "admin.anon.enable":
            return "Anon has been enabled in this server.";
        case "admin.snitching.enable":
            return "Snitching has been enabled in this server.";
        case "admin.snitching.enabled":
            return "Snitching is already enabled in this server.";
        case "admin.snitching.disable":
            return "Snitching has been disabled in this server.";
        case "admin.help.text":
            return "removeMessages x \\|| reactionRoles a b c ... z \\|| disableAnon \\|| enableAnon \\|| enableSnitching \\|| disableSnitching";
        case "anon.disabled":
            return "Anon is disabled in this server.";
        case "anon.sent":
            return "Message sent.";
        case "flavor.title":
            return "**ANNOUNCEMENT**";
        case "flavor.text":
            return " is ";
        case "flavor.flavor":
            return random_string([
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
                ["not avalable. Please leave a message, after the tone. **BEEEEEEP**", "#52876c"],
                ["Frog", "#00FF00"]
            ]);
        case "eightball.title":
            return " asked ";
        case "eightball.text":
            return "**Magic eight ball says...**\n";
        case "eightball.response":
            return random_string([
                // yes (6)
                ["sure", "GREEN"],
                ["absoulutely", "GREEN"],
                ["yes", "GREEN"],
                ["yeah...", "GREEN"],
                ["of course!", "GREEN"],
                ["indeed.", "GREEN"],
                // unclear (3)
                ["okeydokey", "BLUE"],
                ["the answer is ambigous.", "BLUE"],
                ["i am __eight (8) ball__", "BLUE"],
                // maybe (4)
                ["idk", "YELLOW"],
                ["maybe", "YELLOW"],
                ["possibly.", "YELLOW"],
                ["why ask *me*? I don't know.", "YELLOW"],
                // no (7)
                ["nah", "RED"],
                ["**FUCK NO!**", "RED"],
                ["stupid question, obviously not", "RED"],
                ["no", "RED"],
                ["nope", "RED"],
                ["no way", "RED"],
                ["negative.", "RED"]
            ]);
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
        case "format.quote.left":
            return "\"";
        case "format.quote.right":
            return "\"";
        case "bot.version":
            return "4.9.0";
        default:
            return key;
    }
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
