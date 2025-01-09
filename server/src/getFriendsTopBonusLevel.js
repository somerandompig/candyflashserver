async function getFriendsTopBonusLevel(loginSession, url) {
    let episodeStart = url.searchParams.get('arg0')
    let episodeEnd = url.searchParams.get('arg1')
    if (episodeStart && episodeEnd) {
        let friendTopLevelReq = [
            {
                "jsonrpc": "2.0",
                "method": "SagaApi.getFriendsTopBonusLevel",
                "params": [
                
                    episodeStart,
                    episodeEnd
                
                ],
                "id": 5
            }
        ]
        //console.log(JSON.stringify(levelSyncRequest[0]))
        //console.log(`BuFu6gBFv79BH9hk${json.episodeId}${json.levelId}${json.score}${json.stars}true${coreUserId}`)
        let friendTopLevelRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(friendTopLevelReq)})).json()
        return friendTopLevelRes[0]?.result
    }
    return "invalid request"
}

module.exports = getFriendsTopBonusLevel