async function deliverInitialHardCurrencyGift(loginSession) {
    let goldGiftReq = [
        {
            "jsonrpc": "2.0",
            "method": "AppCandyCrushAPI.deliverInitialHardCurrencyGift",
            "params": [
            ],
            "id": 5
        }
    ]
    let goldGiftRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(goldGiftReq)})).json()
    return
}

module.exports = deliverInitialHardCurrencyGift