const addComponent = require("../Tag/addComponent").addComponent
const updateParameter = require("../Tag/updateParameter.js").updateParameter
const deleteComponent = require("../Tag/deleteComponent").deleteComponent
const getActiveLayer = require("../Layer/getActiveLayer.js").getActiveLayer
const renameLayer = require("../Layer/renameLayer.js").renameLayer


function generalComponentCallback(newElement, configInfo) {
    switch (newElement.type) {
        case "checkbox":
            checkboxComponentCallback(newElement, configInfo)
            break
    }
}

function generalParameterCallback(componentElement, newElement, ParameterConfigInfo) {
    switch (newElement.type) {
        case "text":
            textParameterCallback(componentElement, newElement, ParameterConfigInfo)
            break;
        case "number":
            numberParameterCallback(componentElement, newElement, ParameterConfigInfo)
            break;
    }
}

function textParameterCallback(componentElement, newElement, ParameterConfigInfo) {
    newElement.addEventListener("input", function () {
        let layer = getActiveLayer()
        if (layer != null) {
            let newName = updateParameter(layer.name, componentElement.name, ParameterConfigInfo.name, newElement.value)
            renameLayer(layer, newName)
        }
    });
}
function numberParameterCallback(componentElement, newElement, ParameterConfigInfo) {
    newElement.addEventListener("input", function () {
        let layer = getActiveLayer()
        if (layer!= null) {
            let newName = updateParameter(layer.name, componentElement.name, ParameterConfigInfo.name, newElement.value)
            renameLayer(layer, newName)
        }
    }); 
}

function checkboxComponentCallback(newElement, configInfo) {
    newElement.addEventListener("change", function () {
        let layer = getActiveLayer()
        if (layer != null) {
            if (this.checked) {
                let newName = addComponent(layer.name, configInfo.name)

                for (let i = 0; i < configInfo.parameters.length; i++) {
                    newName = autoFillParameterDefaultValue(newName, configInfo.name, configInfo.parameters[i])
                }
                renameLayer(layer, newName)

            } else {
                let newName = deleteComponent(layer.name, configInfo.name)
                renameLayer(layer, newName)
            }
        }
        console.log("change")
    });
}

// 自动填充组件参数的默认值
function autoFillParameterDefaultValue(oldName, componentName, parameterConfigInfo) {
    console.log("parameter config info", parameterConfigInfo)
    const newElement = document.getElementById("parameter_" + parameterConfigInfo.name)
    console.log("parameter element", newElement)
    let newName = updateParameter(oldName, componentName, parameterConfigInfo.name, parameterConfigInfo.default)
    return newName

}

function radioGroupCallback(radioGroupElement) {
    radioGroupElement.addEventListener("change", handleRadioChange);
    function handleRadioChange(event) {
        const selectedValue = event.target.value;
        const allValues = getAllRadioValues(radioGroupElement);
        const isCancel = selectedValue === "AutoUICancel";
        updateRadioSelection(radioGroupElement, allValues, selectedValue, isCancel);
        const layer = getActiveLayer();
        const updatedLayerName = updateLayerName(layer.name, allValues, selectedValue, isCancel);
        renameLayer(layer, updatedLayerName);
    }
    function getAllRadioValues(groupElement) {
        return Array.from(groupElement.querySelectorAll("sp-radio"))
            .map(el => el.value);
    }
    function updateRadioSelection(groupElement, values, selected, isCancel) {
        values.forEach(value => {
            const radio = document.getElementById(`${groupElement.id}radio_${value}`);
            if (radio) {
                if (isCancel || value !== selected) {
                    radio.removeAttribute("checked");
                }
            }
        });
    }
    function updateLayerName(originalName, allValues, selected, isCancel) {
        let newName = originalName;
        // 移除所有组件
        allValues.forEach(value => {
            newName = deleteComponent(newName, value);
        });
        // 添加选中的组件（如果不是取消）
        if (!isCancel) {
            newName = addComponent(newName, selected);
        }
        return newName;
    }
}


module.exports = { generalComponentCallback, generalParameterCallback, radioGroupCallback }