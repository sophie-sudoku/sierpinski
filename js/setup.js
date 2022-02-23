;require._modules["/setup.js"] = (function() { var __filename = "/setup.js"; var __dirname = "/"; var module = { loaded: false, exports: { }, filename: __filename, dirname: __dirname, require: null, call: function() { module.loaded = true; module.call = function() { }; __module__(); }, parent: null, children: [ ] }; var process = { title: "browser", nextTick: function(func) { setTimeout(func, 0); } }; var require = module.require = window.require._bind(module); var exports = module.exports; 
 /* ==  Begin source for module /setup.js  == */ var __module__ = function() { 
 "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
var Setup = /** @class */ (function () {
    function Setup() {
    }
    Setup.prototype.createScene = function () {
        var engine;
        var canvas;
        canvas = document.getElementById('webglCanvas');
        engine = new BABYLON.Engine(canvas, true);
        engine.enableOfflineSupport = false;
        return new BABYLON.Scene(engine);
    };
    Setup.prototype.addCamera = function (scene) {
        var camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2.5, Math.PI / 2, 5, new BABYLON.Vector3(0, 0.5, 0), scene);
        camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
        return camera;
    };
    Setup.prototype.addDefaultLights = function (scene) {
        new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);
        new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), scene);
    };
    Setup.prototype.addTestObject = function (scene) {
        return BABYLON.MeshBuilder.CreateBox('box', { height: 5 }, scene);
    };
    Setup.prototype.startEngine = function (scene) {
        window.addEventListener("resize", function () {
            scene.getEngine().resize();
        });
        scene.getEngine().runRenderLoop(function () {
            //(scene.activeCamera as ArcRotateCamera).alpha = (scene.activeCamera as ArcRotateCamera).alpha + 0.001;
            scene.render();
        });
    };
    return Setup;
}());
exports.Setup = Setup;
//# sourceMappingURL=setup.js.map
 
 }; /* ==  End source for module /setup.js  == */ return module; }());;