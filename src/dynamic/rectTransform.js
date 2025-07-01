function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const horizontalMap = {
  left: 0,
  center: 0.5,
  right: 1,
  stretch: [0, 1],
};

const verticalMap = {
  top: 1,
  middle: 0.5,
  bottom: 0,
  stretch: [0, 1],
};

// 识别 anchor 关键字组合成标准名称
function getAnchorPreset(a, b) {
  const horizontalSet = new Set(Object.keys(horizontalMap));
  const verticalSet = new Set(Object.keys(verticalMap));

  let horizontal = null;
  let vertical = null;

  for (const word of [a.toLowerCase(), b.toLowerCase()]) {
    if (horizontalSet.has(word) && !horizontal) {
      horizontal = word;
    } else if (verticalSet.has(word) && !vertical) {
      vertical = word;
    } else {
      return null; // 非法输入
    }
  }

  if (!horizontal || !vertical) return null;

  return horizontal + capitalize(vertical);
}

// 根据锚点名称生成 anchor 数值数组
function getAnchor(anchorName) {
  const re = /^([a-z]+)(Top|Middle|Bottom|Stretch)$/i;
  const match = anchorName.match(re);
  if (!match) {
    console.log("Invalid anchor name:", anchorName)
    return null
  };

  const horizontalKey = match[1].toLowerCase();
  const verticalKey = match[2].toLowerCase();

  const x = horizontalMap[horizontalKey];
  const y = verticalMap[verticalKey];

  if (!x || !y) return null;

  let xMin, xMax, yMin, yMax;

  if (Array.isArray(x)) {
    [xMin, xMax] = x;
  } else {
    xMin = xMax = x;
  }

  if (Array.isArray(y)) {
    [yMin, yMax] = y;
  } else {
    yMin = yMax = y;
  }

  return [
    { x: xMin, y: yMin },
    { x: xMax, y: yMax }
  ];
}

function splitAnchorName(anchorName) {
  // 所有合法的锚点关键词
  const horizontal = ["left", "center", "right", "stretch"];
  const vertical = ["top", "middle", "bottom", "stretch"];

  anchorName = anchorName.toLowerCase(); // 统一小写处理

  for (let h of horizontal) {
    if (anchorName.startsWith(h)) {
      const v = anchorName.slice(h.length);
      if (vertical.includes(v)) {
        return [h, v];
      }
    }
  }

  return null; // 无法解析
}

const horizontalList = ["left", "center", "right", "stretch"];
const verticalList = ["top", "middle", "bottom", "stretch"];

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function splitAnchorName(anchorName) {
  anchorName = anchorName.toLowerCase();
  for (let h of horizontalList) {
    if (anchorName.startsWith(h)) {
      const v = anchorName.slice(h.length);
      if (verticalList.includes(v)) {
        return [h, v];
      }
    }
  }
  return null;
}

function joinAnchorName(horizontal, vertical) {
  return horizontal.toLowerCase() + capitalize(vertical.toLowerCase());
}

function updateAnchor(anchorName, newPart) {
  const parts = splitAnchorName(anchorName);
  if (!parts) throw new Error("Invalid anchorName: " + anchorName);

  newPart = newPart.toLowerCase();

  if (horizontalList.includes(newPart)) {
    return joinAnchorName(newPart, parts[1]);
  } else if (verticalList.includes(newPart)) {
    return joinAnchorName(parts[0], newPart);
  } else {
    throw new Error("Invalid newPart (must be horizontal or vertical): " + newPart);
  }
}

module.exports = { getAnchorPreset,getAnchor,splitAnchorName,updateAnchor };