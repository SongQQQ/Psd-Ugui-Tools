function handleSmartObject(layerDesc, result) {
    result.smartObjectLayerData.kind = "smartObject";
    // result.smartObjectLayerData.height = layerDesc.smartObjectMore.size.height;
    // result.smartObjectLayerData.width = layerDesc.smartObjectMore.size.width;
    // result.smartObjectLayerData.fileReference = layerDesc.smartObject.fileReference;
}
module.exports = { handleSmartObject }