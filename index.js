require('dotenv').config()
const Discord = require("discord.js")
const client = new Discord.Client()
const handlers = require('./handlers')
const store = require('./store')

handlers.addHandler(/.*set order for (.*) to (<@.*)/g, (message, matches) => {
    let users = matches[2].split(',').map(user => user.trim())
    store.setOrderForGame(matches[1], users)
    store.setCurrentPlayerForGame(matches[1], users[0])
    message.reply(`order set for ${matches[1]}! ${users[0]} is up`)
})

handlers.addHandler(/.*get order for (.*)/g, async (message, matches) => {
    let order = await store.getOrderForGame(matches[1])

    if (!order) {
        message.reply(`there is no game named '${matches[1]}'`)
        return
    }

    message.reply(`the order for ${matches[1]} is ${order}`)
})

handlers.addHandler(/.*set current player for (.*) to (<@.*>)/g, async (message, matches) => {
    const gameName = matches[1]
    const player = matches[2]
    const order = await store.getOrderForGame(gameName)

    if (!order) {
        message.reply(`no order has been set for ${gameName}`)
        return
    }

    if (order.indexOf(player) < 0) {
        message.reply(`${player} is not participating in ${gameName}`)
        return
    }

    store.setCurrentPlayerForGame(gameName, player)
    message.reply(`current player for ${gameName} set to ${player}`)
})

handlers.addHandler(/.*get current player for (.*)/g, async (message, matches) => {
    let currentPlayer = await store.getCurrentPlayerForGame(matches[1])

    if (!currentPlayer) {
        message.reply(`looks like there is no game with the name '${matches[1]}'`)
        return
    }

    message.reply(`current player for ${matches[1]} is ${currentPlayer}`)
})

handlers.addHandler(/.*I'm done in (.*)/g, async (message, matches) => {
    const gameName = matches[1]
    const currentPlayer = await store.getCurrentPlayerForGame(gameName)

    if (!currentPlayer) {
        message.reply(`no current player is set for ${gameName}`)
        return
    }

    if (!currentPlayer.includes(message.author.id)) {
        message.reply(`it isn't your turn. ${currentPlayer} is up in ${gameName}`)
        return
    }

    const order = await store.getOrderForGame(gameName)

    let currentIndex = order.findIndex(player => player.includes(message.author.id))

    if (currentIndex < 0) {
        message.reply(`hmmm, doesn't look like you're playing in ${gameName}`)
        return
    }

    let nextIndex = currentIndex + 1

    nextIndex = nextIndex === order.length ? 0 : nextIndex

    store.setCurrentPlayerForGame(gameName, order[nextIndex])
    message.channel.send(`${order[nextIndex]} is now up in ${gameName}`)
})

client.on("message", msg => {
    if (msg.channel.name !== 'civ-vi' && msg.channel.name !== 'botdev') {
        return
    }

    if (msg.author.bot) {
        return
    }

    const firstMention = msg.mentions.members.first()

    if (!firstMention || msg.client.user.id !== firstMention.id){
        return
    }

    handlers.handle(msg)
})

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })

client.login(process.env.DISCORD_API_KEY)