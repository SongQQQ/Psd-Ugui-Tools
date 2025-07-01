const parseRule= require('../rule.js').parseRule;
const revertParsedName= require('../rule.js').revertParsedName;

// 给组件参数值设置默认值或修改值,获得新的图层名称 stringName:现在的图层名称 componentName:组件名称 parameterName:参数名称 parameterValueString:参数值 return 新的图层名称 
function updateParameter(stringName,componentName,parameterName,paramterValueString){
    const result = parseRule(stringName);
    for (let i = 0; i < result.components.length; i++) {
        if (result.components[i].name===componentName) {
            result.components[i].parameters[parameterName]=paramterValueString;
            break;
        }
    }
    const newName=revertParsedName(result);
    return newName;
}
module.exports={updateParameter};