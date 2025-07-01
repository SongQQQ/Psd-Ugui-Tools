// RGB颜色转十六进制
function rgbToHex(color) {
    if (!color || !color.rgb) return "000000";
    
    const r = Math.round(color.rgb.red);
    const g = Math.round(color.rgb.green);
    const b = Math.round(color.rgb.blue);
    
    return ((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase();
}
module.exports = {
    rgbToHex,
};
