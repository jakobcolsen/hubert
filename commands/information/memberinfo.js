const Discord = require('discord.js')
const botconfig = require('../../config.json')

module.exports.run = async (bot, message, args) => {
    let userInfo;
    let switchStatus;
    let switchType;

    if (message.mentions.members.first()) { 
        userInfo = message.mentions.members.first()
    } else {
        userInfo = message.member
    }
    if (!userInfo.user.presence.game) {
        switchType = '¯\\_(ツ)\_/¯'
    } else {
        switch(userInfo.user.presence.game.type) {
            case 0 :
                switchType = 'Playing'
            break;
            case 1 : 
                switchType = 'Watching'
            break;
            case 2 : 
                switchType = 'Listening to'
            break;
        }
    }

    let isBot = userInfo.user.bot ? 'Yes' : 'No'
    let userGame = userInfo.user.presence.game || 'Nothing' 
    let userStatus = userInfo.user.presence.status
    
    switch(userStatus) {
        case 'online' :
            switchStatus = 'Online'
        break;
        case 'idle' :
            switchStatus = 'Away'
        break;
        case 'dnd' :
            switchStatus = 'Do Not Disturb'
        break;
        case 'offline' :
            switchStatus = 'Offline'
        break;
    }

    const memberembed = new Discord.RichEmbed()
        .setColor('#00ff83')
        .setThumbnail(userInfo.user.avatarURL)
        .setFooter(`User Information | Hubert ${botconfig.version}`)
        .setTimestamp()
        .addField('User Tag', userInfo.user.tag, true)
        .addField('User ID', userInfo.id, true)
        .addField('Avatar URL', userInfo.user.avatarURL)
        .addField('Game Type', switchType, true)
        .addField('Game', userGame, true)
        .addField('Status', switchStatus)
        .addField('Bot?', isBot)
        .addField('Registered On', userInfo.user.createdAt.toDateString(), true)
        .addField('Joined On', userInfo.joinedAt.toDateString(), true)
    message.channel.send(memberembed)
}

module.exports.help = {
    name: "memberinfo",
    aliases: ["userinfo", "member", "user"]
}