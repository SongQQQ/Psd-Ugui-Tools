const parseRule= require('../rule.js').parseRule;
const revertParsedName= require('../rule.js').revertParsedName;


// 添加组件 stringName: 现在的图层名称 componentName: 要添加的组件名称 return 新的图层名称
function addComponent(layerNameString,componentName){
    const result = parseRule(layerNameString);
    result.components.push({name:componentName,parameters:{}});
    const newName=revertParsedName(result);
    return newName;
}
module.exports={
    addComponent 
}