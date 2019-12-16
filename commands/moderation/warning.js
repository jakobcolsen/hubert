const Discord = require('discord.js')
const mongoose = require('mongoose')

const warningModel = require('../../models/warningModel.js')
const botconfig = require('../../config.json')
const errors = require('../../utils/errors.js')
const replies = require('../../utils/replies.js')

module.exports.run = async (bot, message, args) => {
    let userWarned = message.mentions.members.first()
    let reason = args.slice(1).join(" ") || "no reason given."

    if (!message.member.hasPermission('KICK_MEMBERS')) return errors.noPerms(message, 'KICK_MEMBERS')
    if (!args[0] || !userWarned) return errors.noArgs(messsage, 'who you would like to warn via mention.')
    if (userWarned.highestRole.position >= message.member.highestRole.position) return errors.noCanDo(message, 'warn')

    const warnedUserDB = await warningModel.findOne({reportedUserID: userWarned.user.id, guildID: message.guild.id})
        if (!warnedUserDB) {
            const warnedUser = new warningModel({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                reportedUser: userWarned.user.tag,
                reportedUserID: userWarned.user.id,
                reasons: reason,
                warnCount: 1
            })
            warnedUser.save()
            .catch(err => console.log(err))
        } else {
            warningModel.findOneAndUpdate({guildID: message.guild.id, reportedUserID: userWarned.user.id}, {reasons: reason, warnCount: warnedUserDB.warnCount + 1})
            .then(updatedWarning => {
                updatedWarning.save()
                .catch(err => console.log(err))
            })
        }
        
    await replies.userSend(message, 'warned', userWarned, reason)
    .catch(err => {
        errors.cannotSend(message, userWarned)
        console.log(err)
    })
    replies.modSuccess(message, 'warned', userWarned, reason)
}

module.exports.help = {
    name: "warn",
    aliases: ["warnuser"]
}