const app = require('photoshop').app
const core = require('photoshop').core
const { action } = require("photoshop");
const { batchPlay } = action;
// 对矢量图层进行格栅化为像素图层

async function rasterizing() {
    try {
        const doc = app.activeDocument
        recursionRasterizing(doc.layers)
    } catch (err) {
        console.log("err: ", err)
    }
    core.showAlert("已经将所有图片格栅化")
}
async function recursionRasterizing(layers) {
    layers.forEach(layer => {
        if (layer.kind == "group") {
            recursionRasterizing(layer.layers)
        }
        if (layer.kind == "solidColor") {
            rasterizeLayer(app.activeDocument._id, layer._id)
        }
    });
    core.showAlert("已经将所有图片格栅化")
}

async function rasterizeLayer(docId, layerId) {
    try {
        await core.executeAsModal(async () => {
            batchPlay(
                [{
                    _obj: "rasterizeLayer",
                    _target: [
                        { _ref: "layer", _id: layerId },
                        { _ref: "document", _id: docId }
                    ],
                    _options: { dialogOptions: "dontDisplay" }
                }],
                { synchronousExecution: true }
            );
        })
        console.log(`格栅化成功${layerId}`);
    } catch (err) {
        console.warn(`⚠️ 不能栅格化 layerId=${layerId}:`, err);
    }
}
async function rasterizingSmartObject() {
    try {
        const doc = app.activeDocument;
        await core.executeAsModal(async () => {
            await recursionRasterizingSmartObject(doc.layers, doc._id);
        }, { commandName: "Rasterize All SmartObjects" });
    } catch (err) {
        console.log("发生错误: ", err);
    }
}

async function recursionRasterizingSmartObject(layers, docId) {
    for (const layer of layers) {
        if (layer.kind === "group") {
            await recursionRasterizingSmartObject(layer.layers, docId);
        } else if (layer.kind === "smartObject") {
            console.log("尝试栅格化", layer.name);
            await rasterizeSmartObjectLayer(docId, layer._id);
        }
    }
}

async function rasterizeSmartObjectLayer(docId, layerId) {
    try {
        await batchPlay([{
            _obj: "rasterizeLayer", // 推荐你用 Alchemist 验证真实命令
            _target: [
                { _ref: "layer", _id: layerId },
                { _ref: "document", _id: docId }
            ],
            _options: { dialogOptions: "dontDisplay" }
        }], { synchronousExecution: true });
        console.log(`✅ 成功栅格化 layerId=${layerId}`);
    } catch (err) {
        console.warn(`⚠️ 不能栅格化 layerId=${layerId}:`, err);
    }
}
module.exports = { rasterizing,rasterizingSmartObject }