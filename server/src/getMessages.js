const getUser = require('./currentUser')

async function getMessages(coreUserId, loginSession) {
    let getMessagesReq = [
        {
            "jsonrpc": "2.0",
            "method": "SagaApi.getMessages",
            "params": [
            ],
            "id": 5
        }
    ]
    let getMessagesRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(getMessagesReq)})).json()
    getMessagesRes = getMessagesRes[0].result
    getMessagesRes.currentUser = await getUser(coreUserId, loginSession)
    return getMessagesRes
}

module.exports = getMessages