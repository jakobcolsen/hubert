const Discord = require('discord.js')
const mongoose = require('mongoose')

const muteModel = require('./muteModel.js')
const botconfig = require('../../config.json')
const errors = require('../utils/errors.js')
const replies = require('../utils/replies.js')

module.exports.run = async (bot, message, args) => {
    let userMuted = message.mentions.members.first()
    let reason = args.slice(1).join(" ") || "no reason given."

    if (!message.member.hasPermission('MUTE_MEMBERS')) return errors.noPerms(message,'MUTE_MEMBERS')
    if (!args[0] || !userMuted) return errors.noArgs(message, 'who you would like to mute via mention.')
    if (!userMuted.highestRole.position >= message.member.highestRole.position) return errors.noCanDo(message, 'mute')

    let userChannels = message.guild.channels.filter(c => {
        c.permissionsFor(userMuted).has("SEND_MESSAGES")
    })

    const mutedUserDB = await muteModel.findOne({mutedUserID: userMuted.user.id, guildID: message.guild.id})
        if (!mutedUserDB) {
            const mutedUser = new muteModel({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                mutedUser: userMuted.user.tag,
                mutedUserID: userMuted.user.id,
                reasons: reason,
                muteCount: 1,
            })
        mutedUser.save()
        .catch(err => console.log(err))
        } else {
            muteModel.findOneAndUpdate({guildID: message.guild.id, mutedUserID: userMuted.user.id}, {reasons: reason, muteCount: mutedUserDB.muteCount + 1})
            .then(updatedMute => {
                updatedMute.save()
                .catch(err => console.log(err))
            })
        }

    await replies.userSend(message, 'muted', userMuted, reason)
    .catch(err => {
        errors.cannotSend(message, userMuted)
        console.log(err)
    })
    userChannels.overwritePermissions(userMuted.user.id, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
    })
    replies.modSuccess(message, 'muted', userMuted, reason)
}

module.exports.help = {
    name: "mute",
    aliases: ["muteuser", "talknomore"]
}
