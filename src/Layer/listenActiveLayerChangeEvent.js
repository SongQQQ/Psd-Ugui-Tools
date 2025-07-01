const {action}= require("photoshop");

function listenActiveLayerChangeEvent(callback){
    function OnActiveLayerChange(){
        callback();
    }
    action.addNotificationListener(["select"],OnActiveLayerChange);
    console.log("监听图层激活事件");
    // 返回移除监听的函数
    return function removeListener() {
        action.removeNotificationListener(["select"], OnActiveLayerChange);
        console.log("移除图层激活事件监听");
    }
}
module.exports={listenActiveLayerChangeEvent};