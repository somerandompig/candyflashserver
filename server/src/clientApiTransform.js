//const boosterIdentifiers = require('./boosterIdentifiers.json')
//const boosterNameTranslations = require('./boosterNameTranslations.json')
//const packageMap = require('./packageMap.json')

const prices = require('../data/prices.json')

async function getTransformIds(request) {
    let json = JSON.parse(request)
    //console.log(request)
    let transform = []
    for (let req of json) {
        //console.log(req.method)
        if (req.method == "ProductApi.getAllProductPackages") {
            transform.push({id: req.id, type: 'products'})
        }
    }
    return transform
}

/*
let OnePacks = ["CandyExtraMoves","CandyShuffle","CandyStripedBrush"];

let ThreePacks = ["CandyColorBomb","CandyExtraTime","CandyExtraMoves","CandyHammer","CandySwedishFish","CandyCoconutLiquorice","CandyFreeSwitch","CandyAntiPeppar","CandyStripedWrapped","CandyJoker","CandySweetTeeth","CandyMoonStruck","CandyBubbleGum","CandyUfoIngameThreePack"];

let SixPacks = ["CandySweetTeethSixPack","CandyMoonStruckSixPack","CandyUfoIngameSixPack"];

let NinePacks = ["CandyHammerNinePack","CandyAntiPepparNinePack","CandyStripedWrappedNinePack","CandySwedishFishNinePack","CandyFreeSwitchNinePack","CandyCoconutLiquoriceNinePack","CandyJokerNinePack","CandyExtraTimeNinePack","CandyBubbleGumNinePack","CandySweetTeethNinePack","CandyMoonStruckNinePack","CandyUfoIngameNinePack"];

let ElevenPacks = ["CandyColorBombElevenPack"];

let EighteenPacks = ["CandyHammerEighteenPack","CandyAntiPepparEighteenPack","CandyStripedWrappedEighteenPack","CandySwedishFishEighteenPack","CandyFreeSwitchEighteenPack","CandyCoconutLiquoriceEighteenPack","CandyJokerEighteenPack","CandyExtraTimeEighteenPack","CandyBubbleGumEighteenPack","CandyColorBombEighteenPack"];

let packs = [
    {amount:1,pack:OnePacks},
    {amount:3,pack:ThreePacks},
    {amount:6,pack:SixPacks},
    {amount:9,pack:NinePacks},
    {amount:11,pack:ElevenPacks},
    {amount:18,pack:EighteenPacks}
]


const boosterMapping = {   
}
boosterMapping["CandyUFOIngameBoosterThreePack"] = {amount:3, name:"CandyUfoIngame"}
boosterMapping["CandySweetTeethSixPack"] = {amount:6, name:"CandySweetTeeth"}
boosterMapping["CandyMoonStruckSixPack"] = {amount:6, name:"CandyMoonStruck"}
boosterMapping["CandyUFOIngameBoosterSixPack"] = {amount:6, name:"CandyUfoIngame"}
boosterMapping["CandyHammerNinePack"] = {amount:9, name:"CandyHammer"}
boosterMapping["CandyAntiPepparNinePack"] = {amount:9, name:"CandyAntiPeppar"}
boosterMapping["CandyStripedWrappedNinePack"] = {amount:9, name:"CandyStripedWrapped"}
boosterMapping["CandySwedishFishNinePack"] = {amount:9, name:"CandySwedishFish"}
boosterMapping["CandyFreeSwitchNinePack"] = {amount:9, name:"CandyFreeSwitch"}
boosterMapping["CandyCoconutLiquoriceNinePack"] = {amount:9, name:"CandyCoconutLiquorice"}
boosterMapping["CandyJokerNinePack"] = {amount:9, name:"CandyJoker"}
boosterMapping["CandyExtraTimeNinePack"] = {amount:9, name:"CandyExtraTime"}
boosterMapping["CandyBubbleGumNinePack"] = {amount:9, name:"CandyBubbleGum"}
boosterMapping["CandySweetTeethNinePack"] = {amount:9, name:"CandySweetTeeth"}
boosterMapping["CandyMoonStruckNinePack"] = {amount:9, name:"CandyMoonStruck"}
boosterMapping["CandyUFOIngameBoosterNinePack"] = {amount:9, name:"CandyUfoIngame"}
boosterMapping["CandyColorBombElevenPack"] = {amount:11, name:"CandyColorBomb"}
boosterMapping["CandyHammerEighteenPack"] = {amount:18, name:"CandyHammer"}
boosterMapping["CandyAntiPepparEighteenPack"] = {amount:18, name:"CandyAntiPeppar"}
boosterMapping["CandyStripedWrappedEighteenPack"] = {amount:18, name:"CandyStripedWrapped"}
boosterMapping["CandySwedishFishEighteenPack"] = {amount:18, name:"CandySwedishFish"}
boosterMapping["CandyFreeSwitchEighteenPack"] = {amount:18, name:"CandyFreeSwitch"}
boosterMapping["CandyCoconutLiquoriceEighteenPack"] = {amount:18, name:"CandyCoconutLiquorice"}
boosterMapping["CandyJokerEighteenPack"] = {amount:18, name:"CandyJoker"}
boosterMapping["CandyExtraTimeEighteenPack"] = {amount:18, name:"CandyExtraTime"}
boosterMapping["CandyBubbleGumEighteenPack"] = {amount:18, name:"CandyBubbleGum"}
boosterMapping["CandyColorBombEighteenPack"] = {amount:18, name:"CandyColorBomb"}
*/
/*
{
    "type": PRODUCTID,
    "products": [
       {
          "itemType":BOOSTERTYPEID,
          "prices":[{"cents":0,currency:"CAD"},{"cents":PRICE,currency:"KHC"}],
          "listPrices":[{"cents":0,currency:"CAD"},{"cents":PRICE,currency:"KHC"}],
          "discountFactorPercent": 100,
          "deliverData": JSON.stringify({"amount":AMOUNT})
       }
    ],
    "prices":[{"cents":0,currency:"CAD"},{"cents":PRICE,currency:"KHC"}],
    "listPrices":[{"cents":0,currency:"CAD"},{"cents":PRICE,currency:"KHC"}],
}
*/


async function transformResponse(transformIds, response) {
    for (let item of transformIds) {
        req = response.find((rpc)=>rpc.id == item.id)
        if (req) {
            if (item.type=="products") {
                for (let product of prices) {
                    let package = {
                        "type": parseInt(product.productId),
                        "products": [
                        ],
                        "prices":[{"cents":0,currency:"CAD"},{"cents":product.price * 100,currency:"KHC"}],
                        "listPrices":[{"cents":0,currency:"CAD"},{"cents":product.price * 100,currency:"KHC"}],
                    }
                    for (let item of product.items) {
                        let packageProduct = {
                            "itemType": parseInt(item.itemId),
                            "prices":[{"cents":0,currency:"CAD"},{"cents":product.price * 100,currency:"KHC"}],
                            "listPrices":[{"cents":0,currency:"CAD"},{"cents":product.price * 100,currency:"KHC"}],
                            "discountFactorPercent": 100,
                            "deliverData": JSON.stringify({"amount":1})
                        }

                        if (item.deliverData) {
                            packageProduct.deliverData - item.deliverData
                        }
                        package.products.push()
                    }
                    req.result.push(package)
                }
            }
        }
    }
}

module.exports = { getTransformIds, transformResponse }