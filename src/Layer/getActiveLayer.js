const app=require("photoshop").app

// 只支持选中一个图层。
function getActiveLayer() {
    const selectedLayers = app.activeDocument.activeLayers;
    if (selectedLayers.length == 0) {
       return null;
    }
    if (selectedLayers.length == 1) {
       return selectedLayers[0];
    }
    else{
        return null;
    }
}

module.exports = {getActiveLayer};