const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    message.author.send('**I have to send this message for this command to work, sorry for the ghost ping.**')
    .then(ghostMessage => {
        ghostMessage.channel.fetchMessages()
        .then(messages => {
            messages.filter(m => m.author.id == '493936962252570630').deleteAll()
        })
    })
    .catch(err => {
        message.channel.send(`**<@${message.author.id}>, I need to be able to send you messages for this command to work. Please edit your settings and try again.**`)
        console.log(err)
    })
    message.channel.send('**Your DMs have been cleared! Sorry about the ghostping.**')
}

module.exports.help = {
    name: "cleardms",
    aliases: ["cleandms", "cleardm", "cleandm"]
}