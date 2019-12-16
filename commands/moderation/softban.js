const Discord = require('discord.js')
const mongoose = require('mongoose')

const softbanModel = require('../../models/softbanModel.js')
const botconfig = require('../../config.json')
const errors = require('../../utils/errors.js')
const replies = require('../../utils/replies.js')

module.exports.run = async (bot, message, args) => {
    let userSoftbanned = message.mentions.members.first()
    let reason = args.slice(1).join(" ") || "no reason given."

    if (!message.member.hasPermission('KICK_MEMBERS')) return errors.noPerms(message, 'KICK_MEMBERS')
    if (!args[0]) return errors.noArgs(message, 'who you would like to softban via mention.')
    if (!userSoftbanned.bannable || userSoftbanned.highestRole.position >= message.member.highestRole.position) return errors.noCanDo(message, 'softban')
    
    const softbannedUserDB = await softbanModel.findOne({softbannedUserID: userSoftbanned.user.id, guildID: message.guild.id})
        if (!softbannedUserDB) {
            const softbannedUser = new softbanModel({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                softbannedUser: userSoftbanned.user.tag,
                softbannedUserID: userSoftbanned.user.id,
                reasons: reason,
                softbanCount: 1
            })
            softbannedUser.save()
            .catch(err => console.log(err))
        } else {
            softbanModel.findOneAndUpdate({guildID: message.guild.id, softbannedUserID: userSoftbanned.user.id}, {reasons: reason, softbanCount: softbannedUserDB.softbanCount + 1})
            .then(updatedSoftban => {
                updatedSoftban.save()
                .catch(err => console.log(err))
            })
        }

    await replies.userSend(message, 'softbanned', userSoftbanned, reason)
    .catch(err => {
        errors.cannotSend(message, userSoftbanned)
        console.log(err)
    })
    userSoftbanned.ban(7, reason)
    message.guild.unban(userSoftbanned.id)
    replies.modSuccess(message, 'softbanned', userSoftbanned, reason)
}

module.exports.help = {
    name: "softban",
    aliases: ["softbanuser", "kickbutitdeletesthemessagestoo"]
}