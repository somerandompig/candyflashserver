async function setSoundFx(loginSession, url) {
    let setSoundReq = [
        {
            "jsonrpc": "2.0",
            "method": "SagaApi.setSoundFx",
            "params": [
                JSON.parse(url.searchParams.get('arg0'))
            ],
            "id": 5
        }
    ]
    let setSoundRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(setSoundReq)})).json()
    return setSoundRes[0].result
}

module.exports = setSoundFx