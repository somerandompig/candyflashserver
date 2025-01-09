const fs = require('fs')
const getUser = require('./currentUser.js')
const lives = require('./lives.js')

async function gameStart(coreUserId, loginSession, levelId, episodeId, url) {
    let gameStartReq = [
        {
            "jsonrpc": "2.0",
            "method": "SagaApi.gameStart2",
            "params": [
                parseInt(url.searchParams.get('arg0')),
                parseInt(url.searchParams.get('arg1')),
                parseInt(url.searchParams.get('arg2')),
            ],
            "id": 5
        }
    ]
    let gameStartRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(gameStartReq)})).json()
    gameStartRes = gameStartRes[0].result
    gameStartRes.levelData = await fs.promises.readFile(`./levels/episode${episodeId}level${levelId}.txt`, 'utf8'),
    gameStartRes.recommendedSeeds = []
    //gameStartRes.currentUser = await getUser(coreUserId, loginSession)
    gameStartRes.currentUser = await getUser(coreUserId,loginSession)
    return gameStartRes
}


module.exports = gameStart