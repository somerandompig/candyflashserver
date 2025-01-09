//AppCandyCrushAPI.getWheelOfBoosterPrize2
async function getWheelOfBoosterPrize2(loginSession) {
    let getWheelOfBoosterPrize2Req = [
        {
            "jsonrpc": "2.0",
            "method": "AppCandyCrushAPI.getWheelOfBoosterPrize2",
            "params": [
            ],
            "id": 5
        }
    ]
    let getWheelOfBoosterPrize2Res = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(getWheelOfBoosterPrize2Req)})).json()
    return getWheelOfBoosterPrize2Res[0].result
}

module.exports = getWheelOfBoosterPrize2