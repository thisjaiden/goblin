import { CommandInteraction, Interaction } from "discord.js";
import { CommandManager } from "../command";
import { EmbedBuilder } from "../embed";
import { Guildman } from "../guildman";

export function registerRemindme(commandman: CommandManager) {
    commandman.registerInteraction(
        {
            "name": "remindme",
            "description": "Set a reminder for the future",
            "options": [
                {
                    "type": 4,
                    "name": "time",
                    "description": "How long until your reminder?",
                    "required": true
                },
                {
                    "type": 3,
                    "name": "unit",
                    "description": "What unit of time?",
                    "required": true,
                    "choices": [
                        {
                            "name": "minutes",
                            "value": "minutes"
                        },
                        {
                            "name": "hours",
                            "value": "hours"
                        },
                        {
                            "name": "days",
                            "value": "days"
                        }
                    ]
                },
                {
                    "type": 3,
                    "name": "reminder",
                    "description": "What do you want to be reminded?",
                    "required": false
                }
            ]
        },
        remind
    );
}

function remind(interaction: CommandInteraction, man: Guildman): boolean {
    let el_to_push = {
        reminder: "/remindme reminder",
        when: new Date().getTime(),
        channel: "",
        user: ""
    };
    let units = "";
    let value = 0;
    for (let i = 0; i < interaction.options.length; i++) {
        let this_option = interaction.options[i];
        if (this_option.name == "reminder") {
            el_to_push.reminder = this_option.value as string;
        }
        else if (this_option.name == "unit") {
            units = this_option.value as string;
        }
        else if (this_option.name == "time") {
            value = this_option.value as number;
        }
    }
    if (units == "minutes") {
        el_to_push.when = new Date().getTime() + (1000 * 60 * value);
    }
    if (units == "hours") {
        el_to_push.when = new Date().getTime() + (1000 * 60 * 60 * value);
    }
    if (units == "days") {
        el_to_push.when = new Date().getTime() + (1000 * 60 * 60 * 24 * value);
    }
    el_to_push.channel = interaction.channelID;
    el_to_push.user = interaction.user.toString();
    man.setGuildField(interaction.guildID, "reminders", man.getGuildField(interaction.guildID, "reminders") + el_to_push);
    new EmbedBuilder()
        .title("Reminder Set!")
        .text(`You will be reminded in ${value} ${units}.`)
        .color("blue")
        .interact(interaction);
    return true;
}
