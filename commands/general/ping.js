const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    const m = await message.channel.send("**Ping...**");
    m.edit(`**Pong! :ping_pong: Your Ping: \`${m.createdTimestamp - message.createdTimestamp}\`ms. My Ping: \`${Math.round(bot.ping)}\`ms**`);
}

module.exports.help = {
    name: "ping",
    aliases: ["pong", "pang"]
}