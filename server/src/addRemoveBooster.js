const boosterTranslation = require('../data/boosterIdentifiers.json')
const { getBoosters } = require('./getBoosters.js')
const crypto = require('node:crypto')

//SagaApi.handOutItemWinnings
async function addBooster(loginSession, booster, amount) {
    let boosterAddReq = [{
        "jsonrpc": "2.0",
        "method": "CCSBoosterApi.addBoosters",
        "params": [
        crypto.randomUUID(),
        [
            {
            "typeId": boosterTranslation[booster],
            "amount": amount,
            "availability": 2
            }
        ],
        "1:1",
        crypto.createHash('md5').update(`BuFu6gBFv79BH9hk${boosterTranslation[booster]}${amount}2`).digest('hex')
        ],
        "id": 55
    }]
    let boosterAddRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(boosterAddReq)})).json()
}

async function removeBooster(loginSession, booster, amount) {
    let boosterUseReq = [{
        "jsonrpc": "2.0",
        "method": "CCSBoosterApi.useBoosters",
        "params": [
        crypto.randomUUID(),
        [
            {
            "typeId": boosterTranslation[booster],
            "amount": amount,
            "availability": 2
            }
        ],
        "1:1"
        ],
        "id": 55
    }]
    let boosterUseRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(boosterUseReq)})).json()
}


async function handOutItemWinnings(coreUserId, loginSession, url) {
    let json = JSON.parse(url.searchParams.get('arg0'))
    for (let booster of json) {
        if (booster.type.includes('Charm')) continue
        if (!boosterTranslation[booster.type]) continue
        await addBooster(loginSession, booster.type, booster.amount)
    }
    return await getBoosters(coreUserId, loginSession)
}

async function unlockBooster(coreUserId, loginSession, url) {
    let booster = url.searchParams.get('arg0')
    if (!booster.includes('Charm') && boosterTranslation[booster]) {
        await addBooster(loginSession, booster, 1);
        await removeBooster(loginSession, booster, 1);
    }
    return await getBoosters(coreUserId, loginSession)
}

async function useItemsInGame(coreUserId, loginSession, url) {
    let json = JSON.parse(url.searchParams.get('arg0'))
    for (let booster of json) {
        if (booster.type.includes('Charm')) continue
        if (!boosterTranslation[booster.type]) continue
        await removeBooster(loginSession, booster.type, booster.amount)
    }
    return await getBoosters(coreUserId, loginSession)
}

module.exports = {
    handOutItemWinnings,
    unlockBooster,
    useItemsInGame
}