const Discord = require('discord.js')
const mongoose = require('mongoose')

const kickModel = require('../../models/kickModel.js')
const botconfig = require('../../config.json')
const errors = require('../../utils/errors.js')
const replies = require('../../utils/replies.js')

module.exports.run = async (bot, message, args) => {
    let userKicked = message.mentions.members.first()
    let reason = args.slice(1).join(" ") || "no reason given."

    if (!message.member.hasPermission('KICK_MEMBERS')) return errors.noPerms(message, 'KICK_MEMBERS')
    if (!args[0] || !userKicked) return errors.noArgs(message, 'who you would like to kick via mention.')
    if (!userKicked.kickable || userKicked.highestRole.position >= message.member.highestRole.position) return errors.noCanDo(message, 'kick')

    const kickedUserDB = await kickModel.findOne({kickedUserID: userKicked.user.id, guildID: message.guild.id})
        if (!kickedUserDB) {
            const kickedUser = new kickModel({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                kickedUser: userKicked.user.tag,
                kickedUserID: userKicked.user.id,
                reasons: reason,
                kickCount: 1
            })
            kickedUser.save()
            .catch(err => console.log(err))
        } else {
            kickModel.findOneAndUpdate({guildID: message.guild.id, kickedUserID: userKicked.user.id}, {reasons: reason, kickCount: kickedUserDB.kickCount + 1})
            .then(updatedKick => {
                updatedKick.save()
                .catch(err => console.log(err))
            })
        }

    await replies.userSend(message, 'kicked', userKicked, reason)
    .catch(err => {
        errors.cannotSend(message, userKicked)
        console.log(err)
    })
    userKicked.kick(reason)
    replies.modSuccess(message, 'kicked', userKicked, reason)
}

module.exports.help = {
    name: "kick",
    aliases: ["kickuser"]
}