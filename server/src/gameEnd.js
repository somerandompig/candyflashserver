const fs = require('fs')
const crypto = require('node:crypto')
const fetch = require('node-fetch')
const getUser = require('./currentUser.js')
const lives = require('./lives.js')
const getUserUniverse = require('./userUniverse.js')

async function gameEnd(coreUserId, loginSession, url) {
    let gameEnd;
    let json = JSON.parse(url.searchParams.get("arg0"))
        

    if (json.reason==0) {
        //console.log(json.stars)
        let req = [
            {
                "jsonrpc": "2.0",
                "method": "SagaApi.gameEnd3",
                "params": [
                    json
                ],
                "id": 5
            }
        ]

        //console.log(JSON.stringify(levelSyncRequest[0]))
        //console.log(`BuFu6gBFv79BH9hk${json.episodeId}${json.levelId}${json.score}${json.stars}true${coreUserId}`)
        let gameEndRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(req)})).json()
        gameEnd = gameEndRes[0].result

        let levelId = json.levelId + 1
        let episodeId = json.episodeId
        let episodeCompleted = false
        if (episodeId < 1200) {
            if (episodeId <= 2 && levelId > 10) {
                episodeId++;
                levelId = 1
                episodeCompleted = true
            }
            if (episodeId > 2 && levelId > 15) {
                episodeId++;
                levelId = 1;
                episodeCompleted = true
            }
        }

        if (episodeCompleted && !gameEnd.userUniverse.episodes.find((episode)=>episode.id == episodeId)) {
            gameEnd.events.push({type:"LEVEL_UNLOCKED", data: JSON.stringify({episodeId, levelId})})
        }

        
        let levelSyncRequest = [
            {
                "jsonrpc": "2.0",
                "method": "AppUniverseApi.syncLevels",
                "params": [
                [
                    {
                    "id": levelId,
                    "episodeId": episodeId,
                    "score": 0,
                    "stars": 0,
                    "unlocked": false
                    }
                ],
                crypto.createHash('md5').update(`BuFu6gBFv79BH9hk${episodeId}${levelId}00false${coreUserId}`).digest('hex')
                ],
                "id": 5
            }
        ]
        await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(levelSyncRequest)})).json()
        

        //console.log(levelSyncRes)
        let livesData = await lives.getLivesData(coreUserId)
        livesData.lives++
        await lives.setLivesData(coreUserId,livesData)
        await lives.calcLives(coreUserId)
    }
    gameEnd.userUniverse = await getUserUniverse(coreUserId, loginSession)
    gameEnd.currentUser = await getUser(coreUserId,loginSession)
    console.log(JSON.stringify(gameEnd,4))
    return gameEnd
}

module.exports = gameEnd