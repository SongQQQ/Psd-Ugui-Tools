const getActiveLayer = require('./src/Layer/getActiveLayer.js').getActiveLayer;
const getLayerInfo = require("./src/Layer/getLayerInfo.js").getLayerInfo;
const config = require('./config/config.js').config;
const host = require('uxp').host;
const listenActiveLayerChangeCallback = require("./src/Layer/ListenActiveLayerChangeCallback.js").listenActiveLayerChangeCallback
const listenActiveLayerChangeEvent = require("./src/Layer/listenActiveLayerChangeEvent.js").listenActiveLayerChangeEvent
const loadPage = require("./src/loadPage.js").loadPage
const { action, core } = require("photoshop");

if (config.testMode) {
  try {
    test()
  } catch (err) {
    console.log("err : ", err)
  }
  hostInfo()
}
console.log("main:");
main()

function main() {
  // 检查是否有打开的文档
  const ps = require("photoshop");
  if (!ps.app.activeDocument) {
    core.showAlert({
      message: "请先在 Photoshop 中打开一个 PSD 文档后再使用此插件"
    });
    return;
  }

  document.getElementById("loadPageOutput").addEventListener("click", function outputPage() {
    loadPage("output")
  })

  // 循环事件处理，保存移除函数
  window._removeActiveLayerListener = listenActiveLayerChangeEvent(listenActiveLayerChangeCallback);

  // 监听关闭当前 PSD 文档，自动清理事件监听
  action.addNotificationListener(["close"], (event) => {
    if (window._removeActiveLayerListener) {
      window._removeActiveLayerListener();
    }
  });
  action.addNotificationListener(["open"], function () {
    console.log("文档打开了")
    window._removeActiveLayerListener = listenActiveLayerChangeEvent(listenActiveLayerChangeCallback);
  })
  loadPage("index")
}
// testMode == true
function test() {
  // 获得文档分辨率
  const ps = require("photoshop");
  const doc = ps.app.activeDocument;
  if (doc) {
    console.log(`当前文档DPI：${doc.resolution} DPI`);
  }
  action.addNotificationListener(["select"], function () {
    const layer = getActiveLayer()
    const layerDesc = getLayerInfo(layer._id)
    console.log(JSON.stringify(layerDesc))
  });
}
function hostInfo() {
  const locale = host.uiLocale;
  const hostName = host.name
  const hostVersion = host.version;
  // const hostOS = require('os').platform(); // 移除 Node os
  const hostOS = host.os || "unknown";
  console.log(`locale: ${locale}  host ${hostName} version ${hostVersion} running on ${hostOS}`);
}