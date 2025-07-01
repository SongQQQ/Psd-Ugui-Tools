const photoshop = require("photoshop");
const { batchPlay } = photoshop.action;
const parseRule = require("./rule.js").parseRule;
const app = require("photoshop").app
const doc = app.activeDocument;
const handleRectTransform = require("./GeneralHandle/rectTransform.js").handleRectTransform;
const handleText = require("./HandleLayer/text.js").handleText;
const handleSmartObject = require("./HandleLayer/smartObject.js").handleSmartObject;
const handlePixel = require("./HandleLayer/pixel.js").handlePixel;


// 处理所有的图层的基本信息，并且对智能对象和文本图层进行特殊处理
function getLayerFullInfo(layerId, docId) {
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
}

// 提取有用的信息
async function extractUsefulLayerInfo(layerDesc, docId) {
  const result = {};
  // 通用基本信息
  result.id = layerDesc.layerID;
  result.visible = layerDesc.visible;
  result.opacity = (layerDesc.opacity ?? 255) / 255;

  const parsedResult = parseRule(layerDesc.name)
  result.name = parsedResult.name

  // 这里解析处理图层的rectTransform，并直接以值的形式保存到result，让unity的脚本能超级方便的处理
  await handleRectTransform(layerDesc, parsedResult.transform, result)
  handleAllKind(layerDesc, result)
  return result;
}

// 处理不同种类的图层
function handleAllKind(layerDesc, result) {
  try {
    if (layerDesc.layerKind == 7) {
      result.layerKind = "group"
    }
    // 如果是文本图层（layerKind = 3）
    if (layerDesc.textKey) {
      result.textLayerData = {};
      result.layerKind = "text"
      handleText(layerDesc, result)
    }
    // 如果是智能对象图层
    if (layerDesc.smartObjectMore) {
      result.smartObjectLayerData = {};
      result.layerKind = "smartObject"
      handleSmartObject(layerDesc, result)
    }
    // 如果是像素图层
    if (layerDesc.layerKind == 1) {
      result.pixelLayerData = {};
      result.layerKind = "pixel"
      handlePixel(layerDesc, result)
    }
    else{
      console.log("未知图层类型", layerDesc.layerKind,layerDesc.name,layerDesc)
    }
  } catch (err) {
    console.log("出错了", err)
  }
}


module.exports = {
  getLayerFullInfo,
  extractUsefulLayerInfo,
};