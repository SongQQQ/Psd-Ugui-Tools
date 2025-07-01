const { getLayerFullInfo } = require("./layer.js");
const { getActiveLayer } = require("./Layer/getActiveLayer.js");

const outputListen = require("./output/output.js").listen
const loadComponent = require("./GeneralHandle/laodComponent.js").loadComponent

function loadPage(id) {
    // 隐藏所有视图
    document.querySelectorAll('.view').forEach(div => {
        div.style.display = 'none';
        div.classList.remove('active');
        
        // 清理动态生成的内容，保留原始HTML结构
        const dynamicContent = div.querySelector('.dynamic-content');
        if (dynamicContent) {
            dynamicContent.innerHTML = '';
        }
    });
    
    // 显示目标视图
    const targetView = document.getElementById(id);
    if (targetView) {
        targetView.style.display = 'block';
        targetView.classList.add('active');
        
        // 确保有动态内容容器
        if (!targetView.querySelector('.dynamic-content')) {
            const dynamicContainer = document.createElement('div');
            dynamicContainer.className = 'dynamic-content';
            targetView.appendChild(dynamicContainer);
        }
    }
    console.log("loadPage", id);
    switch (id) {
        case "output":
            // 输出页面的内容已经在HTML中定义，只需要绑定事件
            outputListen();
            break;
            
        case "index":
            // 首页内容已经在HTML中定义
            updateStatusIndicator("等待图层选择...", "waiting");
            break;
            
        default:
            // 处理其他图层类型页面
            try {
                const activeLayer = getActiveLayer();
                const layerName = activeLayer.name;
                updateStatusIndicator(`已选择图层: ${layerName}`, "active");
                // 清理之前的组件内容
                const dynamicContent = targetView.querySelector('.dynamic-content');
                if (dynamicContent) {
                    dynamicContent.innerHTML = '';
                }
                
                //loadComponent(id, layerName);
            } catch (error) {
                console.warn("获取图层信息失败:", error);
                updateStatusIndicator("获取图层信息失败", "error");
            }
            break;
    }
}

// 更新状态指示器
function updateStatusIndicator(text, status = "waiting") {
    const statusText = document.querySelector('.status-text');
    const statusDot = document.querySelector('.status-dot');
    
    if (statusText) {
        statusText.textContent = text;
    }
    
    if (statusDot) {
        statusDot.className = 'status-dot';
        switch (status) {
            case "active":
                statusDot.style.background = "#28a745";
                break;
            case "error":
                statusDot.style.background = "#dc3545";
                break;
            default:
                statusDot.style.background = "#ffc107";
        }
    }
}

module.exports = {
    loadPage,
    updateStatusIndicator
}