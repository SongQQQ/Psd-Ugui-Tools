const { PNG } = require("./png/browser.js")
const fs = require('uxp').storage.localFileSystem



async function saveDataToFile(data) {
  try {
    // 1. 让用户选择保存位置
    folder = await fs.getFolder();

    // 2. 创建JSON字符串
    const jsonString = JSON.stringify(data, null, 2);

    // 3. 创建文件并写入数据
    const file = await folder.createFile("data.json", { overwrite: true });
    await file.write(jsonString);

  } catch (error) {
    console.error("保存文件时出错:", error);
  }
}

async function saveARGBPNG(width, height, imageData) {
  try {
    const png=new PNG({
      width:width,
      height:height,
      filterType:-1
    })
    for(let i=0;i<imageData.length;i++){
      png.data[i] = imageData[i];
    }
    const buffer = PNG.sync.write(png);  // 获取 PNG 的二进制数据
    return buffer;

  } catch (error) {
    console.log("保存PNG文件时出错:", error)
  }
}


module.exports = {
  saveDataToFile,
  saveARGBPNG,
};