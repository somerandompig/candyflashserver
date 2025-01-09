(async function() {
    const http = require('http')
    const fs = require('fs')
    const fetch = require('node-fetch')
    const port = 4000
    const cookie = require('cookie')
    
    const gameInit = require('./server/src/gameInitOld.js')
    const getMessages = require('./server/src/getMessages.js')
    const getUser = require('./server/src/currentUser.js')
    const gameStart = require('./server/src/gameStart.js')
    const getTopList = require('./server/src/getToplist.js')
    const gameEnd = require('./server/src/gameEnd.js')
    const { getTransformIds, transformResponse } = require('./server/src/clientApiTransform.js')
    const { getBoosters } = require('./server/src/getBoosters.js')
    const { handOutItemWinnings, unlockBooster, useItemsInGame } = require('./server/src/addRemoveBooster.js')
    const deliverInitialHardCurrencyGift = require('./server/src/deliverInitialHardCurrencyGift.js')
    const getFriendsTopBonusLevel = require('./server/src/getFriendsTopBonusLevel.js')

    const getEpisodeChampions = require('./server/src/getEpisodeChampions.js')
    const getCandyProperties = require('./server/src/getCandyProperties.js')
    const setCandyProperty = require('./server/src/setCandyProperty.js')

    const setSoundFx = require('./server/src/setSoundFx.js')
    const setSoundMusic = require('./server/src/setSoundMusic.js')

    const getWheelOfBoosterPrize = require('./server/src/getWheelOfBoosterPrize.js')
    const getWheelOfBoosterPrize2 = require('./server/src/getWheelOfBoosterPrize2.js')
    const wheelOfBoosterCheck = require('./server/src/wheelOfBoosterCheck.js')
    //newitemdata.json
    //[{"type":"CandyColorBomb","amount":1}]
    //will need a translation object for the types ://
    
    
    async function poll(coreUserId,loginSession) {
        return {currentUser: await getUser(coreUserId,loginSession)}
    }

    async function getCoreUserId(loginSession) {
        let getMyUserReq = [{
            "jsonrpc": "2.0",
            "method": "AppSocialUserApi.getCurrentUser2",
            "params": [["50x50","100x100","200x200"]],
            "id": 3
        }]
        let getMyUserRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(getMyUserReq)})).json()
        //console.log(getMyUserRes)
        getMyUserRes=getMyUserRes[0].result
        return getMyUserRes?.externalUserId
    }

    
   
    async function purchaseItem(res,body,coreUserId,loginSession) {
        let json = JSON.parse(body)
        console.log(json)
        
        /*let purchaseItemReq = [{
            jsonrpc:'2.0',
            method: 'AppProductApi.purchaseFromKing4',
            params: [
                json.orderItems[0].productPackageType,
                'KHC',
                '',
                coreUserId,
                'MOID4371b115608417230c76edce4bcc2d40',
                Math.floor(Math.random()*1000000).toString(),
                'MOID4371b115608417230c76edce4bcc2d40' + Math.floor(Math.random()*1000000).toString()
            ],
            id: 63
        }]
        let purchaseItemRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(purchaseItemReq)})).json()
        console.log(purchaseItemRes[0])
        //note we should do stuff with the boosters probably :)
        for (let item of purchaseItemRes[0].result.itemTypeIdToDeliver) {
            switch(typeIds[item]) {
                case "booster":
                    console.log('added a booster')
                    let boosterAddReq = [{
                        "jsonrpc": "2.0",
                        "method": "CCSBoosterApi.addBoosters",
                        "params": [
                        crypto.randomUUID(),
                        [
                            {
                            "typeId": item,
                            "amount": 3,
                            "availability": 2
                            }
                        ],
                        "1:1",
                        crypto.createHash('md5').update(`BuFu6gBFv79BH9hk${item}32`).digest('hex')
                        ],
                        "id": 55
                    }]
                    let boosterAddRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(boosterAddReq)})).json()
                    break;
                case "charm":
                    console.log('you did not')
                    break;
                case "lives":
                    console.log('lives bought why')
                    let livesData = await getLivesDataForUser(coreUserId)
                    livesData.lives=livesData.maxLives
                    if (livesData.userHasCharmOfLives) {
                        livesData.lives+=3
                    }
                    await setLivesDataForUser(coreUserId,livesData)
                    break;
                default:
                    //its probably just undefined as it is nothing lol
                    break;
            }
        }
        */
        res.writeHead(200,{"content-type":"application/json"})
        res.end(JSON.stringify({status:'ok',message:''}))//JSON.stringify({status:purchaseItemRes[0].result.status,message:purchaseItemRes[0].result.message}))
    }

    http.createServer(async function (req,res){
        //console.log('request')
        if (req.method=="OPTIONS") {
            res.writeHead(204,{
            "Access-Control-Allow-Origin":"https://enderspearl184.github.io",
            "Access-Control-Allow-Credentials":"true",
            "Access-Control-Allow-Headers":"*"
            })
            res.end()
            return
        }
        let body=Buffer.alloc(0);
        req.on('data',(chunk)=> {
            body=Buffer.concat([body,chunk])
        })

        req.on('end', async()=>{
            try {
                //console.log(req.url)
                let path = req.url.split("?")[0]
                //console.log(path)
                console.log(req.url)
                if (!path || path == "/" || path == "/index.html") {
                    let file = await fs.promises.readFile('./index.html', 'utf8')
                    res.end(file)
                    return
                }

                let cookies = cookie.parse(req.headers['cookie'] || "").candyflashsession
                if (path == "/rpc/ClientApi") {
                    if (req.method == "POST") {
                        let rpc = req.url.replace(/_session=(.*)/, `_session=${cookies}`)
                        let apiTransformIds = await getTransformIds(body.toString())
                        let apiRes = await fetch(`https://candycrush.king.com${rpc}`,
                        {
                            method:"POST",
                            body: body.toString()
                        })
                        let apiJson = await apiRes.json()
                        if (apiTransformIds.length) {
                            await transformResponse(apiTransformIds, apiJson)
                        }
                        res.writeHead(200, {"cache-control":"no-cache"})
                        return res.end(JSON.stringify(apiJson))
                    } else {
                        res.writeHead(405)
                        return res.end('wrong method')
                    }
                }
               
                if (!cookies) {
                    res.writeHead(302,{
                        location:"/"
                    })
                    res.end()
                    return
                }
                let coreUserId = await getCoreUserId(cookies)
                //console.log(coreUserId)
                if (!coreUserId) {
                    res.writeHead(302,{
                        "set-cookie":"session=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
                        'location':'/'
                    })
                    res.end()
                    return
                }

            

                let url = URL.parse(`https://localhost${req.url}`)
                //handOutItemWinnings, unlockBooster, useItemsInGame
                switch (path) {
                    // /candycrushapi/getWheelOfBoosterPrize
                    case "/candycrushapi/getWheelOfBoosterPrize2":
                        let getWheelOfBoosterPrize2Res = await getWheelOfBoosterPrize2(cookies)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(getWheelOfBoosterPrize2Res))
                        return
                    case "/candycrushapi/getWheelOfBoosterPrize":
                        let getWheelOfBoosterPrizeRes = await getWheelOfBoosterPrize(cookies)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(getWheelOfBoosterPrizeRes))
                        return
                    case "/candycrushapi/setCandyProperty":
                        let setCandyPropertyRes = await setCandyProperty(cookies, url)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(setCandyPropertyRes))
                        return
                    case "/api/setSoundMusic":
                        let setSoundMusicRes = await setSoundMusic(cookies, url)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(setSoundMusicRes))
                        return
                    case "/api/setSoundFx":
                        let setSoundFxRes = await setSoundFx(cookies, url)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(setSoundFxRes))
                        return
                    case "/candycrushapi/getCandyProperties":
                        let getCandyPropertiesRes = await getCandyProperties(cookies)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(getCandyPropertiesRes))
                        return
                    case "/api/getEpisodeChampions":
                        let getEpisodeChampionsRes = await getEpisodeChampions(cookies, url)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(getEpisodeChampionsRes))
                        return
                    case "/api/getFriendsTopBonusLevel":
                        let getFriendsTopBonusLevelRes = await getFriendsTopBonusLevel(cookies, url)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(getFriendsTopBonusLevelRes))
                        return
                    case "/api/handOutItemWinnings":
                        let addItemRes = await handOutItemWinnings(coreUserId,cookies,url)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(addItemRes))
                        return
                    case "/api/useItemsInGame":
                        let useItemRes = await useItemsInGame(coreUserId,cookies,url)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(useItemRes))
                        return
                    case "/api/unlockItem":
                        let unlockRes = await unlockBooster(coreUserId,cookies,url)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(unlockRes))
                        return
                    case "/api/getBalance":
                        let balanceRes = await getBoosters(coreUserId, cookies)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(balanceRes))
                        return
                    case "/cdn-cgi/rum":
                        res.writeHead(204)
                        res.end()
                        return
                    case "/api/canvasParameters":
                        let params = JSON.parse(await fs.promises.readFile('./server/data/canvasParameters.json'))
                        params.commonParameters.coreUserId = coreUserId
                        params.commonParameters.sessionKey = cookies
                        params.commonParameters.wheelActive = await wheelOfBoosterCheck(cookies)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(params))
                        return
                    case "/GuiTracking/CustomFunnel":
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end('true')
                        return
                    case "/candycrushapi/deliverInitialHardCurrencyGiftForIntroPop":
                        await deliverInitialHardCurrencyGift(cookies)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end([])
                        return
                    case "/api/getMessages":
                        let messagesRes = await getMessages(coreUserId, cookies)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(messagesRes))
                        return
                    case "/api/gameInitLight":
                        let gameInitData = await gameInit(coreUserId, cookies)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(gameInitData))
                        return
                    case "/candycrushapi/getGameModes":
                    case "/candycrushapi/getGameModePerLevel":

                    //this one needs to be figured out still.
                    //it seems to be used to hide tutorials among other popups
                    //which is needed if this is to become a curation

                    case "/candycrushapi/getLevelAbTests":
                    case "/candycrushapi/hardlevels.json":
                    case "/candycrushapi/sales.json":
                    case "/candycrushapi/liveops.json":

                    //perhaps getcandyproperty stuff needs to be looked into as well
                    case "/api/reportFramerate":

                    //sugar track stuff needs to be looked into more. or just ignored.
                    case "/sugartrackapi/getSugarTrackLevels":
                    case "/sugartrackapi/syncSugarTrack":
                        let fileRes = await fs.promises.readFile('.' + path, 'utf8')
                        res.writeHead(200, {"cache-control":"no-cache"})
                        return res.end(fileRes)
                    case "/candycrushapi/getWebFileUrl":

                        let webfile = url.searchParams.get("arg0")
                        
                        if (webfile == "/hl.json") {
                            res.writeHead(200, {"cache-control":"no-cache"})
                            //res.end(await fs.promises.readFile('./candycrushapi/hardlevels.json', 'utf8'))
                            res.end('"candycrushapi/hardlevels.json"')
                            return
                        } else if (webfile == "/s.json") {
                            res.writeHead(200, {"cache-control":"no-cache"})
                            res.end('"https://enderspearl184.github.io/candyflash/candycrushapi/sales.json"')
                            return
                        } else if (webfile == "/lo.json") {
                            res.writeHead(200, {"cache-control":"no-cache"})
                            res.end('"https://enderspearl184.github.io/candyflash/candycrushapi/liveops.json"')
                            return
                        }
                            
                        res.writeHead(404)
                        res.end('webfile doesnt exist LOL')
                        return
                    //this one needs to actually be made to work later but its stubbed for now
                    case "/api/handOutItemWinnings":
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end('[]')
                        return
                    case "/api/gameStart2": {
                        let levelId = url.searchParams.get("arg1")
                        let episodeId = url.searchParams.get('arg0')
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(await gameStart(coreUserId, cookies, levelId, episodeId, url)))
                        return
                    }
                    case "/api/getLevelToplist":{
                        let levelId = url.searchParams.get('arg1')
                        let episodeId = url.searchParams.get('arg0')
                        let toplist = await getTopList(cookies, episodeId, levelId)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(toplist))
                        return
                    }
                    case "/api/gameEnd3": {
                        let gameEndRes = await gameEnd(coreUserId, cookies, url)
                        res.writeHead(200, {"cache-control":"no-cache"})
                        res.end(JSON.stringify(gameEndRes))
                        return
                    }
                    //default:
                    //    res.writeHead(404)
                    //    res.end('not implemented')
                    //    return
                }

                if (req.url.startsWith('/api/poll')) {
                    res.writeHead(200, {"cache-control":"no-cache"})
                    res.end(JSON.stringify(await poll(coreUserId,cookies)))
                    return
                } else {
                    res.writeHead(404)
                    res.end()
                }
            } catch (err) {
                console.warn(err)
                try {
                    res.writeHead(500)
                    res.end()
                } catch (err2) {
                    console.warn(err2)
                }
            }
        })
    }).listen(port)
    console.log('ready!')
})();