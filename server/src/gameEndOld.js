const fs = require('fs')
const crypto = require('node:crypto')
const fetch = require('node-fetch')
const getToplist = require('./getToplist.js')
const getUser = require('./currentUser.js')
const lives = require('./lives.js')
const getUserUniverse = require('./userUniverse.js')

const gameEndTemplate = {
    bestResult: false,
    newStarLevel: false,
    episodeId: 1,
    levelId: 1,
    score: 0,
    stars: 0,
    events: [],
    levelToplist: {
        episodeId: 1,
        levelid: 1,
        toplist: []
    },
    userUniverse: {episodes:[]},
    currentUser: {}
}
async function gameEnd(coreUserId, loginSession, url) {
    let gameEnd = {...gameEndTemplate}
    gameEnd.events = []
    //console.log(url)
    if (url.searchParams.get("arg0")) {
        let json = JSON.parse(url.searchParams.get("arg0"))
        gameEnd.episodeId = json.episodeId
        gameEnd.levelId = json.levelId
        gameEnd.score = json.score
        
        //check level stars
        let level = JSON.parse(await fs.promises.readFile(`./levels/episode${gameEnd.episodeId}level${gameEnd.levelId}.txt`))
        gameEnd.stars = 0
        for (let scoreTarget of level.scoreTargets) {
            if (json.score>=scoreTarget) {
                gameEnd.stars = level.scoreTargets.indexOf(scoreTarget)+1
            }
        }

        if (gameEnd.stars == 0 && json.reason == 0) {
            json.reason = 2223
        }

        if (json.reason==0) {
            //check if best ever and if new star level
            let tempUniverse = await getUserUniverse(coreUserId, loginSession)
            //try to find level
            let episode = tempUniverse.episodes.find((episode)=> episode.id == gameEnd.episodeId)
            let levelScore = episode?.levels.find((levelentry)=> levelentry.id == gameEnd.levelId)

            let episodeCompleted = false
            let newLevelCompleted = false

            if (gameEnd.score > levelScore.score && gameEnd.stars >= levelScore.stars) {
                gameEnd.bestResult = true
            }

            //level 
            let nextLevelId;
            let nextEpisodeId;
            
            if (gameEnd.stars > levelScore.stars) {
                gameEnd.newStarLevel = true


                if (!levelScore.stars) {
                    let levelId = gameEnd.levelId + 1
                    let episodeId = gameEnd.episodeId
                    if (episodeId > 1200) {
                        if (episodeId <= 1202 && levelId > 10) {
                            episodeId++;
                            levelId = 1;
                            episodeCompleted = true
                        }
                        if (episodeId > 1202 && levelId > 15) {
                            episodeId++;
                            levelId = 1;
                            episodeCompleted = true
                        }
                    } else {
                        if (episodeId <= 2 && levelId > 10) {
                            episodeId++;
                            levelId = 1;
                            episodeCompleted = true
                        }
                        if (episodeId > 2 && levelId > 15) {
                            episodeId++;
                            levelId = 1;
                            episodeCompleted = true
                        }
                    }
                    newLevelCompleted = true
                    nextEpisodeId = episodeId
                    nextLevelId = levelId
                    gameEnd.events.push({type:"LEVEL_COMPLETED", data: JSON.stringify({episodeId: gameEnd.episodeId, levelId: gameEnd.levelId})})
                    //gameEnd.events.push({type:"LEVEL_UNLOCKED", data: JSON.stringify({episodeId, levelId})})
                }
            }
            
            let doUnlockNextLevel = false
            // this just makes the popup appear
            if (episodeCompleted) {
                gameEnd.events.push({type:"EPISODE_COMPLETED", data: JSON.stringify({episodeId: gameEnd.episodeId})})
                // but do we unlock the next level
                if (gameEnd.episodeId == 1 || gameEnd.episodeId >= 63) {
                    doUnlockNextLevel = true
                } else {
                    doUnlockNextLevel = false
                }
            } else if (newLevelCompleted) {
                doUnlockNextLevel = true
            }

            if (doUnlockNextLevel) {
                gameEnd.events.push({type:"LEVEL_UNLOCKED", data: JSON.stringify({episodeId: json.episodeId, levelId: nextLevelId})})
            }

            //console.log(json.stars)
            let levelSyncRequest = [
                {
                    "jsonrpc": "2.0",
                    "method": "AppUniverseApi.syncLevels",
                    "params": [
                    [
                        {
                        "id": json.levelId,
                        "episodeId": json.episodeId,
                        "score": gameEnd.score,
                        "stars": gameEnd.stars,
                        "unlocked": true
                        }
                    ],
                    crypto.createHash('md5').update(`BuFu6gBFv79BH9hk${json.episodeId}${json.levelId}${gameEnd.score}${gameEnd.stars}true${coreUserId}`).digest('hex')
                    ],
                    "id": 5
                }
            ]
            //console.log(JSON.stringify(levelSyncRequest[0]))
            //console.log(`BuFu6gBFv79BH9hk${json.episodeId}${json.levelId}${json.score}${json.stars}true${coreUserId}`)
            let levelSyncRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(levelSyncRequest)})).json()
            //console.log(levelSyncRes)
            let livesData = await lives.getLivesData(coreUserId)
            livesData.lives++
            await lives.setLivesData(coreUserId,livesData)
            await lives.calcLives(coreUserId)
        }
        gameEnd.levelToplist = await getToplist(loginSession, json.episodeId, json.levelId)
        gameEnd.userUniverse = await getUserUniverse(coreUserId, loginSession)
        gameEnd.currentUser = await getUser(coreUserId,loginSession)
    }
    //console.log(JSON.stringify(gameEnd,4))
    return gameEnd
}

module.exports = gameEnd