const Discord = require('discord.js')
const mongoose = require('mongoose')

const prefixModel = require('../../models/prefixModel.js')
const CachedData = require('../../CachedData.js')
const botconfig = require('../../config.json')
const errors = require('../../utils/errors.js')

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) return errors.noPerms(message, 'MANAGE_GUILD')
    if (!args[0]) return errors.noArgs(message, 'what you would like the new guild prefix to be.')

    const currentPrefix = await prefixModel.findOne({guildID: message.guild.id})
    if (!currentPrefix) {
        const guildPrefix = new prefixModel({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            prefix: args[0]
        })

        guildPrefix.save()
        .catch(err => console.log(err))
    } else {
        prefixModel.findOneAndUpdate({guildID: message.guild.id, prefix: args[0]})
        .then(newPrefix => {
            newPrefix.save()
            .catch(err => console.log(err))
        })
    }

    message.channel.send(`**The new server prefix is \`${args[0]}\`.**`)
    CachedData.prefixes[message.guild.id] = args[0]
}

module.exports.help = {
    name: "prefix",
    aliases: ["setprefix"]
}
