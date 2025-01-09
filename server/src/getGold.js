const fetch = require('node-fetch')

async function getGold(loginSession) {
    let goldRequest = [
        {
            "jsonrpc": "2.0",
            "method": "AppVirtualCurrencyApi.getBalance",
            "params": [],
            "id": 2
        }
    ]
    //console.log(loginRequest //no
    //console.log(loginSession)
    let goldRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(goldRequest)})).json()
    //console.log(goldRes)
    return goldRes[0].result?.hardCurrency
}

module.exports = getGold