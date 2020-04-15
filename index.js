require('dotenv').config()
const Discord = require("discord.js")
const client = new Discord.Client()
const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');
const handlers = require('./handlers')

const keys = {
    current: 'current',
    order: 'order'
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

handlers.addHandler(/.*set order to (<@.*)/g, (message, matches) => {
    let users = matches[1].split(',').map(user => user.trim())
    keyv.set(keys.order, users)
    message.reply("order set!")
})

handlers.addHandler(/.*get order/g, async message => {
    let order = await keyv.get(keys.order)

    message.reply(`the order is ${order}`)
})

handlers.addHandler(/.*set current player to (<@.*>)/g, (message, matches) => {
    keyv.set(keys.current, matches[1])
    message.reply(`current player set to ${matches[1]}`)
})

handlers.addHandler(/.*next player/g, async (message) => {
    const currentPlayer = await keyv.get(keys.current)

    if (!currentPlayer.includes(message.author.id)) {
        message.reply("it's not your turn :-(")
        return
    }

    const order = await keyv.get(keys.order)

    let currentIndex = order.findIndex(player => player.includes(message.author.id))

    if (currentIndex < 0) {
        message.reply("hmmm, doesn't look like you're playing this game")
        return
    }

    let nextIndex = currentIndex + 1

    nextIndex = nextIndex === order.length ? 0 : nextIndex

    keyv.set(keys.current, order[nextIndex])
    message.channel.send(`${order[nextIndex]} is now up`)
})

client.on("message", msg => {
    if (msg.channel.name !== 'civ-vi' && msg.channel.name !== 'botdev') {
        return
    }

    if (msg.author.bot) {
        return;
    }

    handlers.handle(msg)
})

client.login(process.env.DISCORD_API_KEY)