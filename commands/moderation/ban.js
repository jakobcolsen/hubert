const Discord = require('discord.js')
const mongoose = require('mongoose')

const banModel = require('../../models/banModel.js')
const botconfig = require('../../config.json')
const errors = require('../../utils/errors.js')
const replies = require('../../utils/replies.js')

module.exports.run = async (bot, message, args) => {
    let userBanned = message.mentions.members.first()
    let reason = args.slice(1).join(" ") || "no reason given."

    if (!message.member.hasPermission('BAN_MEMBERS')) return errors.noPerms(message, 'BAN_MEMBERS')
    if (!args[0] || !userBanned) return errors.noArgs(message, 'who you would like to ban via mention.')
    if (!userBanned.bannable || userBanned.highestRole.position >= message.member.highestRole.position) return errors.noCanDo(message, 'ban')
    
    const bannedUserDB = await banModel.findOne({bannedUserID: userBanned.user.id, guildID: message.guild.id})
        if (!bannedUserDB) {
            const bannedUser = new banModel({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                bannedUser: userBanned.user.tag,
                bannedUserID: userBanned.user.id,
                reasons: reason,
                banCount: 1
            })
            bannedUser.save()
            .catch(err => console.log(err))
        } else {
            banModel.findOneAndUpdate({guildID: message.guild.id, bannedUserID: userBanned.user.id}, {reasons: reason, banCount: bannedUserDB.banCount + 1})
            .then(updatedBan => {
                updatedBan.save()
                .catch(err => console.log(err))
            })
        }

    await replies.userSend(message, 'banned', userBanned, reason)
    .catch(err => {
        errors.cannotSend(message, userBanned)
        console.log(err)
    })
    userBanned.ban(7, reason)
    replies.modSuccess(message, 'banned', userBanned, reason)
}

module.exports.help = {
    name: "ban",
    aliases: ["banuser", "begonethot"]
}