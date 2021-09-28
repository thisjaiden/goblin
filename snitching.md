Snitching
===

Snitching is a new per-server feature in Goblin Child v4.5.0. Considering the controvertial nature of its purpose, this page has been created.

What is Snitching?
---
Snitching takes messages posted using `/anon` that contain conerning contents and allows the server owner to receive info on who sent it.

Is `/anon` Still Secure?
---
Yes! The entirety of anon is still thouroughly inspected to assure that no user information is leaked or can be aquired. Your information will only be shared if *snitching is enabled in the server where you sent the message* AND *your message contains a targeted word*. It will only be shared with the owned of whatever server you sent the message in and logged by the bot for anylytics. No other messages are logged or shared.

How do I Know if Snitching is Enabled?
---

If the state of snitching is ever changed, the change will be brodcast to all users. You can check the current snitching state with `/help`.

What are the Targeted Words?
---

CW: Sensitive words and phrases

| Targeted Word |
| ------------- |
| ending        |
| cut           |
| cutter        |
| cutting       |
| suicide       |
| suicidal      |
| kill          |
| killing       |
| killer        |
| bomb          |
| bombing       |
| bomber        |
| terrorist     |

Isn't This Exploitable?
---
Short answer: yes.
You're never going to create a perfect system. This one is far from it, being impractical for larger servers and controversal for certain uses of `/anon`. It will have false positives. It won't trigger when it should sometimes. That's why this is a toggleable option. That's why this bot continues to be updated. If you have recomendations of how to improve or change this, `/feedback` is your friend, or you can open an issue or a PR. This is just a basic system set up to help a small subset of servers and people.

I Still Don't Trust the new `/anon`.
---
You're currently on Goblin Child's Github. All of the source code to the live version of Goblin Child is here. Go. Look through it. If you're able to find a potential flaw, report it and it will be fixed.
