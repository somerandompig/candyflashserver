const lives = require('./lives.js')
const getGold = require('./getGold.js')
const { getUnlockedBoosters, getBoosterInventory } = require('./getBoosters.js')

async function getUser(coreUserId,loginSession) {
    let userLives = await lives.calcLives(coreUserId)
    return {
        "userId": coreUserId,
        "lives": userLives.lives,
        "timeToNextRegeneration": userLives.timeToNextRegeneration,
        "gold": await getGold(loginSession),
        "unlockedBoosters": await getUnlockedBoosters(loginSession),
        "soundFx": true,
        "soundMusic": true,
        "maxLives": userLives.maxLives,
        "immortal": true,
        "mobileConnected": false,
        "currency": "CAD",
        "altCurrency": "KHC",
        "preAuth": false,
        "boosterInventory": await getBoosterInventory(loginSession)
    }
}
module.exports = getUser