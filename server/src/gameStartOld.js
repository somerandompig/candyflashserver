const fs = require('fs')
const getUser = require('./currentUser.js')
const lives = require('./lives.js')

async function gameStart(coreUserId, loginSession, levelId, episodeId) {
    let gameStart = {
        levelData: await fs.promises.readFile(`./levels/episode${episodeId}level${levelId}.txt`, 'utf8'),
        recommendedSeeds: [
        ]
    }
    //console.log(url)
    let livesData = await lives.getLivesData(coreUserId)
    livesData.lives--
    if (livesData.timeToNextRegeneration==-1000) {
        livesData.timeToNextRegeneration=1800000
    }
    await lives.setLivesData(coreUserId,livesData)
    gameStart.currentUser = await getUser(coreUserId,loginSession)
    return gameStart
}


module.exports = gameStart