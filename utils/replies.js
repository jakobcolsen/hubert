const Discord = require('discord.js')
const fs = require('fs')
const botconfig = require('../config.json')

module.exports.modSuccess = (message, action, user, reason) => {
    message.channel.send(`**You have successfully ${action} <@${user.id}>. The reason being: \`${reason}\`**`)
}
module.exports.userSend = (message, action, user, reason) => {
    user.send(`**You have been ${action} from ${message.guild.name}. The reason being: \`${reason}\``)
}