import { Client, Interaction } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";
 
export function registerBalls(commandman: CommandManager) {
    commandman.registerInteraction(
        {
            name: "balls",
            description: "Get a picture of balls"
        },
        balls
    );
}

function balls(interaction: Interaction, man: Guildman, client: Client): boolean {
    new EmbedBuilder()
        .title("Balls")
        .text("balls")
        .image(responses[randInt(responses.length)])
        .color("blue")
        .footer("balls")
        .interact(interaction, client, man);
    return true;
}

const responses = [
    // ball pit balls (1)
    "https://funandfunction.com/media/catalog/product/cache/d836d0aca748fb9367c92871c4ca1707/E/Q/EQ1643P_001.jpg",
    // various balls (2)
    "https://images-na.ssl-images-amazon.com/images/I/81S%2B7h513XL._AC_SL1500_.jpg",
    // basketballs (3)
    "https://i5.walmartimages.com/asr/a6545c29-961f-46ce-a02b-7f983c1b1d68_1.e895b89031a169c5768024a481465af8.jpeg",
    // tennis balls (4)
    "https://cdn.shopify.com/s/files/1/2006/8755/articles/unnamed_07beb919-3965-4407-9e81-1ad788eac4ca_1260x.jpg?v=1596476114",
    // ping pong balls (5)
    "https://i.pinimg.com/originals/b9/58/30/b9583014b1b7fd6aaafe3c7215145952.jpg",
    // volleyballs (6)
    "https://media.istockphoto.com/photos/white-volleyballs-picture-id1030316400",
    // footballs (7)
    "https://www.gophersport.com/cmsstatic/g-62318-wilsonncaa-Sizes.jpg?medium",
    // soccer balls (8)
    "https://s7.orientaltrading.com/is/image/OrientalTrading/VIEWER_ZOOM/realistic-soccer-ball-stress-balls~42_2092a",
    // pickle balls (9)
    "https://pickleballguide.net/wp-content/uploads/2019/12/Best-Pickleball-Balls-Thumbnail.jpg",
    // bowling balls (10)
    "https://www.gophersport.com/cmsstatic/img/834/G-45570-RainbowStrikerRubberBowlingBalls-clean.jpg",
    // ball mouse (11)
    "https://images-na.ssl-images-amazon.com/images/I/71lMgtxpDmL._AC_SL1500_.jpg",
    // yoga balls (12)
    "https://www.kakaos.com/prodimages/ka-abyb-2200-Lg.jpg",
    // bouncy balls (13)
    "https://images-na.ssl-images-amazon.com/images/I/71rPt9VjYNL._AC_SL1500_.jpg",
    // stress balls (14)
    "https://images-na.ssl-images-amazon.com/images/I/51W3-YY%2BAcL._AC_.jpg",
    // poke balls (15)
    "https://images-na.ssl-images-amazon.com/images/I/81JUMEWEhIL._AC_SL1500_.jpg",
    // pool balls (16)
    "https://cdn11.bigcommerce.com/s-c1tzcg0txe/images/stencil/1280x1280/products/1916/2672/ozonepark_2465_773603528__63614.1490639043.jpg?c=2",
    // cheese balls (17)
    "https://images-na.ssl-images-amazon.com/images/I/717BQwpafqL._SL1500_.jpg",
    // baseballs (18)
    "https://sportshub.cbsistatic.com/i/r/2019/09/25/d32d28df-c89b-46d4-855c-c243af545fdb/thumbnail/1200x675/507126c5b7e654fdc1f629b87139ede8/mlb-baseballs.jpg",
    // dodgeballs (19)
    "https://m.media-amazon.com/images/I/81CCz-2TTSL._AC_SL1500_.jpg",
    // beach balls (20)
    "https://res.cloudinary.com/gray-malin/image/upload/c_scale,w_1000,q_80,f_auto/gray-malin/products/Beach-Balls_(2).jpg?updated=1507731558",
    // gumballs (21)
    "https://m.media-amazon.com/images/I/51z7Zc2RwFL._SX425_.jpg",
    // cricket balls (22)
    "https://m.media-amazon.com/images/I/718v4VFCBHL._AC_.jpg",
    // disco balls (23)
    "https://previews.123rf.com/images/pilgrimiracle/pilgrimiracle1701/pilgrimiracle170100002/69770390-disco-balls-on-the-ceiling.jpg",
    // yarn balls (24)
    "https://previews.123rf.com/images/pjjaruwan/pjjaruwan1501/pjjaruwan150100003/35077423-colorful-wool-yarn-balls.jpg",
];

// [0-max)
function randInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
