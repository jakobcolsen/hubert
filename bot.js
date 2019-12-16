const fs = require('fs')
const mongoose = require('mongoose')
const Discord = require('discord.js')

const CachedData = require('./CachedData.js')
const botconfig = require('./config.json')
const bot = new Discord.Client({owner: '324242346411819019'})

bot.commands = new Discord.Collection()
bot.aliases = new Discord.Collection()

const { promisify } = require('util');
const readdir = promisify(fs.readdir);
mongoose.connect('mongodb://localhost/hubert', {useNewUrlParser: true})

//Command handler
function load(dir) {
    fs.readdir(dir, (err, files) => {
      if (err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log("Couldn't find commands.");
            return;
        }

        jsfile.forEach((f, i) => {
            delete require.cache[require.resolve(`${dir}${f}`)];
            let props = require(`${dir}${f}`);
            console.log(`${f} loaded!`);
            bot.commands.set(props.help.name, props);
            props.help.aliases.forEach(alias => {
                bot.aliases.set(alias, props.help.name);
            });
        });
    });
}

bot.on('ready', () => {
    console.log(`Hubert ${botconfig.version} is operating.`)
    bot.user.setActivity('Jakob\'s screams of frustration. ', { type: 'LISTENING'})
})

//Message event
bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type != 'text') {
        message.channel.send('**Please send your commands in a guild.**')
    }

    const afkModel = require('./models/afkModel.js')
    const afkUserDB = await afkModel.findOne({afkUserID: message.author.id, guildID: message.guild.id})
    if (afkUserDB && afkUserDB.guildID == message.guild.id && afkUserDB.afkStatus == 'afk') {
        afkModel.findOneAndUpdate({afkUserID: message.author.id, guildID: message.guild.id}, {afkStatus: 'no'})
        .then(statusUpdate => {
        statusUpdate.save()
        .catch(err => console.log(err))
       })

       if (message.member.highestRole.position >= message.guild.me.highestRole.position && message.member.nickname) {
            message.member.setNickname(message.member.nickname.substr(6))
       }
       message.channel.send(`**Welcome back <@${message.author.id}>!**`)
    }

    //Getting prefix from CacheData.js
    let prefix = CachedData.prefixes[message.guild.id] || '?';
    if (message.isMentioned(bot.user) && message.content.includes('prefix' || 'help')) { message.channel.send(`**The guild prefix is \`${prefix}\`.**`) }
    if (!message.content.startsWith(prefix)) return;

    //Command handler
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()

    let command;
    if (bot.commands.get(cmd)) command = bot.commands.get(cmd);
    else command = bot.commands.get(bot.aliases.get(cmd))

    try {
        command.run(bot, message, args)
    } catch (e) {
        return;
    }
})

//Loading commands
load('./commands/configuration/');
load('./commands/information/');
load('./commands/moderation/')
load('./commands/general/')

//Handling errors
process.on('unhandledRejection', e => {
    console.log(e.stack)
    bot.destroy()
    bot.login(botconfig.token)
})

bot.on('error', (e) => {
    bot.destroy()
    bot.login(botconfig.token)
})

bot.login(botconfig.token)
