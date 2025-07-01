
function generalInitComponent(result, componentElement) {
    if (result.components.length != 0) {
        // 存在组件，需要给dom中组件里不同input进行提前赋值
        result.components.forEach(component => {
            if ("component_" + component.name == componentElement.id) {
                switch (componentElement.type) {
                    case "checkbox": {
                        // 这里可能需要注意
                        componentElement.checked = true
                        break;
                    }
                }
            }
        })
    }
}
// 给组件提前赋值
function generalInitParameter(Parsedresult, componentElement, parameterElement) {
    if (Parsedresult.components.length != 0) {
        // 存在组件，开始遍历组件 
        Parsedresult.components.forEach(component => {
            if ("component_" + component.name == componentElement.id) {
                // 找到组件，开始遍历参数
                if (component.parameters != null) {
                    for (const parameter in component.parameters) {
                        if ("parameter_" + parameter.name == parameterElement.id) {
                            switch (parameterElement.type) {
                                case "text": {
                                    parameterElement.value = parameter.value
                                    break;
                                }
                                case "number": {
                                    parameterElement.value = parameter.value
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        })
    }
}
function radioGroupInit(PraseLayerNameResult, componentConfigInfo) {
    if (PraseLayerNameResult.components.length != 0) {
        // 存在组件开始遍历组件
        PraseLayerNameResult.components.forEach(component => {
            componentConfigInfo.parameters.forEach(parameter=>{
                if(parameter.name== component){
                    // 这个组件被选中了
                    const radio = document.getElementById("radioGroup_" + componentConfigInfo.name + "radio_" + parameter.name)
                    radio.setAttribute("checked")
                }
            })
        })
        return
    }

}

module.exports = { generalInitComponent, generalInitParameter,radioGroupInit}
