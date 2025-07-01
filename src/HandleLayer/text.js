const ps = require("photoshop");
const doc = ps.app.activeDocument;

// 添加文档存在性检查
if (!doc) {
  console.warn("没有打开的文档");
  return;
}
const dpi = doc.resolution;

function ptToPx(pt) {
  return pt * dpi / 72;
}
// 从矩阵中求角度（单位：度）
function getRotationAngleFromMatrix(xx, yx) {
    const rad = Math.atan2(yx, xx);
    return rad * 180 / Math.PI;
}


function handleText(layerDesc, result) {
  result.textLayerData.kind = "text"
  result.textLayerData.text = layerDesc.textKey.textKey
  const rawText = layerDesc?.textKey?.textKey || '';
  const hasNewLine = rawText.includes('\n') || rawText.includes('\r');
  const cleanText = rawText.replace(/[\r\n]/g, '');
  result.textLayerData.text = cleanText;
  result.textLayerData.warp = hasNewLine; 
  result.textLayerData.fontSize = ptToPx(layerDesc.textKey.textStyleRange[0]?.textStyle.impliedFontSize?._value)
  result.textLayerData.color = layerDesc.textKey.textStyleRange?.[0]?.textStyle?.color
    ? {
      r: layerDesc.textKey.textStyleRange[0].textStyle.color.red,
      g: layerDesc.textKey.textStyleRange[0].textStyle.color.grain,
      b: layerDesc.textKey.textStyleRange[0].textStyle.color.blue,
    }
    : null;
  result.textLayerData.textAlign = layerDesc.textKey.paragraphStyleRange?.[0]?.paragraphStyle?.align?._value || "left";
  
  //获取描边信息
  result.textLayerData.haveShadow = (layerDesc?.layerEffects?.frameFX != null && layerDesc?.layerEffects?.frameFX?.enabled === true);
  if (result.textLayerData.haveShadow) {
    const frameFx = layerDesc.layerEffects.frameFX;
    result.textLayerData.shadowWidth = frameFx.size?._value || 0; // 描边宽度
    result.textLayerData.shadowColor = frameFx.color ? {
      r: frameFx.color.red,
      g: frameFx.color.grain, // 注意：这里是grain不是green
      b: frameFx.color.blue,
      a: (frameFx.opacity?._value || 100) * 2.55 // 透明度转换为0-1
    } : null;
  } else {
    result.textLayerData.shadowWidth = 0;
    result.textLayerData.shadowColor = null;
  }
  
  // 旋转
  result.textLayerData.rotation = 0
  if (layerDesc.textKey.transform) {
    const transform = layerDesc.textKey.transform;
    const angle = getRotationAngleFromMatrix(transform.xx, transform.yx);
    result.textLayerData.rotation = angle
  }
}

module.exports = { handleText }