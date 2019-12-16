const Discord = require('discord.js')
const mongoose = require('mongoose')

const afkModel = require('../../models/afkModel.js')
const botconfig = require('../../config.json')
const errors = require('../../utils/errors.js')
const replies = require('../../utils/replies.js')

module.exports.run = async (bot, message, args) => {
    //make a db, change their nickname, set db status for that user to AFK and list server ID, then check every message if it is that person and server (can cache later)
    const afkUserDB = await afkModel.findOne({afkUserID: message.author.id, guildID: message.guild.id})
        if (!afkUserDB) {
            const afkUser = new afkModel({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                afkUserID: message.author.id,
                afkStatus: 'afk'
            })
            afkUser.save()
            .catch(err => console.log(err))
        } else {
            afkModel.findOneAndUpdate({guildID: message.guild.id, afkUserID: message.author.id, afkStatus: 'afk'})
            .then(updatedAfk => {
                updatedAfk.save()
                .catch(err => console.log(err))
            })
        }

        
        if (message.member.highestRole.position >= message.guild.me.highestRole.position) {
            message.member.setNickname(`[AFK] ${message.member.nickname || message.author.username}`)
        } else {
            message.channel.send(`**<@${message.author.id}> I cannot set your nickname, sorry.**`)
        } 
            
        message.channel.send(`**<@${message.author.id}>, you are now AFK.**`)
}

module.exports.help = {
    name: 'afk',
    aliases: ['away']
}