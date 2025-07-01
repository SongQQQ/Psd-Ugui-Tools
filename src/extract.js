// 提取psd中的所有图片到指定地址
const app = require('photoshop').app
const fs = require('uxp').storage.localFileSystem
const imaging = require('photoshop').imaging
const core = require('photoshop').core
const batchPlay = require("photoshop").action.batchPlay
const file = require("./file.js")
const rule = require("./rule.js")

// 这个是用来导出所有图片的包括kind：smartObject，pixel

async function extractAllPNG() {
    const doc = app.activeDocument
    // 获取所有的图层信息
    const docId = doc._id
    const layers = doc.layers
    const folder = await fs.getFolder()

    await recursionExtractPNG(docId, layers, folder)
    await statisticLayerKind()
}
async function recursionExtractPNG(docId, layers, folder) {
    for (const layer of layers) {
        try {
            if (layer.kind == "group") {
                await recursionExtractPNG(docId, layer.layers, folder)
            }
            if (layer.kind == "smartObject") {
                const layerDesc = await getLayerFullInfo(layer._id, docId)
                const filename = layerDesc.smartObject.fileReference
                await extractPNG(docId, layer._id, folder, filename)
            }
            if (layer.kind == "pixel") {    
                const layerDesc = await getLayerFullInfo(layer._id, docId)
                layerDesc.name = rule.getParesedName(layerDesc.name)
                await core.executeAsModal(async () => {
                    const pixels = await imaging.getPixels({
                        documentID: docId,
                        layerID: layer._id,
                        applyAlpha: false,
                    });
                    const imageData = await pixels.imageData.getData();
                    const buffer = await file.saveARGBPNG(pixels.imageData.width, pixels.imageData.height, imageData)
                    saveFile(folder, buffer, layerDesc.name + ".png")
                });
            }
        } catch (err) {
            console.log("出错: ", err)
        }
    }
}


async function saveFile(folder, ab, name) {
    try {
        const file = await folder.createFile(name, { overwrite: true });
        await file.write(ab);
    } catch (err) {
        console.log("出错: ", err)
    }
}
async function extractPNG(docId, layerId, folder, name) {
    try {
        // 注意，这里做了修改文件后缀名的操作用来应对psb文件的情况
        const pngExtensionName = changeFileExtension(name, "png")
        // 首先获得imageData
        await core.executeAsModal(async () => {
            const pixels = await imaging.getPixels({
                documentID: docId,
                layerID: layerId,
                applyAlpha: false,
            });
            const imageData = await pixels.imageData.getData();
            const buffer = await file.saveARGBPNG(pixels.imageData.width, pixels.imageData.height, imageData)
            saveFile(folder, buffer, pngExtensionName)
            console.log("保存文件成功", pngExtensionName)
        });

    } catch (err) {
        console.log("出错: ", err);
    }
}
// 修改文件扩展名
function changeFileExtension(filename, newExtension) {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
        // 如果没有找到点，表示没有后缀名
        return filename + newExtension;
    }
    // 修改后缀名
    const newFileName = filename.slice(0, lastDotIndex) + '.' + newExtension;
    return newFileName
}
// 获取一个layer的全部信息
function getLayerFullInfo(layerId, docId) {
    try {
        const res = batchPlay(
            [
                {
                    _obj: "get",
                    _target: [
                        { _ref: "layer", _id: layerId },
                        { _ref: "document", _id: docId }
                    ],
                    _options: {
                        dialogOptions: "dontDisplay"
                    }
                }
            ],
            { synchronousExecution: true }
        )[0];
        return res;
    } catch (err) {
        console.log("出错: ", err)
    }
}



module.exports = { extractAllPNG }