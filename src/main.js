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
