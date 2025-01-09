//SagaApi.getEpisodeChampions
async function getEpisodeChampions(loginSession, url) {
    let getEpisodeChampionsReq = [
        {
            "jsonrpc": "2.0",
            "method": "SagaApi.getEpisodeChampions",
            "params": [
                JSON.parse(url.searchParams.get('arg0'))
            ],
            "id": 5
        }
    ]
    let getEpisodeChampionsRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(getEpisodeChampionsReq)})).json()
    console.log(getEpisodeChampionsRes)
    return getEpisodeChampionsRes[0].result
}

module.exports = getEpisodeChampions