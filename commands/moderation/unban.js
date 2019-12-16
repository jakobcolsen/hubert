const Discord = require('discord.js')
const botconfig = require('../../config.json')
const errors = require('../../utils/errors.js')
const replies = require('../../utils/replies.js')

module.exports.run = (bot, message, args) => {
    let unbannedUserID = args[0]

    if(!message.member.hasPermission('BAN_MEMBERS')) return errors.noPerms(message, 'BAN_MEMBERS')
    if (!unbannedUserID || unbannedUserID.length != 18) return errors.noArgs(message, 'who you would like to unban by putting their ID.')
    message.guild.unban(unbannedUserID)
    .catch(err => {
        message.channel.send('**I could not unban that user, make sure that user is banned, and that is the correct ID.**')
        return;
    })
    message.channel.send(`**Successfully unbanned <@${unbannedUserID}>!**`)
}

module.exports.help = {
    name: "unban",
    aliases: ["unbanuser"]
}