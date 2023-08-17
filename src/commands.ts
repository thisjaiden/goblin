import { ApplicationCommandDataResolvable, ApplicationCommandOptionType } from "discord.js";

export function commands(): ApplicationCommandDataResolvable[] {
    return [
        {
            name: "poll",
            description: "Create a poll and get results",
            options: [
                {
                    type: 3,
                    name: "question",
                    description: "The question to ask in this poll",
                    required: true
                },
                {
                    type: 3,
                    name: "answer",
                    description: "The first answer to this poll",
                    required: true
                },
                {
                    type: 3,
                    name: "answer2",
                    description: "The second answer to this poll",
                    required: true
                },
                {
                    type: 3,
                    name: "answer3",
                    description: "The third answer to this poll (optional)",
                    required: false
                },
                {
                    type: 3,
                    name: "answer4",
                    description: "The fourth answer to this poll (optional)",
                    required: false
                },
                {
                    type: 3,
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
                    type: 3,
                    name: "message",
                    description: "The message to send.",
                    required: true
                },
                {
                    type: 3,
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
                    type: 3,
                    name: "command",
                    description: "The command to use.",
                    required: true
                }
            ]
        },
        {
            name: "roll",
            description: "Roll some dice.",
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "sides",
                    description: "Number of sides on this die.",
                    min_value: 3,
                    max_value: 100,
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "amount",
                    description: "Number of dice to roll.",
                    min_value: 1,
                    max_value: 20,
                    required: false
                }
            ]
        },
        {
            name: "hj",
            description: "jan measles"
        }
    ];
}