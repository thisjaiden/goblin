import { Client, CommandInteraction, Interaction } from "discord.js";
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

function remind(interaction: CommandInteraction, man: Guildman, client: Client): boolean {
    if (!interaction.channel) {
        new EmbedBuilder()
            .title("Sorry, this won't work.")
            .text("Unfortunately, due to technical constraints this command can't yet be used in DMs.")
            .color("red")
            .interact(interaction, client, man);
        return false;
    }
    let el_to_push = {
        reminder: "/remindme reminder",
        when: new Date().getTime(),
        channel: "",
        user: ""
    };
    let units = "";
    let value = 0;
    for (let i = 0; i < interaction.options.array().length; i++) {
        let this_option = interaction.options.array()[i];
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
    el_to_push.channel = interaction.channelId;
    el_to_push.user = interaction.user.toString();
    let old_data = man.getGuildField(interaction.guildId, "reminders");
    old_data.push(el_to_push);
    man.setGuildField(interaction.guildId, "reminders", old_data);
    new EmbedBuilder()
        .title("Reminder Set!")
        .text(`You will be reminded in ${value} ${units}.`)
        .color("blue")
        .interact(interaction, client, man);
    return true;
}
