require('dotenv').config();
const exec = require('child_process').exec;

const dc = require('discord.js');
const ytdl = require('ytdl-core');

const Bot = new dc.Client();
const queue = new Map();

const PREFIX = '$';

Bot.on('ready', () => {
    updatecount();
    Bot.user.setActivity("$help");
    console.log(`${Bot.user.username} has started`);
});

Bot.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        console.log(`${message.author.username}#${message.author.discriminator}: ${message}`);
        command(message);
    } else {
        switch (message.content) {
            case "owo":
                message.channel.send("uwu");;
                break;
            case "uwu":
                message.channel.send("owo");;
                break;
            case "uwo":
            case "owu":
                message.react("849190088079966238");
                break;
        }
    }
    //if (message.author.tag === "The Stone#6237") message.react("849201463136616478");
});

Bot.on('guildMemberAdd', (member) => {
    updatecount();
    console.log("new member");
    Bot.channels.cache.find(channel => channel.id === "777660634874642465").send(`Welcome ${member}! Go to <#778014666927767583> and get your roles to unlock to more channels.`)
});

Bot.on('guildMemberRemove', (member) => {
    updatecount();
});

const command = (input) => {
    const [CMD, ...args] = input.content.trim().substring(PREFIX.length).split(/\s+/);
    switch (CMD) {
        case "exec":
            try {
            if (args.join() == "") return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "shutdown")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "i3lock")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "bash")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "curl")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "wget")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "sudo")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "rm")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "rmdir")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "mv")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === ":(){:|:&};:")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "chmod")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "chown")) return;
            if (args.find(element => element.split('"').join('').split("'").join('').split("`").join('') === "cp")) return;
            } catch (TypeError) { return; }
            console.log(`Executing: ${args.join(' ')}`);
            exec(args.join(' '), (err, stdout, stderr) => {
                if (stdout.length >= 2000) {
                    [...stdout] = stdout.match(/.{1,2000}/g);
                    for (i = 0; i <= stdout.length; i++) if (stdout[i]) input.channel.send(stdout[i]);
                }
                else if (stdout) input.channel.send(stdout);
                if (stderr.length >= 2000) {
                    [...stderr] = stderr.match(/.{1,2000}/g);
                    for (i = 0; i <= stderr.length; i++) if (stderr[i]) input.channel.send(stderr[i]);
                }
                else if (stderr) input.channel.send(stderr);
            });
            break;
        case "avatar":
            if (!args.join()) input.reply(input.author.displayAvatarURL());
            else try { input.reply(Bot.users.cache.find(user => user.id === args.join().match(/\d+/)[0]).displayAvatarURL())}
            catch (TypeError) { input.reply("Cant find user")};
            console.log(args.join());
            break;
        case "secret":
            input.channel.send(process.env.BOTJS_SECRET);
            break;
        case "clear":
            if (!input.member.hasPermission('MANAGE_MESSAGES')) {
                return input.channel.send("You cant use this command since you're missing `manage_messages` perm")};
                  if (isNaN(args.join(''))) {
                    return input.channel.send('enter the amount of messages that you would like to clear').then((sent) => {
                        setTimeout(() => {sent.delete()}, 2500);
                      });
                  }
                  if (Number(args.join('')) < 0) {
                    return input.channel.send('enter a positive number').then((sent) => {
                        setTimeout(() => {sent.delete()}, 2500);
                      })};
                
                const amount = Number(args.join('')) > 100 ? 101 : Number(args.join('')) + 1;
                
                input.channel.bulkDelete(amount, true).then((_message) => {
                input.channel.send(`Bot cleared \`${_message.size}\` messages :broom:`).then((sent) => {
                    setTimeout(() => {sent.delete()}, 2500)});
                });
            break;
        case "members":
            let members
            Bot.guilds.cache.find(guild => guild.id === "777660634874642462").members.cache.forEach((member, index) => {
                members += `${member.displayName}#${member.user.discriminator}\n`
            });
            if (members.length >= 2000) {
                [...members] = members.match(/.{1,2000}/g);
                for (i = 0; i <= members.length; i++) if (members[i]) input.channel.send(members[i]);
            }
            else if (members) input.channel.send(members);
            break;
        case "play":
            if (!input.member.voice.channel) {
                input.channel.send("You have to be in a voice channel to use this command.");
                break;
            }
            if (input.member.voice.channel.permissionsFor(input.client.user).has("CONNECT") || input.member.voice.channel.permissionsFor(input.client.user).has("SPEAK")) {
                input.channel.send("I need the permissions to join and speak in your voice channel.");
                break;
            };
            break;
        case "?":
        case "help":
        case "h":
        default:
            input.channel.send(`
$exec [COMMAND] > executes the provided command in a bash console.
$avatar (USER) > sends the link of the avatar of the provided user.
$members > shows a member-list of the server

[] needed
() optional
`);
            break;
    }
};

const updatecount = () => {
    Bot.channels.cache.find(channel => channel.id === "849304256107905084").setName(`${Bot.guilds.cache.find(guild => guild.id === "777660634874642462").members.cache.filter(member => !member.user.bot).size}-Members`);
    console.log(Bot.guilds.cache.find(guild => guild.id === "777660634874642462").members.cache.filter(member => !member.user.bot).size);
};

Bot.login(process.env.BOTJS_TOKEN);
