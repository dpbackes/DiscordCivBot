const Keyv = require('keyv');
const keyv = new Keyv('sqlite://database.sqlite');

const keys = {
    current: 'current',
    order: 'order'
}

async function getOrderForGame(gameName) {
    return await keyv.get(keys.order + gameName)
}

function setOrderForGame(gameName, value) {
    keyv.set(keys.order + gameName, value)
}

async function getCurrentPlayerForGame(gameName) {
    return await keyv.get(keys.current + gameName)
}

function setCurrentPlayerForGame(gameName, value) {
    keyv.set(keys.current + gameName, value)
}

module.exports = {
    getOrderForGame,
    setOrderForGame,
    getCurrentPlayerForGame,
    setCurrentPlayerForGame
}