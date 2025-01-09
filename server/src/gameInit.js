const getCurrentUser = require('./currentUser.js')
const { getBoosters, getUnlockedBoosters, getAvailableBoosters } = require('./getBoosters.js')
const getUserUniverse = require('./userUniverse.js')

async function gameInit(coreUserId, loginSession) {
    let gameInitReq = [
        {
            "jsonrpc": "2.0",
            "method": "SagaApi.gameInitLight",
            "params": [],
            "id": 3
        }
    ]
    let json = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(gameInitReq)})).json()
    json = json[0].result
    json.userUniverse = await getUserUniverse(coreUserId, loginSession)

    return json
}

module.exports = gameInit