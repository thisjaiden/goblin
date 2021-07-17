//import { MessageActionRow, MessageButton } from "discord-buttons";
import { MessageEmbed, Client, DMChannel, Interaction, Message, MessageReaction, NewsChannel, ReactionEmoji, TextChannel, MessageActionRow, BaseMessageComponent, MessageButton } from "discord.js";
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
    public button = function(style: string, label: string, onreact?: (button_details: any, man: Guildman) => void): EmbedBuilder {
        let partial = {
            is_disabled: false,
            style: "",
            label: "",
            type: "button",
            onreact: onreact
        };
        if (style.includes("https://")) {
            partial.style = "url";
            partial["url"] = partial.style;
        }
        else {
            partial.style = style;
        }
        partial.label = label;
        this.contents.push(partial);
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
            let ems = em[0];
            for (let i = 0; i < this.contents.length; i++) {
                if (this.contents[i].type == "response") {
                    ems.react(this.contents[i].emoji);
                    man.addReactionCallback(
                        ems,
                        this.contents[i].emoji,
                        this.contents[i].callback
                    )
                }
            }
        }).catch(console.error);
    }
    public interact(interaction: Interaction, client: Client, man: Guildman) {
        let msg = new MessageEmbed();
        let actionrow;
        actionrow = new MessageActionRow();
        let components = [];
        let contains_response = false;
        
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
            if (this.contents[i].type == "response") {
                contains_response = true;
            }
            if (this.contents[i].type == "button") {
                console.log("button detected");
                if (this.contents[i].style == "url") {
                }
                else {
                    console.log("non-url");
                    console.log("details:");
                    console.log(JSON.stringify({
                        style: this.contents[i].style,
                        label: this.contents[i].label,
                        disabled: this.contents[i].is_disabled,
                        customId: "unknown"
                    }));
                    if (this.contents[i].onreact) {
                        console.log("adding button callback to list");
                        let id = man.addButtonCallback(interaction.guildId, true, this.contents[i].onreact)
                        let mb = new MessageButton({
                            style: this.contents[i].style,
                            label: this.contents[i].label,
                            disabled: this.contents[i].is_disabled,
                            customId: id
                        })
                        components.push(mb);
                    }
                    else {
                        components.push(
                            new MessageButton(
                                {
                                    style: this.contents[i].style,
                                    label: this.contents[i].label,
                                    disabled: this.contents[i].is_disabled,
                                    customId: man.get_custom_id()
                                }
                            )
                        );
                    }
                }
            }
        }
        actionrow.addComponents(components);
        console.log(`Sending interaction with components: ${JSON.stringify(actionrow)}`);
        if (!interaction.isCommand()) return;
        if (actionrow.components.length > 0) {
            if (!contains_response) {
                interaction.reply({embeds: [msg.toJSON()], components: [actionrow]});
            }
            else {
                if (!interaction.channel.isText()) return
                //interaction.defer(true);
                interaction.reply("creating poll...").then(() => {
                    interaction.deleteReply();
                });
                interaction.channel.send({embeds: [msg.toJSON()], components: [actionrow]}).then((em) => {
                    for (let i = 0; i < this.contents.length; i++) {
                        if (this.contents[i].type == "response") {
                            em.react(this.contents[i].emoji);
                            man.addReactionCallback(
                                em,
                                this.contents[i].emoji,
                                this.contents[i].callback
                            );
                        }
                    }
                    return true;
                }).catch(console.error);
                return true;
            }
            return true;
        }
        else {
            if (!contains_response) {
                interaction.reply({embeds: [msg.toJSON()]});
            }
            else {
                if (!interaction.channel.isText()) return
                //interaction.defer(true);
                interaction.reply("creating poll...").then(() => {
                    interaction.deleteReply();
                });
                interaction.channel.send({embeds: [msg.toJSON()]}).then((em) => {
                    for (let i = 0; i < this.contents.length; i++) {
                        if (this.contents[i].type == "response") {
                            em.react(this.contents[i].emoji);
                            man.addReactionCallback(
                                em,
                                this.contents[i].emoji,
                                this.contents[i].callback
                            );
                        }
                    }
                    return true;
                }).catch(console.error);
                return true;
            }
            return true;
        }
    }
}
