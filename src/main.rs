use std::option;

use serenity::{Client, async_trait, client::{
        Context,
        EventHandler
    }, model::{interactions::{Interaction, application_command::{ApplicationCommand, ApplicationCommandInteraction, ApplicationCommandInteractionDataOption, ApplicationCommandOptionType}}, prelude::Ready}};


mod token;
mod lang;

const DEFAULT_LANGUAGE: lang::Language = lang::Language::ENUS;

// exp invite 1 = 2952850496
#[tokio::main]
async fn main() {
    println!("[INF] Goblin Child v{}", std::env!("CARGO_PKG_VERSION"));
    // Create Discord client handle
    let mut client = Client::builder(token::TOKEN)
        .event_handler(Handler)
        .application_id(token::APP_ID)
        .await
        .expect("[ERR] Unable to create client. Check your token and app ID.");
    
    // Run Discord client by awaiting indefinitely.
    if let Err(e) = client.start().await {
        println!("[ERR] A significant client error occured! ({:?})", e);
    }
}

fn run_interaction(ctx: Context, interaction: ApplicationCommandInteraction) {
    match interaction.data.name.as_str() {
        "help" => {
            //interaction.create_followup_message();
        }
        _ => {
            unreachable!();
        }
    } 
}

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn interaction_create(&self, ctx: Context, interaction: Interaction) {
        match interaction {
            Interaction::ApplicationCommand(inter) => {
                run_interaction(ctx, inter);
            }
            _ => {
                // We don't handle these types of interactions.
            }
        }
    }

    async fn ready(&self, ctx: Context, _: Ready) {
        println!("[INF] Goblin Child connected to Discord servers and ready.");
        ApplicationCommand::set_global_application_commands(&ctx.http, |commands| {
            commands
            .create_application_command(|command| {
                command
                    .name("poll")
                    .description("Create a poll for people to vote on.")
                    .create_option(|option| {
                        option
                            .name("question")
                            .description("What are you asking?")
                            .kind(ApplicationCommandOptionType::String)
                            .required(true)
                    })
                    .create_option(|option| {
                        option
                            .name("option1")
                            .description("What's the first option?")
                            .kind(ApplicationCommandOptionType::String)
                            .required(true)
                    })
                    .create_option(|option| {
                        option
                            .name("option2")
                            .description("What's the second option?")
                            .kind(ApplicationCommandOptionType::String)
                            .required(true)
                    })
                    .create_option(|option| {
                        option
                            .name("option3")
                            .description("What's the third option?")
                            .kind(ApplicationCommandOptionType::String)
                    })
                    .create_option(|option| {
                        option
                            .name("option4")
                            .description("What's the fourth option?")
                            .kind(ApplicationCommandOptionType::String)
                    })
                    .create_option(|option| {
                        option
                            .name("option5")
                            .description("What's the fifth option?")
                            .kind(ApplicationCommandOptionType::String)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("balls")
                    .description("Get a picture of balls.")
            })
            .create_application_command(|command| {
                command
                    .name("remind")
                    .description("Set a reminder.")
                    .create_option(|option| {
                        option
                            .name("time")
                            .description("How long until your reminder?")
                            .kind(ApplicationCommandOptionType::Number)
                            .required(true)
                    })
                    .create_option(|option| {
                        option
                            .name("unit")
                            .description("What time unit to use?")
                            .kind(ApplicationCommandOptionType::String)
                            .add_string_choice("minutes", "minutes")
                            .add_string_choice("hours", "hours")
                            .add_string_choice("days", "days")
                            .required(true)
                    })
                    .create_option(|option| {
                        option
                            .name("reminder")
                            .description("What would you like to be reminded?")
                            .kind(ApplicationCommandOptionType::String)
                            .required(true)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("feedback")
                    .description("Give feedback and suggestions about Goblin Child.")
                    .create_option(|option| {
                        option
                            .name("feedback")
                            .description("What feedback would you like to give?")
                            .kind(ApplicationCommandOptionType::String)
                            .required(true)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("eightball")
                    .description("Ask the magic eight ball a question.")
                    .create_option(|option| {
                        option
                            .name("question")
                            .description("What question do you have?")
                            .kind(ApplicationCommandOptionType::String)
                            .required(true)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("rps")
                    .description("Challenge someone to Rock Paper Scissors.")
                    .create_option(|option| {
                        option
                            .name("user")
                            .description("Who do you want to challenge?")
                            .kind(ApplicationCommandOptionType::User)
                            .required(true)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("ttt")
                    .description("Challenge someone to Tic Tac Toe.")
                    .create_option(|option| {
                        option
                            .name("user")
                            .description("Who do you want to challenge?")
                            .kind(ApplicationCommandOptionType::User)
                            .required(true)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("anon")
                    .description("Post an anonymous message.")
                    .create_option(|option| {
                        option
                            .name("message")
                            .description("What do you want to send?")
                            .kind(ApplicationCommandOptionType::String)
                            .required(true)
                    })
                    .create_option(|option| {
                        option
                            .name("name")
                            .description("What nickname do you want to use?")
                            .kind(ApplicationCommandOptionType::String)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("anondm")
                    .description("Send somone an anonymous message.")
                    .create_option(|option| {
                        option
                            .name("message")
                            .description("What do you want to send?")
                            .kind(ApplicationCommandOptionType::String)
                            .required(true)
                    })
                    .create_option(|option| {
                        option
                            .name("target")
                            .description("Who do you want to send this to?")
                            .kind(ApplicationCommandOptionType::User)
                            .required(true)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("roll")
                    .description("Roll a set of dice.")
                    .create_option(|option| {
                        option
                            .name("sides")
                            .description("How many sides are on your dice?")
                            .kind(ApplicationCommandOptionType::Integer)
                            .required(true)
                    })
                    .create_option(|option| {
                        option
                            .name("amount")
                            .description("How many dice are you rolling?")
                            .kind(ApplicationCommandOptionType::Integer)
                            .required(true)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("admin")
                    .description("Run basic admin commands.")
                    .create_option(|option| {
                        option
                            .name("command")
                            .description("What do you want to do?")
                            .kind(ApplicationCommandOptionType::String)
                            .required(true)
                    })
            })
            .create_application_command(|command| {
                command
                    .name("language")
                    .description("Pick a different language.")
                    .create_option(|option| {
                        option
                            .name("language")
                            .description("Which language do you want?")
                            .kind(ApplicationCommandOptionType::String)
                            .add_string_choice("English (United States)", "en_us")
                            .add_string_choice("English (Canada)", "en_ca")
                            .add_string_choice("French", "fr")
                            .add_string_choice("Spanish", "sp")
                    })
            })
            .create_application_command(|command| {
                command
                    .name("banme")
                    .description("Ban yourself from this server.")
            })
            .create_application_command(|command| {
                command
                    .name("invite")
                    .description("Invite Goblin Child to one of your servers.")
            })
            .create_application_command(|command| {
                command
                    .name("game")
                    .description("Play a very fun game!")
            })
            .create_application_command(|command| {
                command
                    .name("flavor")
                    .description("Get your flavor!")
            })
            .create_application_command(|command| {
                command
                    .name("help")
                    .description("Shows a list of all commands and what they do.")
            })
        }).await.unwrap();
        println!("[INF] Commands registered.");
        // commands registered
    }
}
