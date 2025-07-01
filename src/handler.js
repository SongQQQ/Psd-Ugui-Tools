const rules = require("./rule.js")
const app = require('photoshop').app;
const core = require('photoshop').core;
const layerHandle = require("./layer.js")
const fileHandle = require("./file.js")


// 得到一棵树状的层级基本信息
async function getLayersData() {
    const doc = app.activeDocument;
    var layerTree = await core.getLayerTree({ documentID: doc._id })
    var result = {
        layers: [],
        name: "root",
        layerKind: "canvas",
        visible: true,
    }
    console.log("获取到树状图层信息", layerTree)
    result.canvasLayerData = {}
    result.canvasLayerData.width = doc.width
    result.canvasLayerData.height = doc.height
    console.log("默认的屏幕尺寸", config.default.screen.width, config.default.screen.height);
    if (config.default.screen.width != 0 && config.default.screen.height != 0) {
        result.canvasLayerData.width = config.default.screen.width
        result.canvasLayerData.height = config.default.screen.height
    }
    // todo: 这里应该添加一个选择框，用来选择 overlay camera worldSpace
    result.canvasLayerData.renderMode = "camera"
    try {
        // 这里的result是一个更完整的，相反的树。
        await processLayerList(layerTree.list, result.layers)
    }
    catch (err) {
        console.log("err : ", err)
    }

    return result;
}

// 对这棵树进行处理的代码，获取全部信息
async function processLayerList(layerTreeList, resultList) {
    const doc = app.activeDocument;
    const docId = doc._id;
    // 先反转输入列表以保持正确的顺序（PS中从上到下的顺序）
    const reversedList = [...layerTreeList].reverse()

    //循环这一层的每一个layer，并获取到详细信息layerFullInfo，利用layer包提供的处理函数，提取关键信息保存到layerInfo中
    for (const layer of reversedList) {
        const layerFullInfo = layerHandle.getLayerFullInfo(layer.layerID, docId)
        if (layerFullInfo.visible == true) {
            const layerInfo = await layerHandle.extractUsefulLayerInfo(layerFullInfo, docId)
            // 如果有子图层，先处理子图层
            if (layer.list) {
                layerInfo.layers = []
                await processLayerList(layer.list, layerInfo.layers)
            }
            resultList.push(layerInfo)
        }
    }
}

async function exportLayerData() {
    let result = await getLayersData()
    fileHandle.saveDataToFile(result)
}

module.exports = {
    getLayersData,
    exportLayerData,
}


