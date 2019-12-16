const Discord = require('discord.js')
const mongoose = require('mongoose')

const muteModel = require('./muteModel.js/index.js')
const botconfig = require('../../config.json')

module.exports.run = async (bot, message, args) => {
    let userMuted = message.mentions.members.first()
    let reason = args.slice(1).join(" ") || "no reason given."

    if (!message.member.hasPermission('MUTE_MEMBERS')) {
        message.channel.send('**You must have the permission `MUTE_MEMBERS` to use this command.**')
        return;
    }
    if (!args[0]) {
        message.channel.send('**Please specify who you would like to mute.**')
        return;
    }
    if (!userMuted) {
        message.channel.send('**Please mention who you would like to mute.**')
        return;
    }
    if (!userMuted.highestRole.position >= message.member.highestRole.position) {
        message.channel.send('**You cannot mute that person, for they are above you in the role hierarchy (or the same role).**')
        return;
    }

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

    await userMuted.send(`**You have been muted on ${message.guild.name}. The reason being: ${reason}**`)
    .catch(err => {
        message.channel.send(`**I tried to DM <@${userMuted.user.id}> but due to their settings I cannot send messages to them. Muting...**`)
        console.log(err)
    })
    userChannels.map(mChannel => {
        mChannel.overwritePermissions(userMuted.user.id, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
        })
        message.channel.send(`**You have successfully muted <@${userMuted.user.id}>. The reason being: ${reason}**`)
    })
}

module.exports.help = {
    name: "mute",
    aliases: ["muteuser", "talknomore"]
}
