const Discord = require('discord.js')
const mongoose = require('mongoose')

const banModel = require('../../models/banModel.js')
const kickModel = require('../../models/kickModel.js')
const softbanModel = require('../../models/softbanModel.js')
const warningModel = require('../../models/warningModel.js')

module.exports.run = async (bot, message, args) => {
    let userHistory = message.mentions.members.first()

    if (!args[0]) {
        message.channel.send('**Please specify whose history you would like to see.**')
        return;
    }
    if (!userHistory) {
        message.channel.send('**Please mention the person whose history you would like to see.**')
        return;
    }

    const banHistory = await banModel.findOne({guildID: message.guild.id, bannedUserID: userHistory.user.id})
    const kickHistory = await kickModel.findOne({guildID: message.guild.id, kickedUserID: userHistory.user.id})
    const softbanHistory = await softbanModel.findOne({guildID: message.guild.id, softbannedUserID: userHistory.user.id})
    const warningHistory = await warningModel.findOne({guildID: message.guild.id, reportedUserID: userHistory.user.id})

    let banNumber;
    let kickNumber;
    let softbanNumber;
    let warningNumber;

    if (!banHistory) {banNumber = 0} else {banNumber = banHistory.banCount}
    if (!kickHistory) {kickNumber = 0} else {kickNumber = kickHistory.kickCount}
    if (!softbanHistory) {softbanNumber = 0} else {softbanNumber = softbanHistory.softbanCount}
    if (!warningHistory) {warningNumber = 0} else {warningNumber = warningHistory.warnCount}

    message.channel.send(`**${userHistory.user.tag}'s Moderation History:\nBans: \`${banNumber}\` Kicks: \`${kickNumber}\` Softbans: \`${softbanNumber}\` Warnings: \`${warningNumber}\`**`)
}

module.exports.help = {
    name: "history",
    aliases: ["userhistory"]
}