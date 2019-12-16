const Discord = require('discord.js')
const botconfig = require('../../config.json')

module.exports.run = (bot, message, args) => {
    bot.shard.broadcastEval('this.guilds.size')
    .then(gResults => {
        bot.shard.broadcastEval('this.users.size')
        .then(uResults => {
            bot.shard.broadcastEval('this.channels.size')
            .then(cResults => {
                    const botembed = new Discord.RichEmbed()
                    .setColor('#018ca8')
                    .setThumbnail(bot.user.avatarURL)
                    .setFooter(`Bot Information | Hubert ${botconfig.version}`)
                    .setTimestamp()
                    .addField('Hubert\'s Tag', bot.user.tag, true)
                    .addField('Hubert\'s ID', bot.user.id, true)
                    .addField('Hubert\'s Developer', 'JakobO#2265')
                    .addField('Bot Invite', 'https://bit.ly/2KEF5zw', true)
                    .addField('Server Invite', 'https://discord.gg/8KdWMtV', true)
                    .addField('Version', botconfig.version)
                    .addField('Server Count', gResults, true)
                    .addField('User Count', uResults, true)
                    .addField('Channel Count', cResults)
                    .addField('Guild Created On', bot.user.createdAt.toDateString())
                    .addField('Hubert Joined On', message.guild.me.joinedAt.toDateString())
                message.channel.send(botembed)
            })
        })
    })
}

module.exports.help = {
    name: 'botinfo',
    aliases: ['hubert', 'bot']
}
