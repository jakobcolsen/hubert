const Discord = require('discord.js')
const botconfig = require('../../config.json')
const errors = require('../../utils/errors.js')
const replies = require('../../utils/replies.js')

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return errors.noPerms(message, 'MANAGE_MESSAGES')
    if (!args[0] || isNaN(args[0]) && args[0] != 'all' || args[0] > 100 || args[0] == 0) errors.noArgs(message, 'how many messages you want to delete with a number less than 100.')
    message.channel.bulkDelete(args[0], true)
    .then(deletedCount => {
        message.channel.send(`**Deleted \`${deletedCount.size}\` messages.**`)
        .then(thisMessage => thisMessage.delete(5000))
    })
    .catch(err => console.log(err))
}

module.exports.help = {
    name: "purge",
    aliases: ["bulkdelete", "clear"]
}