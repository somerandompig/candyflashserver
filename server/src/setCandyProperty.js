// SagaApi.setCandyProperty
async function setCandyProperty(loginSession, url) {
    let setCandyPropertyReq = [
        {
            "jsonrpc": "2.0",
            "method": "CandyCrushAPI.setCandyProperty",
            "params": [
                url.searchParams.get('arg0'),
                JSON.parse(url.searchParams.get('arg1'))
            ],
            "id": 5
        }
    ]
    let setCandyPropertyRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(setCandyPropertyReq)})).json()
    return setCandyPropertyRes[0].result
}

module.exports = setCandyProperty