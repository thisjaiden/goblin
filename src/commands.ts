import { ApplicationCommandDataResolvable } from "discord.js";

export function commands(): ApplicationCommandDataResolvable[] {
    return [
        {
            name: "poll",
            description: "Create a poll and get results",
            options: [
                {
                    type: "STRING",
                    name: "question",
                    description: "The question to ask in this poll",
                    required: true
                },
                {
                    type: "STRING",
                    name: "answer",
                    description: "The first answer to this poll",
                    required: true
                },
                {
                    type: "STRING",
                    name: "answer2",
                    description: "The second answer to this poll",
                    required: true
                },
                {
                    type: "STRING",
                    name: "answer3",
                    description: "The third answer to this poll (optional)",
                    required: false
                },
                {
                    type: "STRING",
                    name: "answer4",
                    description: "The fourth answer to this poll (optional)",
                    required: false
                },
                {
                    type: "STRING",
                    name: "answer5",
                    description: "The fifth answer to this poll (optional)",
                    required: false
                }
            ]
        },
        {
            name: "balls",
            description: "Get a picture of balls"
        },
        {
            name: "remindme",
            description: "Set a reminder for the future",
            options: [
                {
                    type: 4,
                    name: "time",
                    description: "How long until your reminder?",
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
                    "required": true
                }
            ]
        },
        {
            name: "invite",
            description: "Get Goblin's invite link"
        },
        {
            name: "game",
            description: "Play a very fun game!"
        },
        {
            name: "flavor",
            description: "Get your flavor!"
        },
        {
            name: "feedback",
            description: "Give feedback about Goblin!",
            options: [
                {
                    type: 3,
                    name: "feedback",
                    description: "Provide feedback here.",
                    required: true
                }
            ]
        },
        {
            name: "help",
            description: "Returns a list of Goblin's commands"
        },
        {
            name: "eightball",
            description: "Ask the magic 8 ball a question!",
            options: [
                {
                    type: 3,
                    name: "question",
                    description: "The question you want to ask",
                    required: true
                }
            ]
        },
        {
            name: "rps",
            description: "Challenge someone to Rock Paper Scissors.",
            options: [
                {
                    type: 6,
                    name: "user",
                    description: "The user to challenge",
                    required: true
                }
            ]
        },
        {
            name: "anon",
            description: "Post an anonymous message.",
            options: [
                {
                    type: "STRING",
                    name: "message",
                    description: "The message to send.",
                    required: true
                },
                {
                    type: "STRING",
                    name: "name",
                    description: "A name for this anon."
                }
            ]
        },
        {
            name: "admin",
            description: "Complete various admin actions.",
            options: [
                {
                    type: "STRING",
                    name: "command",
                    description: "The command to use.",
                    required: true
                }
            ]
        },
    ];
}