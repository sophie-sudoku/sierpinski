;require._modules["/main.js"] = (function() { var __filename = "/main.js"; var __dirname = "/"; var module = { loaded: false, exports: { }, filename: __filename, dirname: __dirname, require: null, call: function() { module.loaded = true; module.call = function() { }; __module__(); }, parent: null, children: [ ] }; var process = { title: "browser", nextTick: function(func) { setTimeout(func, 0); } }; var require = module.require = window.require._bind(module); var exports = module.exports; 
 /* ==  Begin source for module /main.js  == */ var __module__ = function() { 
 var setup_1 = require("/setup");
var sierpinski_1 = require("/sierpinski");
exports.doit = function() {
        var setup = new setup_1.Setup();
        var scene = setup.createScene();
        setup.addCamera(scene);
        setup.addDefaultLights(scene);
        setup.startEngine(scene);
        var sierpinski = new sierpinski_1.Sierpinski(scene);
    };
 
 }; /* ==  End source for module /main.js  == */ return module; }());;