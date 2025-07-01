const executeAsModal = require("photoshop").core.executeAsModal


function renameLayer(layer, newName) {
    executeAsModal(function () {
        if (layer != null) {
            layer.name = newName;
        }
    }, { "showDialog": false });
}

module.exports = {
    renameLayer
}