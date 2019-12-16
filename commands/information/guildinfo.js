const Discord = require('discord.js')
const config = require('../../config.json')

module.exports.run = async (bot, message, args) => {
    let verificationField = message.guild.verificationLevel;
    let contentField = message.guild.explicitContentFilter;
    let switchVerification;
    let switchContent;
    switch(verificationField) {
        case '0' :
            switchVerification = 'None'
        break;
        case 1 :
            switchVerification = 'Low'
        break;
        case 2 :
            switchVerification = 'Medium'
        break;
        case 3 :
            switchVerification = '(╯°□°）╯︵ ┻━┻'
        break;
        case 4 :
            switchVerification = '┻━┻彡ヽ(ಠ益ಠ)ノ彡┻━┻'
        break;
    } 
    switch(contentField) {
        case 0 :
            switchContent = 'Grandma\'s Tea Party'
        break;
        case 1 :
            switchContent = 'No role, no gore.'
        break;
        case 2 :
            switchContent = 'Squeaky Clean'
        break;
    }
    let messageField = message.guild.defaultMessageNotifications;
    let switchMessage;
    switch(messageField) {
        case 'ALL': 
            switchMessage = 'All Notifications'
        break;
        case 'MENTIONS':
            switchMessage = 'Mentions Only'
        break;
    }

    let botNumber;
    let onlineNumber;
    let onlineCount = await message.guild.members.filter(m => m.user.presence.status == 'online')
    let botCount = await message.guild.members.filter(m => m.user.bot)
    if (!botCount) { botNumber = '0' } else { botNumber = botCount.size }
    if (!onlineCount) { onlineNumber = '0' } else { onlineNumber = onlineCount.size }

    const guildembed = new Discord.RichEmbed()
        .setColor('#00ff83')
        .setThumbnail(message.guild.iconURL)
        .setFooter(`Server Information | Hubert ${config.version}`)
        .setTimestamp()
        .addField('Server Name', `${message.guild.name} (${message.guild.nameAcronym})`, true)
        .addField('Server ID', message.guild.id, true)
        .addField('Server Logo', message.guild.iconURL)
        .addField('Server Owner', message.guild.owner.user.tag, true)
        .addField('Owner ID', message.guild.owner.id, true)
        .addField('Region', message.guild.region)
        .addField('Verification Level', switchVerification, true)
        .addField('Content Filter', switchContent, true)
        .addField('Default Message Notifications', switchMessage)
        .addField('Total Members', message.guild.memberCount, true)
        .addField('Online Members', onlineNumber, true)
        .addField('Bots', botNumber)
        .addField('Channels', message.guild.channels.size, true)
        .addField('Roles', message.guild.roles.size, true)
        .addField('Created On', bot.user.createdAt.toDateString())
        .addField('Joined On', message.guild.me.joinedAt.toDateString())
    message.channel.send(guildembed)
}

module.exports.help = {
    name: "serverinfo",
    aliases: ["guildinfo", "guild", "server"]
}