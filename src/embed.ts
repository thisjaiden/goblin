import { DMChannel, MessageReaction, NewsChannel, ReactionEmoji, TextChannel } from "discord.js";
import { Guildman } from "./guildman";

const Discord = require('discord.js');

export class EmbedBuilder {
    private contents = [];
    constructor () {
        this.contents = [];
        return this;
    }
    public title = function(text: string, link?: string): EmbedBuilder {
        if (!link) {
            this.contents.push({type: "title", content: text, redirect: -1});
        }
        else {
            this.contents.push({type: "title", content: text, redirect: link});
        }
        return this;
    }
    public text = function(text: string): EmbedBuilder {
        this.contents.push({type: "text", content: text});
        return this;
    }
    public footer = function(text: string, image?: string): EmbedBuilder {
        if (!image && text) {
            this.contents.push({type: "footer", content: text, image: -1});
        }
        if (image && !text) {
            this.contents.push({type: "footer", content: -1, image});
        }
        if (image && text) {
            this.contents.push({type: "footer", content: text, image});
        }
        return this;
    }
    public image = function(image: string): EmbedBuilder {
        this.contents.push({type: "image", content: image});
        return this;
    }
    public thumbnail = function(image: string): EmbedBuilder {
        this.contents.push({type: "thumbnail", content: image});
        return this;
    }
    public color = function(color: string): EmbedBuilder {
        switch (color) {
            case "blue":
                this.contents.push({type: "color", content: "#1dbef0"});
                break;
            case "green":
                this.contents.push({type: "color", content: "#34eb52"});
                break;
            case "red":
                this.contents.push({type: "color", content: "#d93030"});
                break;
            case "yellow":
                this.contents.push({type: "color", content: "#ffdb57"});
                break;
            case "black":
                this.contents.push({type: "color", content: "#000000"});
                break;
            case "white":
                this.contents.push({type: "color", content: "#FFFFFF"});
                break;
            default:
                this.contents.push({type: "color", content: color});
                break;
        }
        return this;
    }
    public response = function(emoji: string, onreact?: (reaction: MessageReaction, man: Guildman) => void): EmbedBuilder {
        this.contents.push({type: "response", emoji, callback: onreact});
        return this;
    }
    public send = function(channel: TextChannel | DMChannel | NewsChannel, man?: Guildman) {
        let msg = new Discord.MessageEmbed();
        for (let i = 0; i < this.contents.length; i++) {
            if (this.contents[i].type == "color") {
                msg.setColor(this.contents[i].content);
            }
            if (this.contents[i].type == "title") {
                msg.setTitle(this.contents[i].content);
                if (this.contents[i].redirect != -1) {
                    msg.setURL(this.contents[i].redirect);
                }
            }
            if (this.contents[i].type == "image") {
                msg.setImage(this.contents[i].content);
            }
            if (this.contents[i].type == "thumbnail") {
                msg.setThumbnail(this.contents[i].content)
            }
            if (this.contents[i].type == "footer") {
                if (this.contents[i].image == -1) {
                    msg.setFooter(this.contents[i].content);
                }
                else {
                    msg.setFooter(this.contents[i].content, this.contents[i].image);
                }
            }
            if (this.contents[i].type == "text") {
                msg.setDescription(this.contents[i].content);
            }
        }
        channel.send(msg).then((em) => {
            for (let i = 0; i < this.contents.length; i++) {
                if (this.contents[i].type == "response") {
                    em.react(this.contents[i].emoji);
                    if (!man) {
                        // this is ok? if the reaction doesnt have a callback
                        // console.warn("An embed was created without a man ref but with a reaction.");
                        // return;
                    }
                    else {
                        man.addReactionCallback(
                            em,
                            this.contents[i].emoji,
                            this.contents[i].callback
                        )
                    }
                }
            }
        }).catch(console.error);
    }
}
