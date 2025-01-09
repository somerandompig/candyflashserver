const fetch = require('node-fetch')

async function getTopList(loginSession, episodeId, levelId) {
    let topListRequest = [
        {
            "jsonrpc": "2.0",
            "method": "AppSagaApi.getLevelToplist2",
            "params": [episodeId,levelId],
            "id": 3
        }
    ]
    let toplistRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(topListRequest)})).json()
    //console.log(toplistRes[0].result)
    return toplistRes[0].result
}

module.exports = getTopList