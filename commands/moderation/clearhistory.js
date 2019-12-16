const Discord = require('discord.js')
const mongoose = require('mongoose')

const banModel = require('../../models/banModel.js')
const kickModel = require('../../models/kickModel.js')
const softbanModel = require('../../models/softbanModel.js')
const warningModel = require('../../models/warningModel.js')
const errors = require('../../utils/errors.js')

module.exports.run = async (bot, message, args) => {
    let userHistory = message.mentions.members.first()

    if (!message.member.hasPermission('ADMINISTATOR')) return errors.noPerms(message, 'ADMINISTRATOR')
    if (!args[0] || !args[1]) return errors.noArgs(message, 'whose history you would like to clear and the type.')

    let typeOfHistory = args[1].toLowerCase()
    let argArray = ["all", "bans", "kicks", "softbans", "warnings", "warns"]
    if (args[0] != userHistory || !argArray.includes(typeOfHistory)) {
        message.channel.send('**Please mention the person whose history you want to clear, followed by what you want to clear (bans, kicks, softbans, warnings, all).**')
        return;
    }

    if (typeOfHistory == "all") {
        const deleteBanHistory = await banModel.findOneAndDelete({guildID: message.guild.id, bannedUserID: userHistory.user.id})
        const deleteKickHistory = await kickModel.findOneAndDelete({guildID: message.guild.id, kickedUserID: userHistory.user.id})
        const deleteSoftbanHistory = await softbanModel.findOneAndDelete({guildID: message.guild.id, softbannedUserID: userHistory.user.id})
        const deleteWarningHistory = await warningModel.findOneAndDelete({guildID: message.guild.id, reportedUserID: userHistory.user.id})
        if (!deleteBanHistory || !deleteKickHistory || !deleteSoftbanHistory || !deleteWarningHistory) {
            message.channel.send(`<@${userHistory.user.id}>'s moderation history has been deleted! (They didn't have any data in some of the fields).**`)
            return;
        }
        message.channel.send(`<@${userHistory.user.id}>'s moderation history has been deleted!**`)
    } else if (typeOfHistory == "bans") {
        const deleteBanHistory = await banModel.findOneAndDelete({guildID: message.guild.id, bannedUserID: userHistory.user.id})
        if (!deleteBanHistory) {
            message.channel.send(`**<@${userHistory.user.id}> doesn't have any bans to clear from their moderation history.**`)
            return;
        }
        message.channel.send(`**Cleared \`${deleteBanHistory.banCount}\` ban(s) from <@${userHistory.user.id}>'s moderaton history.**`)
    } else if (typeOfHistory == "kicks") {
        const deleteKickHistory = await kickModel.findOneAndDelete({guildID: message.guild.id, kickedUserID: userHistory.user.id})
        if (!deleteKickHistory) {
            message.channel.send(`**<@${userHistory.user.id}> doesn't have any bans to clear from their moderation history.**`)
            return;
        }
        message.channel.send(`**Cleared \`${deleteKickHistory.kickCount}\ kick(s) from <@${userHistory.user.id}>'s moderation history.**`)
    } else if (typeOfHistory == "softbans") {
        const deleteSoftbanHistory = await softbanModel.findOneAndDelete({guildID: message.guild.id, softbannedUserID: userHistory.user.id})
        if (!deleteSoftbanHistory) {
            message.channel.send(`**<@${userHistory.user.id}> doesn't have any softbans to clear from their moderation history.**`)
            return;
        }
        message.channel.send(`**Cleared \`${deletesoftbanHistory.softbanCount}\` softban(s) from <@${userHistory.user.id}>'s moderaton history.**`)
    } else if (typeOfHistory == "warnings" || args[1] == "warnings") {
        const deleteWarningHistory = await warningModel.findOneAndDelete({guildID: message.guild.id, reportedUserID: userHistory.user.id})
        if (!deleteWarningHistory) {
            message.channel.send(`**<@${userHistory.user.id}> doesn't have any warnings to clear from their moderation history.**`)
            return;
        }
        message.channel.send(`**Cleared \`${deleteWarningHistory.warnCount}\` warning(s) from <@${userHistory.user.id}>'s moderation history.**`)
    }
}

module.exports.help = {
    name: "clearhistory",
    aliases: ["clearuserhistory"]
}