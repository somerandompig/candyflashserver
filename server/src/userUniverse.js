const fetch = require('node-fetch')
const getDWLevels = require('./getDWLevels.js')
const { getUnlockedItems } = require('./getBoosters.js')

async function getUserUniverse(coreUserId, loginSession) {
    let universeRequest = [
        {
            "jsonrpc": "2.0",
            "method": "AppUniverseApi.getUniverse3",
            "params": [1,1200],
            "id": 3
        }
    ]
    let universeRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(universeRequest)})).json()
    //console.log(universeRes)
    let universe = universeRes[0].result

    /*
    let levelId = 0
    let episodeObj;
    for (let episode of universe.episodes) {
        if (!episodeObj || episode.id > episodeObj.id) {
            episodeObj = episode
        }
    }
    if (episodeObj) {
        for (let level of episodeObj.levels) {
            if (level.stars && level.id > levelId) {
                levelId = level.id
            }
        }
    }

    levelId++
    let episodeId = episodeObj?.id || 1
    if (episodeId <= 2 && levelId > 10) {
        episodeId++;
        levelId = 1;
    }
    if (episodeId > 2 && levelId > 15) {
        episodeId++;
        levelId = 1;
    }

    let episodeObj2 = universe.episodes.find((episode)=> episode.id == episodeId)
    //console.log(episodeObj2, episodeId)
    if (episodeObj2) {
        episodeObj2.levels.push({
            id: levelId,
            episodeId: episodeId,
            score: 0,
            stars: 0,
            unlocked: true,
            completedAt: -1,
            unlockConditionDataList: [],
        })
    } else {
        universe.episodes.push({
            id: episodeId,
            levels:[
                {
                    id: levelId,
                    episodeId: episodeId,
                    score: 0,
                    stars: 0,
                    unlocked: true,
                    completedAt: -1,
                    unlockConditionDataList: [],
                }
            ]
        })
    }*/

    if (universe.episodes.length == 0) {
        universe.episodes.push({
            id: 1,
            levels:[
                {
                    id: 1,
                    episodeId: 1,
                    score: 0,
                    stars: 0,
                    unlocked: true,
                    completedAt: -1,
                    unlockConditionDataList: [],
                }
            ]
        })
    }

    universe.unlockedItems = []//await getUnlockedItems(loginSession)
    //console.log(universe.unlockedItems)

    universe.episodes = universe.episodes.slice(0,189).concat(await getDWLevels(coreUserId, loginSession))

    return universe
}

module.exports = getUserUniverse