// commontags allows more diverse usage of `` tags
const commontags = require('common-tags');
const stripIndents = commontags.stripIndents;

import { CommandInteraction } from "discord.js";
import { CommandManager } from "../../command";
import { EmbedBuilder } from "../../embed";
import { Guildman } from "../../guildman";

const prefrences_inf = {
    name: "preferences",
    description: "Change settings about Goblin Child",
    options: [
        {
            type: 2,
            name: "list",
            description: "View the current prefrences for Goblin Child",
            options: [
                {
                    type: 1,
                    name: "all",
                    description: "Lists all prefrences for Goblin Child",
                    options: []
                }
            ]
        },
        {
            type: 2,
            name: "set",
            description: "Change one of the settings",
            options: [
                {
                    type: 1,
                    name: "banme",
                    description: "Change if /banme is enabled",
                    options: [
                        {
                            type: 5,
                            name: "enabled",
                            description: "Change if /banme is enabled",
                            default: false,
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: "poll",
                    description: "Change if /poll is enabled",
                    options: [
                        {
                            type: 5,
                            name: "enabled",
                            description: "Change if /poll is enabled",
                            default: false,
                            required: true
                        }
                    ]
                },
                {
                    type: 1,
                    name: "flavor",
                    description: "Change if /flavor is enabled",
                    options: [
                        {
                            type: 5,
                            name: "enabled",
                            description: "Change if /flavor is enabled",
                            default: false,
                            required: true
                        }
                    ]
                },
        {
          "type": 1,
          "name": "fight",
          "description": "Change if /fight is enabled",
          "options": [
            {
              "type": 5,
              "name": "enabled",
              "description": "Change if /fight is enabled",
              "default": false,
              "required": true
            }
          ]
        },
        {
          "type": 1,
          "name": "dababy",
          "description": "Change if /dababy is enabled",
          "options": [
            {
              "type": 5,
              "name": "enabled",
              "description": "Change if /dababy is enabled",
              "default": false,
              "required": true
            }
          ]
        },
        {
          "type": 1,
          "name": "twitch_prime_refrences",
          "description": "Change if refrences to Twitch Prime should appear",
          "options": [
            {
              "type": 5,
              "name": "enabled",
              "description": "Change if refrences to Twitch Prime should appear",
              "default": false,
              "required": true
            }
          ]
        },
        {
          "type": 1,
          "name": "eightball",
          "description": "Change if /eightball is enabled",
          "options": [
            {
              "type": 5,
              "name": "enabled",
              "description": "Change if /eightball is enabled",
              "default": false,
              "required": true
            }
          ]
        }
      ]
    }
  ]
};

export function registerPrefrences(commandman: CommandManager) {
    commandman.registerInteraction(prefrences_inf, true, pref);
}

function pref(interaction: CommandInteraction, man: Guildman): boolean {
    if (interaction.options[0].name == "list") {
        let banme_ico = "❌";
        let poll_ico = "❌";
        let flavor_ico = "❌";
        let fight_ico = "❌";
        let dababy_ico = "❌";
        let eightball_ico = "❌";
        let twitch_prime_refrences_ico = "❌";
        let logging_ico = "❌";
        let updates_ico = "❌";
        let balls_ico = "❌";
        let game_ico = "❌";
        if (man.getGuildField(interaction.guild.id, "banme_enabled")) {
            banme_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "poll_enabled")) {
            poll_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "flavor_enabled")) {
            flavor_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "fight_enabled")) {
            fight_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "dababy_enabled")) {
            dababy_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "eightball_enabled")) {
            eightball_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "twitch_prime_refrences_enabled")) {
            twitch_prime_refrences_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "logging_channel") != "none") {
            logging_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "update_channel") != "none") {
            updates_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "balls_enabled")) {
            balls_ico = "✅";
        }
        if (man.getGuildField(interaction.guild.id, "game_enabled")) {
            game_ico = "✅";
        }
        new EmbedBuilder()
            .title(`Goblin Child Preferences`)
            // game              - ${game_ico}
            .text(stripIndents`
                **Commands**
                banme             - ${banme_ico}
                balls             - ${balls_ico}
                poll              - ${poll_ico}
                flavor            - ${flavor_ico}
                fight             - ${fight_ico}
                dababy            - ${dababy_ico} - DISABLED GLOBALLY
                eightball         - ${eightball_ico}
                **Command Refrences**
                Twitch Prime SMP  - ${twitch_prime_refrences_ico}
                **Events**
                updates           - ${updates_ico} (<#${man.getGuildField(interaction.guild.id, "update_channel")}>)
                logging           - ${logging_ico} (<#${man.getGuildField(interaction.guild.id, "logging_channel")}>)
            `)
            .color("blue")
            .interact(interaction);
    }
    else if (interaction.options[0].name == "set") {
        switch (interaction.options[0].options[0].name) {
            case "banme":
                man.setGuildField(interaction.guild.id, "banme_enabled", interaction.options[0].options[0].options[0].value);
                if (man.getGuildField(interaction.guild.id, "banme_enabled")) {
                    new EmbedBuilder()
                        .title("Enabled /banme")
                        .color("green")
                        .interact(interaction);
                }
                else {
                    new EmbedBuilder()
                        .title("Disabled /banme")
                        .color("red")
                        .interact(interaction);
                }
                break;
            case "poll":
                man.setGuildField(interaction.guild.id, "poll_enabled", interaction.options[0].options[0].options[0].value);
                if (man.getGuildField(interaction.guild.id, "poll_enabled")) {
                    new EmbedBuilder()
                        .title("Enabled /poll")
                        .color("green")
                        .interact(interaction);
                }
                else {
                    new EmbedBuilder()
                        .title("Disabled /poll")
                        .color("red")
                        .interact(interaction);
                }
                break;
            case "balls":
                man.setGuildField(interaction.guild.id, "balls_enabled", interaction.options[0].options[0].options[0].value);
                if (man.getGuildField(interaction.guild.id, "balls_enabled")) {
                    new EmbedBuilder()
                        .title("Enabled /balls")
                        .color("green")
                        .interact(interaction);
                }
                else {
                    new EmbedBuilder()
                        .title("Disabled /balls")
                        .color("red")
                        .interact(interaction);
                }
                break;
            case "balls":
                man.setGuildField(interaction.guild.id, "balls_enabled", interaction.options[0].options[0].options[0].value);
                if (man.getGuildField(interaction.guild.id, "balls_enabled")) {
                    new EmbedBuilder()
                        .title("Enabled /balls")
                        .color("green")
                        .interact(interaction);
                }
                else {
                    new EmbedBuilder()
                        .title("Disabled /balls")
                        .color("red")
                        .interact(interaction);
                }
                break;
            case "flavor":
                man.setGuildField(interaction.guild.id, "flavor_enabled", interaction.options[0].options[0].options[0].value);
                if (man.getGuildField(interaction.guild.id, "flavor_enabled")) {
                    new EmbedBuilder()
                        .title("Enabled /flavor")
                        .color("green")
                        .interact(interaction);
                }
                else {
                    new EmbedBuilder()
                        .title("Disabled /flavor")
                        .color("red")
                        .interact(interaction);
                }
                break;
            case "fight":
                man.setGuildField(interaction.guild.id, "fight_enabled", interaction.options[0].options[0].options[0].value);
                if (man.getGuildField(interaction.guild.id, "fight_enabled")) {
                    new EmbedBuilder()
                        .title("Enabled /fight")
                        .color("green")
                        .interact(interaction);
                }
                else {
                    new EmbedBuilder()
                        .title("Disabled /fight")
                        .color("red")
                        .interact(interaction);
                }
                break;
            case "eightball":
                man.setGuildField(interaction.guild.id, "eightball_enabled", interaction.options[0].options[0].options[0].value);
                if (man.getGuildField(interaction.guild.id, "eightball_enabled")) {
                    new EmbedBuilder()
                        .title("Enabled /eightball")
                        .color("green")
                        .interact(interaction);
                }
                else {
                    new EmbedBuilder()
                        .title("Disabled /eightball")
                        .color("red")
                        .interact(interaction);
                }
                break;
            case "dababy":
                man.setGuildField(interaction.guild.id, "dababy_enabled", interaction.options[0].options[0].options[0].value);
                if (man.getGuildField(interaction.guild.id, "dababy_enabled")) {
                    new EmbedBuilder()
                        .title("Enabled /dababy")
                        .color("green")
                        .interact(interaction);
                }
                else {
                    new EmbedBuilder()
                        .title("Disabled /dababy")
                        .color("red")
                        .interact(interaction);
                }
                break;
            case "twitch_prime_refrences":
                man.setGuildField(interaction.guild.id, "twitch_prime_refrences_enabled", interaction.options[0].options[0].options[0].value);
                if (man.getGuildField(interaction.guild.id, "twitch_prime_refrences_enabled")) {
                    new EmbedBuilder()
                        .title("Enabled refrences to Twitch Prime")
                        .color("green")
                        .interact(interaction);
                }
                else {
                    new EmbedBuilder()
                        .title("Disabled refrences to Twitch Prime")
                        .color("red")
                        .interact(interaction);
                }
                break;
        }
    }
    return true;
}