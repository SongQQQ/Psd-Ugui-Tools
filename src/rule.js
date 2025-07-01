
// 处理自定义组件的默认方法
function parseDefaultParams(params) {
  // 这里不检查自定义组件参数是否为空
  const paramObj = {}
  params.forEach(param => {
    const trimmed = param.trim();
    const [key, value] = trimmed.split(":")
    if (value != undefined) {
      if (value.trim()=="true"){
        paramObj[key.trim()] = true
      }
      if (value.trim()=="false"){
        paramObj[key.trim()] = false
      }
      if (!isNaN(value.trim())&& value.trim()!=""){
        paramObj[key.trim()] = Number(value.trim())
      }
      paramObj[key.trim()] = value.trim()
    } else {
      // 如果没有值，就认为是一个bool类型并且为true
      paramObj[key.trim()] = true
    }
  });
  return paramObj
}
// 处理组件的通用函数
function parseComponent(componentStr) {
  const [compName, ...compParams] = componentStr.split('/');
  const name = compName.trim();
  return {
    "name":name,
    "parameters":parseDefaultParams(compParams),
  }
  
}

// 用来解析PS中的名字，返回一个对象
function parseRule(ruleString) {
  if (!ruleString) {
    throw new Error('规则字符串不能为空');
  }

  const parts = ruleString.split('>');
  const firstPart = parts[0].trim();

  // 解析名称和transform参数
  let name, transform;
  if (firstPart.includes('/')) {
    [name, transform] = firstPart.split('/');
    transform = transform.trim();
  } else {
    name = firstPart;
    transform = "centerMiddle";// 默认为centerMiddle
  }

  // 解析组件
  const components = parts.slice(1)
    .filter(comp => comp.trim())
    .map(parseComponent);

  return {
    // 进行解析之后分离出的名字
    name: name.trim(),
    // 一个string的transform类型
    transform,
    // 一个数组，里面有组件信息
    components
  };
}

// 如果这是个像素图层，那么名字解析之后会对不上，而提取图片的时候，得到的又是原始图片，所以需要在提取图片的时候，如果是像素图层，那么就需要对名字进行修改之后再保存
function getParesedName(name) {
  const parsedRule = parseRule(name);
  return parsedRule.name;
}
function revertParsedName(result){
  let name=`${result.name}/${result.transform}`;
  result.components.forEach(comp => {
    name+=`>${comp.name}`;
    Object.keys(comp.parameters).forEach(key => {
      name+=`/${key}:${comp.parameters[key]}`;
    });
  });
  return name;
}



module.exports = {
  parseRule,
  getParesedName,
  revertParsedName
};