//AppCandyCrushAPI.getWheelOfBoosterPrize2
async function getWheelOfBoosterPrize(loginSession) {
    let getWheelOfBoosterPrizeReq = [
        {
            "jsonrpc": "2.0",
            "method": "AppCandyCrushAPI.getWheelOfBoosterPrize",
            "params": [
            ],
            "id": 5
        }
    ]
    let getWheelOfBoosterPrizeRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(getWheelOfBoosterPrizeReq)})).json()
    return getWheelOfBoosterPrizeRes[0].result
}

module.exports = getWheelOfBoosterPrize