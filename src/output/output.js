const handler = require("../handler.js")
const extracter = require("../extract.js")
const rasterize = require("../rasterize.js")

function listen() {
    document.getElementById("btnExport").addEventListener("click", handler.exportLayerData);
    document.getElementById("btnExtractPNG").addEventListener("click", extracter.extractAllPNG);
    document.getElementById("btnRasterizing").addEventListener("click", rasterize.rasterizing);
    document.getElementById("btnRasterizingSmartObject").addEventListener("click", rasterize.rasterizingSmartObject);
}
module.exports = {listen}