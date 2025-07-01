const batchPlay=require("photoshop").action.batchPlay; 

function getLayerInfo(layerId) {
	const res = batchPlay(
		[
			{
				_obj: 'get',
				_target: [
					{_ref: "layer", _id: layerId},
					{_ref: "document",_id: require('photoshop').app.activeDocument.id}
				]
			}
		],
		{ synchronousExecution: true }
	)[0];
    return res;
}

module.exports={getLayerInfo};