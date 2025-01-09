const fs = require('fs')
const config = require('../../config.json')

async function getLivesData(coreUserId) {
    let livesData
    let livesDataExists = fs.existsSync(`../tmp/livesData/${coreUserId}.json`)
    if (livesDataExists) {
        try {
            livesData = fs.readFileSync(`../tmp/livesData/${coreUserId}.json`,'utf8')
            livesData = JSON.parse(livesData)
        } catch (err) {
            console.error(err)
            console.warn("Lives data is corrupted! Recreating..")
            livesData = {
                lives:5,
                maxLives:5,
                userHasCharmOfLives:false,
                timeToNextRegeneration:-1000,
                timestampLastCheck:0
            }
            await fs.promises.writeFile(`../tmp/livesData/${coreUserId}.json`,JSON.stringify(livesData,null,'\t'),'utf8')
        }
    } else {
        console.warn("Lives data doesn't exist! Creating..")
        livesData = {
            lives:5,
            maxLives:5,
            userHasCharmOfLives:false,
            timeToNextRegeneration:-1000,
            timestampLastCheck:0
        }
        await fs.promises.writeFile(`../tmp/livesData/${coreUserId}.json`,JSON.stringify(livesData,null,'\t'),'utf8')
    }
    return livesData
}

async function setLivesData(coreUserId,livesData) {
    fs.writeFileSync(`../tmp/livesData/${coreUserId}.json`,JSON.stringify(livesData,null,'\t'),'utf8')
}


async function calcLives(coreUserId) {
    let livesData = await getLivesData(coreUserId)
    let maxLives = livesData.maxLives

    if (livesData.userHasCharmOfLives) {
        maxLives+=3
    }

    if (!config.doLives) {
        return {
            lives: maxLives,
            maxLives: maxLives,
            timeToNextRegeneration:-1
        }
    }

    let now = Date.now()
    if (livesData.lives<maxLives) {
        let long = now - livesData.timestampLastCheck;
        let addlife = livesData.timeToNextRegeneration - long;
        if(addlife > 0) {
            livesData.timeToNextRegeneration = livesData.timeToNextRegeneration - long;
        } else {
            addlife = -addlife;
            livesData.lives += 1
            livesData.lives += Math.floor(addlife/1800000);
            livesData.timeToNextRegeneration = 1800000 - (addlife % 1800000);
            // console.log(addlife)
            // console.log(addlife / 1800000)
            // console.log(addlife % 1800000)
        }
    }

    if(livesData.lives >= maxLives) {
        livesData.lives = maxLives;
        livesData.timeToNextRegeneration = -1000;
    }

    livesData.timestampLastCheck = now
    let lives = {
        lives: livesData.lives,
        maxLives: maxLives,
        timeToNextRegeneration: Math.floor(livesData.timeToNextRegeneration/1000)
    }
    //console.log(lives)
    await setLivesData(coreUserId,livesData)
    return lives
}

module.exports = {
    calcLives,
    getLivesData,
    setLivesData
}