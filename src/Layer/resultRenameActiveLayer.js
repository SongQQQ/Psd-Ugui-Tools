const getActiveLayer = require("./getActiveLayer.js").getActiveLayer;
const revertParsedName = require("../rule.js").revertParsedName
const renameLayer = require("./renameLayer.js").renameLayer;



function resultRenameActiveLayer(result) {
    const layer = getActiveLayer()
    const newName = revertParsedName(result)
    renameLayer(layer, newName)
}

module.exports = {
    resultRenameActiveLayer
}