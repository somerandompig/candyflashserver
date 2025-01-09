const fs = require('fs')
const getCurrentUser = require('./currentUser.js')
const { getBoosters, getUnlockedBoosters, getAvailableBoosters } = require('./getBoosters.js')
const getUserUniverse = require('./userUniverse.js')

/*
{
"currentUser":  { currentUser obj }
"resources": { strings lol }
"availableBoosters": [ Booster object..?]
userProfiles [ ??? ]

universeDescription: {
just auto gen this once
but i think its episodeDescriptions
and like each episode has levelDescriptions
}

userUniverse: { we have code that gets this tho i think its the same }
properties: {}
goldProducts: [ GoldProducts?? ]
lifeProducts: [ LifeProducts?? ]
levelProducts: [ CollaborationProducts?? ]
ingameProducts: [ IngameProducts?? ]
events: [ smth event parser does prob leave empty ]
adsEnabled: false
daySinceInstall = 34929
itemBalance: [ ItemInfo ]
recipes: [ Recipes?? ]
multiProducts: [ MultiProducts?? ]
language: "EN"
}
*/

const gameInitTemplate = {
    resources: require("../data/gameInitResources.json"),
    currentUser: null,
    properties: {
        "cutscene_episode_6": "bunny",
        "cutscene_episode_5": "unicorn",
        "cutscene_episode_2": "robot",
        "cutscene_episode_1": "girl",
        "cutscene_episode_4": "yeti",
        "cutscene_episode_3": "dragon",
        "ad_video_activated": false
    },
    availableBoosters: [],
    language: "en",
    multiProducts: [],
    recipes: [],
    itemBalance: [],
    daysSinceInstall: 43959,
    adsEnabled: false,
    events: [],
    "itemProducts":[],
    "lifeProducts":[],
    "extraLifeProducts":[],
    "levelProducts":[],
    "ingameProducts": [],
    "multiProducts":[],
    goldProducts: [],
    "userUniverse": {
        "episodes": [
        {
            "id": 1,
            "levels": [
            {
                "id": 1,
                "episodeId": 1,
                "stars": 0,
                "unlocked": true,
                "completedAt": 0,
                "unlockConditionDataList": []
            }
            ]
        }
        ],
        "unlockedItems": []
    },

    
    userProfiles: [{
        "userId": 1158690351,
        "externalUserId": "100003276970771",
        "lastOnlineTime": 3214567,
        "fullName": "Enderspearl184",
        "name": "Enderspearl184",
        "pic": "https://p.midasplayer.com/a/a31_100x100.png",
        "picSquare": "https://p.midasplayer.com/a/a31_100x100.png",
        "picSmall": "https://p.midasplayer.com/a/a31_100x100.png",
        "countryCode": "CA",
        "topEpisode": 1,
        "topLevel": 1,
        "totalStars": 30,
        "lastLevelCompletedAt": 0,
        "lastLevelCompletedEpisodeId": 1,
        "lastLevelCompletedLevelId": 1
    }],

    //seems this isnt actually needed...???
    universeDescription: require('../data/universeDescriptionTemplate.json')
}

async function alterMyUser(userObj, loginSession) {
    let getMyUserReq = [{
        "jsonrpc": "2.0",
        "method": "AppSocialUserApi.getCurrentUser2",
        "params": [["50x50","100x100","200x200"]],
        "id": 3
    }]
    let getMyUserRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(getMyUserReq)})).json()
    //console.log('getmyuserres', getMyUserRes)
    getMyUserRes=getMyUserRes[0].result
    /*
    {
        "userId": 1158690351,
        "externalUserId": "100003276970771",
        "lastOnlineTime": 1370482998,
        "fullName": "Enderspearl184",
        "name": "Enderspearl184",
        "pic": "https://p.midasplayer.com/a/a31_100x100.png",
        "picSquare": "https://p.midasplayer.com/a/a31_100x100.png",
        "picSmall": "https://p.midasplayer.com/a/a31_100x100.png",
        "countryCode": "CA",
        "topEpisode": 1,
        "topLevel": 1,
        "totalStars": 30,
        "lastLevelCompletedAt": 0,
        "lastLevelCompletedEpisodeId": 1,
        "lastLevelCompletedLevelId": 1
    }
    */
    userObj.userId = getMyUserRes.userId
    userObj.externalUserId = getMyUserRes.externalUserId
    userObj.fullName=getMyUserRes.firstName
    userObj.name=getMyUserRes.name
    userObj.pic=getMyUserRes.pic100
    userObj.picSquare=getMyUserRes.pic100
    userObj.picSmall=getMyUserRes.pic100
    userObj.lastOnlineTime=getMyUserRes.lastSignInTime
}

async function getFriendsProgress(loginSession) {
    let getFriendsReq = [{
        "jsonrpc": "2.0",
        "method": "FriendshipApi.getFriends",
        "params": [true,['100x100']],
        "id": 3
    }]
    /*
    {
        "userId": 1158690351,
        "externalUserId": "100003276970771",
        "lastOnlineTime": 1370482998,
        "fullName": "Enderspearl184",
        "name": "Enderspearl184",
        "pic": "https://p.midasplayer.com/a/a31_100x100.png",
        "picSquare": "https://p.midasplayer.com/a/a31_100x100.png",
        "picSmall": "https://p.midasplayer.com/a/a31_100x100.png",
        "countryCode": "CA",
        "topEpisode": 1,
        "topLevel": 1,
        "totalStars": 30,
        "lastLevelCompletedAt": 0,
        "lastLevelCompletedEpisodeId": 1,
        "lastLevelCompletedLevelId": 1
    }
    */
    let getFriendsRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(getFriendsReq)})).json()
    getFriendsRes = getFriendsRes[0].result
    let array = []
    for (let friend of getFriendsRes) {
        //console.log(friend)
        array.push({
            "userId": friend.coreUserId,
            "externalUserId": friend.coreUserId.toString(),
            "lastOnlineTime": friend.lastSignInTimestamp,
            "fullName": friend.name,
            "name": friend.name,
            "pic": friend.pictureUrls[0],
            "picSquare": friend.pictureUrls[0],
            "picSmall": friend.pictureUrls[0],
            "countryCode": friend.country,
            "topEpisode": 1,
            "topLevel": 1,
            "totalStars": 30,
            "lastLevelCompletedAt": 0,
            "lastLevelCompletedEpisodeId": 1,
            "lastLevelCompletedLevelId": 1
        })
    }
    let getFriendsProgressReq = [{
        jsonrpc:"2.0",
        method:'CandyPlayerInfoApi.getPlayerInfos2',
        id:1,
        params:[array.map((friend)=>friend.userId)]
    }]
    //console.log(getFriendsProgressReq[0])
    let getFriendsProgressRes = await (await fetch(`https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`,{method:"POST",credentials:"include",body:JSON.stringify(getFriendsProgressReq)})).json()
    getFriendsProgressRes = getFriendsProgressRes[0].result
    for (let i=0; i<getFriendsProgressRes.length;i++) {
        array[i].topEpisode = getFriendsProgressRes[i].topEpisode
        array[i].topLevel = getFriendsProgressRes[i].topLevel
    }
    return array
}

async function gameInit(coreUserId, loginSession) {
    let json = { ...gameInitTemplate }
    json.currentUser = await getCurrentUser(coreUserId, loginSession)

    //userUniverse
    json.userUniverse = await getUserUniverse(coreUserId, loginSession)

    json.unlockedBoosters = await getUnlockedBoosters(loginSession)
    json.availableBoosters = await getAvailableBoosters(loginSession)

    let episodeId = json.userUniverse.episodes.length
    let levelId
    if (episodeId) {
        levelId = json.userUniverse.episodes[episodeId-1].levels.length+1
        if ((episodeId<=2 && levelId>=11) || (levelId>=16)) {
            levelId=1
            episodeId++
        }
    } else {
        episodeId=1
        levelId=2
    }
    if (episodeId<=189) {
        json.userProfiles[0].topEpisode = episodeId
        json.userProfiles[0].topLevel = levelId
    } else {
        json.userProfiles[0].topEpisode = 189
        json.userProfiles[0].topLevel = 15
    }
    let stars = 0
    for (let episode of json.userUniverse.episodes) {
        for (let level of episode.levels) {
            if (level.stars>=4) {level.stars=3}
            stars+=level.stars
        }
    }
    json.userProfiles[0].totalStars = stars
    await alterMyUser(json.userProfiles[0], loginSession)
    //until the popup can be hacked out this is unsafe.
    json.userProfiles = json.userProfiles.concat(await getFriendsProgress(loginSession))
    //console.log(json.userProfiles)
    //now get item balance
    json.itemBalance = await getBoosters(coreUserId,loginSession)

    return json
}

module.exports = gameInit