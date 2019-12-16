const Discord = require('discord.js')
const errors = require('../../utils/errors.js')

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission('MANAGE_NICKNAMES')) return errors.noPerms(message, 'MANAGE_NICKNAMES')
    
    let newName = args.join(" ")
    if (!newName) return errors.noArgs(message, 'what you would lime my new nickname to be.')
    message.guild.me.setNickname(newName)
    message.channel.send(`**My nickname has been changed to \`${newName}\`.**`)
}

module.exports.help = {
    name: "nickname",
    aliases: ["nick", "botname"]
}