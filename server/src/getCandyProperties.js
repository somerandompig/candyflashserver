async function getCandyProperties(loginSession) {
    // CandyCrushAPI.getCandyProperties
    let getCandyPropertiesReq = [
        {
            "jsonrpc": "2.0",
            "method": "CandyCrushAPI.getCandyProperties",
            "params": [
            ],
            "id": 5
        }
    ]
    let getCandyPropertiesRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(getCandyPropertiesReq)})).json()
    return getCandyPropertiesRes[0].result
}

module.exports = getCandyProperties