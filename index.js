require('dotenv').config()
const Discord = require("discord.js")
const client = new Discord.Client()
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');

var setOrderRegex = /.*set order to (<@.*)/g

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

var currentOrder = "";

client.on("message", msg => {
    if (msg.channel.name !== 'civ-vi' && msg.channel.name !== 'botdev') {
        return
    }

    if (msg.author.bot) {
        return;
    }

    let matches;
    
    if ((matches = setOrderRegex.exec(msg.content)) !== null) {
        let users = matches[1].split(',').map(user => user.trim())
        keyv.set('order', users)
    }

    if (msg.content.includes('get order')) {
        keyv.get('order').then(order => {
            msg.reply(`the current order is ${order.join(", ")}`)
        });
    }
})

client.login(process.env.DISCORD_API_KEY)