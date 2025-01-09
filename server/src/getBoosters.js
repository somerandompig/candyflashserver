const fetch = require('node-fetch')
const lives = require('./lives.js')
const boosterIdentifiers = require('../data/boosterIdentifiers.json')

async function getBoosters(coreUserId, loginSession) {
    let boosterGetReq = [{"jsonrpc":"2.0","method":"AppSagaApi.getAllItems","params":[],"id":296}]
    let boosterGetRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(boosterGetReq)})).json()
    let boosterResponse = boosterGetRes[0].result
    //console.log(boosterResponse)
    //boosterResponse.push({"typeId":3202,"type":"CandyCharmOfFrozenTime","category":"candyBooster","amount":1,"availability":2,"leaseStatus":0})

    /*
    let userProgressGetReq = [{"jsonrpc":"2.0","method":"CandyPlayerInfoApi.getMyPlayerInfo2","params":[],"id":43}]
    let userProgressGetRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(userProgressGetReq)})).json()
    userProgressGetRes = userProgressGetRes[0].result
    let episodeId = userProgressGetRes.topEpisode
    let levelId = userProgressGetRes.topLevel+1

    if ((episodeId<=2 && levelId>=11) || (levelId>=16)) {
        levelId=1
        episodeId++
    }
    */
    let livesData = await lives.getLivesData(coreUserId)
    if (boosterResponse.find((booster)=>booster.typeId==3200&&booster.amount>0)) {
        livesData.userHasCharmOfLives=true
    } else {
        livesData.userHasCharmOfLives=false
    }
    await lives.setLivesData(coreUserId,livesData)
    
    /*
    if (boosterResponse.find((booster)=>booster.typeId==3200)) {
        boosterResponse.filter((booster)=>booster.typeId==3200).forEach((charm)=>charm.availability=2)    
    } else {
        if (episodeId>=2) {
            boosterResponse.push({"typeId":3200,"type":"CandyCharmOfExtraLife","category":"candyCharm","amount":0,"availability":2,"leaseStatus":0})
        }
    }

    if (boosterResponse.find((booster)=>booster.typeId==3201)) {
        boosterResponse.filter((booster)=>booster.typeId==3201).forEach((charm)=>charm.availability=2)
    } else {
        if (episodeId>2 || (episodeId==2 && levelId>=6)) {
            boosterResponse.push({"typeId":3201,"type":"CandyCharmOfStripedCandy","category":"candyCharm","amount":0,"availability":2,"leaseStatus":0})
        }
    }

    if (episodeId>2 || (episodeId==2 && levelId>=10)) {
        boosterResponse.push({"typeId":3202,"type":"CandyCharmOfFrozenTime","category":"candyBooster","amount":0,"availability":2,"leaseStatus":0})
    }
    */
    return boosterResponse
}

async function getUnlockedBoosters(loginSession) {
    let boosterGetReq = [{"jsonrpc":"2.0","method":"AppSagaApi.getAllItems","params":[],"id":296}]
    let boosterGetRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(boosterGetReq)})).json()
    let boosterResponse = boosterGetRes[0].result
    let boosterIds = []
    for (let booster of boosterResponse) {
        if (booster.category === "candyBooster" && booster.availability === 2) {
            boosterIds.push(booster.typeId)
        }
    }
    return boosterIds
}

async function getAvailableBoosters(loginSession) {
    let boosterGetReq = [{"jsonrpc":"2.0","method":"AppSagaApi.getAllItems","params":[],"id":296}]
    let boosterGetRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(boosterGetReq)})).json()
    let boosterResponse = boosterGetRes[0].result
    let boosters = []
    for (let booster of boosterResponse) {
        if (booster.category === "candyBooster" && booster.availability === 2) {
            boosters.push({
                id: booster.typeId,
                count: booster.amount,
                price: 100000
            })
        }
    }
    return boosters
}

async function getBoosterInventory(loginSession) {
    let boosterGetReq = [{"jsonrpc":"2.0","method":"AppSagaApi.getAllItems","params":[],"id":296}]
    let boosterGetRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(boosterGetReq)})).json()
    let boosterResponse = boosterGetRes[0].result
    let inventory = {}
    for (let booster of boosterResponse) {
        inventory[booster.typeId.toString()] = booster.amount
        inventory[boosterIdentifiers[booster.typeId.toString()]] = booster.amount
    }
    return inventory
}

async function getUnlockedItems(loginSession) {
    let boosterGetReq = [{"jsonrpc":"2.0","method":"AppSagaApi.getAllItems","params":[],"id":296}]
    let boosterGetRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(boosterGetReq)})).json()
    let boosterResponse = boosterGetRes[0].result
    let unlocked = []
    for (let booster of boosterResponse) {
        if (booster.availability === 2) {
            unlocked.push({
                id: booster.typeId,
                type: booster.category
            })
        }
    }
    return unlocked
}

module.exports = { getBoosters, getUnlockedBoosters, getAvailableBoosters, getBoosterInventory, getUnlockedItems }