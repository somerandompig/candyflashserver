//AppCandyCrushAPI.hasActiveWheelOfBooster
async function wheelOfBoosterCheck(loginSession) {
    let req = [
        {
            "jsonrpc": "2.0",
            "method": "AppCandyCrushAPI.hasActiveWheelOfBooster",
            "params": [
            ],
            "id": 5
        }
    ]
    let res = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(req)})).json()
    return res[0].result
}

module.exports = wheelOfBoosterCheck