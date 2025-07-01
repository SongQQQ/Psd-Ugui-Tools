function handlePixel(layerDesc, result) {
    result.pixelLayerData.kind = "pixel"
    // 获取图层的颜色叠加效果
    if (layerDesc.layerEffects && layerDesc.layerEffects.solidFill) 
    {
        const colorOverlay = layerDesc.layerEffects.solidFill;
        if (colorOverlay.enabled) {
            result.pixelLayerData.colorOverlay = colorOverlay.color ? {
                    r: colorOverlay.color.red,
                    g: colorOverlay.color.grain, 
                    b: colorOverlay.color.blue,
                    a: (colorOverlay.opacity?._value || 100) * 2.55
                } : null;
            }
    }else{
        result.pixelLayerData.colorOverlay = null;
    }
}
module.exports = { handlePixel }