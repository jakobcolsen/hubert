const Discord = require('discord.js')
const fs = require('fs')
const botconfig = require('../config.json')

module.exports.noPerms = (message, perm) => {
    message.channel.send(`**Insufficient Permission:** You must have the permission \`${perm}\` to run this command.`)
}
module.exports.noArgs = (message, words) => {
    message.channel.send(`**Please specify ${words}**`)
}
module.exports.noCanDo = (message, command) => {
    message.channel.send(`**You cannot ${command} that person, either they are above you in the role hierarchy, or they are an administrator.**`)
}
module.exports.cannotSend = (message, user) => {
    message.channel.send(`**Cannot DM <@${user.id}> due to their settings, proceeding anyways.**`)
}
