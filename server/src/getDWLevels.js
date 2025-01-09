const fetch = require('node-fetch')
const fs = require('fs')

async function getDWLevels(coreUserId, loginSession) {
    let dreamworldData = []
    let episode = 1201;
    let level = 1;
    let id = 1;
    let request = [];
    while (episode <= 1245) {
        request.push({
            jsonrpc: "2.0",
            method: "AppSagaApi.getLevelToplist2",
            params: [episode, level],
            id: id,
        });
        id++;
        level++;
        if (episode <= 1202 && level > 10) {
            episode++;
            level = 1;
        }
        if (episode > 1202 && level > 15) {
            episode++;
            level = 1;
        }
    }
    let response = await fetch(
        `https://candycrush.king.com/rpc/ClientApi?_session=${loginSession}`, {
            body: JSON.stringify(request),
            method: "POST",
            headers: {
                "content-type": "application/json",
                Host: "mobilecrush.king.com",
            },
        }
    );
    let levelId = 0
    let episodeId = 1201
    let toplistsjson = await response.json();
    for (let toplist of toplistsjson) {
        // console.log(toplist)
        let yourScore = toplist.result?.toplist?.find(
            (score) => score.userId == coreUserId
        );
        if (yourScore && yourScore.value > 0) {
            let targets = JSON.parse(
                fs.readFileSync(
                    `./levels/episode${toplist.result.episodeId}level${toplist.result.levelId}.txt`
                )
            ).scoreTargets;
            let obj = {
                id: toplist.result.levelId,
                episodeId: toplist.result.episodeId,
                score: yourScore.value,
                stars: 1,
                unlocked: true,
                completedAt: Math.floor(Date.now() / 1000),
                unlockConditionDataList: [],
            };
            if (obj.score >= targets[1]) obj.stars = 2;
            if (obj.score >= targets[2]) obj.stars = 3;
            // console.log(
            //    "found score " +
            //    obj.score +
            //    " earning " +
            //    obj.stars +
            //    " stars for episode " +
            //    obj.episodeId +
            //    " level " +
            //    obj.id
            // );
            levelId = obj.id
            episodeId = obj.episodeId
            let episode = dreamworldData.find(
                (episode) => episode.id == obj.episodeId
            );
            if (!episode) {
                episode = {
                    id: obj.episodeId,
                    levels: [],
                };
                dreamworldData.push(episode);
            }
            let level = episode.levels.find(
                (level) => level.id == obj.id
            );
            if (level) {
                if (level.stars <= obj.stars && level.score < obj.score) {
                    Object.assign(level, obj);
                }
            } else {
                episode.levels.push(obj);
            }
        } else {
            break
        }
    }

    levelId++
    if (episodeId <= 1202 && levelId > 10) {
        episodeId++;
        levelId = 1;
    }
    if (episodeId > 1202 && levelId > 15) {
        episodeId++;
        levelId = 1;
    }

    let dwEpisode = dreamworldData.find((episode)=>episode.id == episodeId)
    if (dwEpisode) {
        dwEpisode.levels.push({
            id: levelId,
            episodeId: episodeId,
            score: 0,
            stars: 0,
            unlocked: true,
            completedAt: -1,
            unlockConditionDataList: [],
        })
    } else {
        dreamworldData.push({
            id: episodeId,
            levels:[
                {
                    id: levelId,
                    episodeId: episodeId,
                    score: 0,
                    stars: 0,
                    unlocked: true,
                    completedAt: -1,
                    unlockConditionDataList: [],
                }
            ]
        })
    }
    return dreamworldData
}

module.exports = getDWLevels