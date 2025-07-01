const getActiveLayer = require("../Layer/getActiveLayer.js").getActiveLayer
const parseRule = require("../rule.js").parseRule
const getAnchor = require("../dynamic/rectTransform.js").getAnchor
const resultRenameActiveLayer = require("../Layer/resultRenameActiveLayer.js").resultRenameActiveLayer

const getLayerInfo = require("../Layer/getLayerInfo.js").getLayerInfo
const splitAnchorName = require("../dynamic/rectTransform.js").splitAnchorName
const updateAnchor = require("../dynamic/rectTransform.js").updateAnchor


///////////////这些是处理rectTransform的函数/////////////////////
// 处理名字和rectTransform
async function handleRectTransform(layerDesc, transform, result) {
    const doc = require("photoshop").app.activeDocument
    try {
        if (layerDesc.boundsNoEffects) {
            // 检查是否是最上层节点（没有parent）
            if (layerDesc.parentLayerID == -1) {
                // 最上层节点使用静态布局
                result.rectTransform = handleRectTransformLayerGourp0(layerDesc.boundsNoEffects, doc);
                result.rectTransform.anchor = [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 }]
            } else {
                // 根据transform类型处理rectTransform
                parent = await getLayerInfo(layerDesc.parentLayerID)
                result.rectTransform = calculateRectTransform(layerDesc.boundsNoEffects, parent.boundsNoEffects)
                result.rectTransform.anchor = getAnchor(transform)
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}
function calculateRectTransform(boundsNoEffects, parentBounds) {
    const width = boundsNoEffects.width._value;
    const height = boundsNoEffects.height._value;
    const parentWidth = parentBounds.right._value - parentBounds.left._value;
    const parentHeight = parentBounds.bottom._value - parentBounds.top._value;
    const centerX = boundsNoEffects.left._value + width / 2;
    const centerY = boundsNoEffects.top._value + height / 2;
    const parentCenterX = parentBounds.left._value + parentWidth / 2;
    const parentCenterY = parentBounds.top._value + parentHeight / 2;
    // 适用于 anchorMin = anchorMax 的情况，例如 middleCenter
    const anchoredPosition = {
        x: centerX - parentCenterX,
        y: -(centerY - parentCenterY)  // 注意 Photoshop 是向下 Y 正，Unity 是向上
    };
    const sizeDelta = {
        x: width,
        y: height
    };
    // 适用于 anchorMin = (0, 0), anchorMax = (1, 1) 的 stretch 模式
    const offsetMin = {
        x: boundsNoEffects.left._value - parentBounds.left._value,
        y: parentBounds.bottom._value - boundsNoEffects.bottom._value
    };
    const offsetMax = {
        x: -(parentBounds.right._value - boundsNoEffects.right._value),
        y: -(boundsNoEffects.top._value - parentBounds.top._value)
    };
    const pivot = { x: 0.5, y: 0.5 }
    return {
        pivot,
        anchoredPosition,
        sizeDelta,
        offsetMin,
        offsetMax
    };
}



function handleRectTransformLayerGourp0(boundsNoEffects, doc) {
    const width = boundsNoEffects.width._value;
    const height = boundsNoEffects.height._value;
    const docWidth = doc.width;
    const docHeight = doc.height;
    const offsetMin = {
        x: boundsNoEffects.left._value,
        y: docHeight - boundsNoEffects.bottom._value
    };
    const offsetMax = {
        x: -(docWidth - boundsNoEffects.right._value),
        y: -(boundsNoEffects.top._value)
    };
    const anchoredPosition = {
        x: 0,
        y: 0
    };
    const sizeDelta = {
        x: width,
        y: height
    };
    const pivot = {
        x: 0.5,
        y: 0.5
    };
    return {
        pivot,
        anchoredPosition,
        sizeDelta,
        offsetMin,
        offsetMax
    };
}

function rectTransformInit(result, radioGroupElement, componentName) {
    if (result.transform == null) {
        // 并没有设置anchor 直接设置为默认值但是为了美观不修改图层名字而是选择到这个默认值
        const radioHorizontal = document.getElementById(radioGroupElement.id + "radio_" + "center")
        const radioVertical = document.getElementById(radioGroupElement.id + "radio_" + "middle")
        radioHorizontal.setAttribute("checked")
        radioVertical.setAttribute("checked")
        return
    }
    const transformName = result.transform
    const splitName = splitAnchorName(transformName)
    if (splitName == null) {
        throw new Error("rectTransform 格式错误", transformName)
    }
    const radioHorizontalName = splitName[0]
    const radioVerticalName = splitName[1]
    if (componentName == "horizontalAnchor") {
        const radioHorizontal = document.getElementById(radioGroupElement.id + "radio_" + radioHorizontalName)
        radioHorizontal.setAttribute("checked")
    }
    if (componentName == "verticalAnchor") {
        const radioVertical = document.getElementById(radioGroupElement.id + "radio_" + radioVerticalName)
        radioVertical.setAttribute("checked")
    }
}

function rectTransformCallback(radioGroupElement) {
    radioGroupElement.addEventListener("change", event => {
        const LayerName = getActiveLayer().name
        const result = parseRule(LayerName)
        const newTrasform = updateAnchor(result.transform, event.target.value)
        result.transform = newTrasform
        resultRenameActiveLayer(result)
    })
}



module.exports = {
    handleRectTransform,
    rectTransformInit,
    rectTransformCallback
}