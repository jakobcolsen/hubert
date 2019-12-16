const { ShardingManager } = require('discord.js');
const botconfig = require('./config.json')
const manager = new ShardingManager('./bot.js', { token: botconfig.token });

manager.spawn();
manager.on('launch', shard => console.log(`Launched shard ${shard.id + 1}`));