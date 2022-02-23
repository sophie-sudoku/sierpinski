;require._modules["/sierpinski.js"] = (function() { var __filename = "/sierpinski.js"; var __dirname = "/"; var module = { loaded: false, exports: { }, filename: __filename, dirname: __dirname, require: null, call: function() { module.loaded = true; module.call = function() { }; __module__(); }, parent: null, children: [ ] }; var process = { title: "browser", nextTick: function(func) { setTimeout(func, 0); } }; var require = module.require = window.require._bind(module); var exports = module.exports; 
 /* ==  Begin source for module /sierpinski.js  == */ var __module__ = function() { 
 "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sierpinski = exports.Action = exports.Division = exports.Plane = void 0;
var Plane;
(function (Plane) {
    Plane[Plane["XY"] = 0] = "XY";
    Plane[Plane["XZ"] = 1] = "XZ";
    Plane[Plane["YZ"] = 2] = "YZ";
})(Plane = exports.Plane || (exports.Plane = {}));
var Division;
(function (Division) {
    Division[Division["LEFT"] = 0] = "LEFT";
    Division[Division["TOP"] = 1] = "TOP";
    Division[Division["RIGHT"] = 2] = "RIGHT";
    Division[Division["MIDDLE"] = 3] = "MIDDLE";
})(Division = exports.Division || (exports.Division = {}));
var Action;
(function (Action) {
    Action[Action["PLAY"] = 0] = "PLAY";
    Action[Action["STOP"] = 1] = "STOP";
    Action[Action["PAUSE"] = 2] = "PAUSE";
    Action[Action["REVERSE"] = 3] = "REVERSE";
})(Action = exports.Action || (exports.Action = {}));
var Sierpinski = /** @class */ (function () {
    function Sierpinski(scene) {
        this._maxIterations = 3;
        this._speed = 2500;
        this._scene = scene;
        this.createGUI();
        // this._color1 = Color3.Random();
        // this._color2 = Color3.Random();
        // this._color3 = Color3.Random();
        // set RGB for tetraedron sides instead of random colors:
        this._color1 = new BABYLON.Color3(1, 0, 0);
        this._color2 = new BABYLON.Color3(0, 1, 0);
        this._color3 = new BABYLON.Color3(0, 0, 1);
        this.createInitialTetraedron();
    }
    Object.defineProperty(Sierpinski.prototype, "maxIterations", {
        set: function (maxIterations) {
            this._maxIterations = maxIterations;
        },
        enumerable: false,
        configurable: true
    });
    Sierpinski.prototype.createInitialTetraedron = function () {
        this.clearScene();
        this.createInitialTriangle();
        var p = new BABYLON.Vector3(-1, 0, 0);
        var q = new BABYLON.Vector3(1, 0, 0);
        var s = this.rotateAroundPoint(p, q, 60 * Math.PI / 180, Plane.XZ);
        var height = Math.sqrt(6) * 2 / 3;
        var top = new BABYLON.Vector3(0, height, this.getCenterPointInTriangle(p, q, s).z);
        this.createInitialInstancedTriangle(p, q, top);
        this.createInitialInstancedTriangle(q, s, top);
        this.createInitialInstancedTriangle(s, p, top);
    };
    Sierpinski.prototype.clearScene = function () {
        if (this._triangleDevided) {
            this._triangleDevided.forEach(function (triangle) {
                triangle.dispose();
            });
        }
        this._triangleDevided = [];
        this._scene.meshes = [];
    };
    Sierpinski.prototype.createInitialTriangle = function () {
        var p1 = new BABYLON.Vector3(-0.5, 0, 0);
        var p2 = new BABYLON.Vector3(0.5, 0, 0);
        var s = this.rotateAroundPoint(p1, p2, 60 * Math.PI / 180, Plane.XZ);
        var height = Math.sqrt(6) / 3;
        var p3 = new BABYLON.Vector3(0, height, this.getCenterPointInTriangle(p1, p2, s).z);
        this._godMesh = new BABYLON.Mesh('triangle', this._scene);
        var vertexData = new BABYLON.VertexData();
        var positions = [
            p1.x,
            p1.y,
            p1.z,
            p2.x,
            p2.y,
            p2.z,
            p3.x,
            p3.y,
            p3.z,
        ];
        var indices = [0, 1, 2];
        var normals = [];
        BABYLON.VertexData.ComputeNormals(positions, indices, normals);
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;
        vertexData.applyToMesh(this._godMesh);
        var mat = new BABYLON.StandardMaterial('mat', this._scene);
        var direction = (p3.subtract(p1).cross(p2.subtract(p1))).normalize().x;
        var directionRounded = Math.round(direction * 100) / 100;
        if (directionRounded === 0.0) {
            mat.diffuseColor = this._color1;
        }
        else if (directionRounded > 0.0) {
            mat.diffuseColor = this._color2;
        }
        else {
            mat.diffuseColor = this._color3;
        }
        mat.backFaceCulling = false;
        mat.emissiveColor = BABYLON.Color3.White();
        this._godMesh.material = mat;
        this._godMesh.registerInstancedBuffer("color", 3);
        this._godMesh.instancedBuffers.color = this._color2;
        this._godMesh.setPivotPoint(p3);
        this._godMesh.isVisible = false;
    };
    /**
     * Merge triangles together
     */
    Sierpinski.prototype.reverse = function (firstAnimation) {
        if (this._action !== Action.REVERSE) {
            return;
        }
        if (this._scene.getMeshesByTags('instance').length <= 3) {
            return;
        }
        var that = this;
        setTimeout(function () {
            if (that._action !== Action.REVERSE) {
                return;
            }
            if (that._ready) {
                setTimeout(function() {
                    that._ready = false;
                    var iteration = Math.ceil(Math.log((that._scene.getMeshesByTags('instance').length) / 3) / Math.log(4));
                    that.createInitialTetraedron();
                    if (firstAnimation) {
                        for (var i = 1; i <= iteration; i++) {
                            var triangleBase = that._triangleDevided;
                            that._triangleDevided = [];
                            triangleBase.forEach(function (triangle) {
                                that.divideTriangle(triangle, i == iteration, true, i);
                            });
                        }
                    }
                    else {
                        for (var i = 1; i < iteration; i++) {
                            var triangleBase = that._triangleDevided;
                            that._triangleDevided = [];
                            triangleBase.forEach(function (triangle) {
                                that.divideTriangle(triangle, (i+1) == iteration, true, i);
                            });
                        }
                    }
                    that.reverse(false);
                }, 200);
            } else {
                that.reverse(firstAnimation);
            }
        }, 100);
    };
    /**
     * Separate triangles
     */
    Sierpinski.prototype.play = function () {
        if (this._action !== Action.PLAY) {
            return;
        }
        var iteration = Math.ceil(Math.log((this._scene.getMeshesByTags('instance').length) / 3) / Math.log(4));
        if (iteration >= this._maxIterations) {
            return;
        }
        var that = this;
        setTimeout(function () {
            if (that._action !== Action.PLAY) {
                return;
            }
            if (that._ready) {
                setTimeout(function() {
                    that._ready = false;
                    var triangleBase = that._triangleDevided;
                    that._triangleDevided = [];
                    var iteration = Math.ceil(Math.log((that._scene.getMeshesByTags('instance').length) / 3) / Math.log(4));
                    // that.divideTriangle(that._scene.meshes[3] as InstancedMesh, true);
                    triangleBase.forEach(function (triangle) {
                        that.divideTriangle(triangle, true, false, iteration);
                    });
                    that.play();
                }, 200);
            } else {
                that.play();
            }
        }, 100);
    };
    Sierpinski.prototype.stop = function () {
        this._action = Action.STOP;
        this.createInitialTetraedron();
    };
    Sierpinski.prototype.createInitialInstancedTriangle = function (p1, p2, p3) {
        var newInstance = this._godMesh.createInstance("i");
        var translationMatrix = BABYLON.Matrix.Identity();
        var pivot = this._godMesh.getPivotPoint();
        translationMatrix.setTranslationFromFloats(-pivot.x, -pivot.y, -pivot.z);
        newInstance.setPivotMatrix(translationMatrix, false);
        newInstance.isVisible = true;
        BABYLON.Tags.EnableFor(newInstance);
        BABYLON.Tags.AddTagsTo(newInstance, "instance");
        newInstance.position = p3;
        var scale = BABYLON.Vector3.Distance(p1, p2);
        scale = scale * newInstance.scaling.x;
        newInstance.scaling = new BABYLON.Vector3(scale, scale, scale);
        var angle = BABYLON.Angle.BetweenTwoPoints(new BABYLON.Vector2(p1.x, p1.z), new BABYLON.Vector2(p2.x, p2.z));
        newInstance.rotation.y = -angle.radians();
        newInstance.metadata = {};
        newInstance.metadata['left'] = p1;
        newInstance.metadata['right'] = p2;
        newInstance.metadata['top'] = p3;
        this.assignColor(p1, p2, p3, newInstance);
        this._triangleDevided.push(newInstance);
        return newInstance;
    };
    Sierpinski.prototype.createInstancedTriangle = function (division, triangle, animation, reverse, iteration) {
        var newInstance = this._godMesh.createInstance("i");
        var translationMatrix = BABYLON.Matrix.Identity();
        var pivot = this._godMesh.getPivotPoint();
        translationMatrix.setTranslationFromFloats(-pivot.x, -pivot.y, -pivot.z);
        newInstance.setPivotMatrix(translationMatrix, false);
        newInstance.isVisible = true;
        BABYLON.Tags.EnableFor(newInstance);
        BABYLON.Tags.AddTagsTo(newInstance, "instance");
        var scale = triangle.scaling.x * 0.5;
        newInstance.scaling = new BABYLON.Vector3(scale, scale, scale);
        var top = triangle.metadata['top'];
        var left = triangle.metadata['left'];
        var right = triangle.metadata['right'];
        newInstance.metadata = {};
        if (division === Division.LEFT) {
            newInstance.position = this.getCenterPointOnLine(top, left);
            newInstance.metadata['top'] = this.getCenterPointOnLine(top, left);
            newInstance.metadata['left'] = left;
            newInstance.metadata['right'] = this.getCenterPointOnLine(left, right);
        }
        else if (division === Division.TOP) {
            newInstance.position = top;
            newInstance.metadata['top'] = top;
            newInstance.metadata['left'] = this.getCenterPointOnLine(top, left);
            newInstance.metadata['right'] = this.getCenterPointOnLine(top, right);
        }
        else if (division === Division.RIGHT) {
            newInstance.position = this.getCenterPointOnLine(top, right);
            newInstance.metadata['top'] = this.getCenterPointOnLine(top, right);
            newInstance.metadata['left'] = this.getCenterPointOnLine(left, right);
            newInstance.metadata['right'] = right;
        }
        else {
            newInstance.position = this.getCenterPointOnLine(top, left);
            var axis = this.getCenterPointOnLine(left, right).subtract(this.getCenterPointOnLine(top, left));
            newInstance.rotation.y = triangle.rotation.y;
            newInstance.rotationQuaternion = triangle.rotationQuaternion ? triangle.rotationQuaternion.clone() : null;
            newInstance.rotate(axis, 180 * Math.PI / 180, BABYLON.Space.WORLD);
            newInstance.metadata['top'] = this.getCenterPointOnLine(top, left);
            newInstance.metadata['left'] = this.getCenterPointOnLine(left, right);
            var s = this.rotateAroundPoint(left, this.getCenterPointOnLine(left, right), 60 * Math.PI / 180, Plane.XZ);
            newInstance.metadata['right'] = s;
            if (this._scene.getEngine().getFps() <= 40 || iteration >= 5) {
		if (!reverse) {
                    newInstance.rotate(axis, 107.5 * Math.PI / 180, BABYLON.Space.WORLD);
		}
		if (animation) {
		    this._ready = true;
		}
            }
            else {
                if (animation) {
		    if (reverse) {
                        newInstance.rotate(axis, 108 * Math.PI / 180, BABYLON.Space.WORLD);
                        this.animateRotation(newInstance, axis, 107, true, iteration);
                    } else {
                        this.animateRotation(newInstance, axis, 108, false, iteration);
                    }
                } else {
                    newInstance.rotate(axis, 107.5 * Math.PI / 180, BABYLON.Space.WORLD);
		}
            }
        }
        if (division !== Division.MIDDLE) {
            newInstance.rotation = triangle.rotation.clone();
            newInstance.rotationQuaternion = triangle.rotationQuaternion ? triangle.rotationQuaternion.clone() : null;
            this.assignColor(newInstance.metadata['left'], newInstance.metadata['right'], newInstance.metadata['top'], newInstance);
        }
        else if (iteration > 3) {
            this.assignColor(newInstance.metadata['left'], newInstance.metadata['right'], newInstance.metadata['top'], newInstance);
        }
        this._triangleDevided.push(newInstance);
    };
    Sierpinski.prototype.animateRotation = function (triangle, axis, iterations, reverse, iteration) {
        var that = this;
        setTimeout(function () {
            var transformNode = new BABYLON.TransformNode("child", this._scene);
            var parentNode = new BABYLON.TransformNode("parent", this._scene);
            parentNode.position = triangle.metadata['left'];
            transformNode.parent = parentNode;
            transformNode.setAbsolutePosition(triangle.metadata['right']);
            if (reverse) {
                triangle.rotate(axis, -1 * Math.PI / 180, BABYLON.Space.WORLD);
                parentNode.rotate(axis, -(107 - iterations) * Math.PI / 180, BABYLON.Space.WORLD);
            }
            else {
                triangle.rotate(axis, 1 * Math.PI / 180, BABYLON.Space.WORLD);
                parentNode.rotate(axis, -iterations * Math.PI / 180, BABYLON.Space.WORLD);
            }
            that._scene.incrementRenderId();
            parentNode.computeWorldMatrix(true);
            if (iteration < 4) {
                that.assignColor(triangle.metadata['left'], transformNode.getAbsolutePosition(), triangle.metadata['top'], triangle);
            }
            parentNode.dispose();
            transformNode.dispose();
            if (iterations > 0) {
                that.animateRotation(triangle, axis, iterations - 1, reverse, iteration);
            } else {
                that._ready = true;
            }
        }, this._speed / (3 * 120));
    };
    Sierpinski.prototype.assignColor = function (p1, p2, p3, customMesh) {
        var direction = (p3.subtract(p1).cross(p2.subtract(p1))).normalize().x;
        var directionRounded = Math.round(direction * 100) / 100;
        if (directionRounded === 0.0) {
            customMesh.instancedBuffers.color = this._color1;
        }
        else if (directionRounded > 0.0) {
            customMesh.instancedBuffers.color = BABYLON.Color3.Lerp(this._color1, this._color2, directionRounded / 0.82);
        }
        else {
            customMesh.instancedBuffers.color = BABYLON.Color3.Lerp(this._color1, this._color3, directionRounded / -0.82);
        }
    };
    Sierpinski.prototype.divideTriangle = function (triangle, animation, reverse, iteration) {
        this.createInstancedTriangle(Division.LEFT, triangle, animation, reverse, iteration);
        this.createInstancedTriangle(Division.RIGHT, triangle, animation, reverse, iteration);
        this.createInstancedTriangle(Division.TOP, triangle, animation, reverse, iteration);
        this.createInstancedTriangle(Division.MIDDLE, triangle, animation, reverse, iteration);
        triangle.dispose();
    };
    Sierpinski.prototype.calcDistance = function (p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) +
            Math.pow(p1.y - p2.y, 2) +
            Math.pow(p1.z - p2.z, 2));
    };
    Sierpinski.prototype.getCenterPointOnLine = function (vector1, vector2) {
        return new BABYLON.Vector3((vector2.x + vector1.x) / 2, (vector2.y + vector1.y) / 2, (vector2.z + vector1.z) / 2);
    };
    Sierpinski.prototype.getCenterPointInTriangle = function (vector1, vector2, vector3) {
        return new BABYLON.Vector3((vector1.x + vector2.x + vector3.x) / 3, (vector1.y + vector2.y + vector3.y) / 3, (vector1.z + vector2.z + vector3.z) / 3);
    };
    Sierpinski.prototype.rotateAroundPoint = function (pivot, point, angle, plane) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        var newVector = point.subtract(pivot);
        if (plane === Plane.XY) {
            var x = newVector.x * c - newVector.y * s;
            var y = newVector.x * s + newVector.y * c;
            newVector.x = x;
            newVector.y = y;
        }
        else if (plane === Plane.XZ) {
            var x = newVector.x * c - newVector.z * s;
            var z = newVector.x * s + newVector.z * c;
            newVector.x = x;
            newVector.z = z;
        }
        else {
            var y = newVector.y * c - newVector.z * s;
            var z = newVector.y * s + newVector.z * c;
            newVector.y = y;
            newVector.z = z;
        }
        newVector = newVector.add(pivot);
        return newVector;
    };
    Sierpinski.prototype.createGUI = function () {
        var that = this;
        this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = 'Iterations: ';
        text1.color = 'white';
        text1.top = '50px';
        text1.left = '50px';
        text1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        text1.fontSize = 24;
        this._advancedTexture.addControl(text1);
        var input = new BABYLON.GUI.InputText();
        input.width = 0.2;
        input.maxWidth = 0.2;
        input.height = '40px';
        input.text = '';
        input.color = 'white';
        input.background = 'gray';
        input.top = '50px';
        input.left = '170px';
        input.text = '3';
        input.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        input.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        input.onPointerEnterObservable.add(function () {
            if (isNaN(Number(input.text)) || input.text === '') {
                input.text = '3';
            }
            that.maxIterations = Number(input.text);
        });
        input.onBlurObservable.add(function () {
            if (isNaN(Number(input.text)) || input.text === '') {
                input.text = '3';
            }
            that.maxIterations = Number(input.text);
        });
        this._advancedTexture.addControl(input);
        var text2 = new BABYLON.GUI.TextBlock();
        text2.text = 'Speed: ';
        text2.color = 'white';
        text2.top = '100px';
        text2.left = '50px';
        text2.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        text2.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        text2.fontSize = 24;
        this._advancedTexture.addControl(text2);
        var slider = new BABYLON.GUI.Slider();
        slider.minimum = 0;
        slider.maximum = 1;
        slider.value = 0.5;
        slider.height = '20px';
        slider.width = '200px';
        slider.top = '100px';
        slider.left = '170px';
        slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        slider.onValueChangedObservable.add(function () {
            that._speed = (1 - slider.value) * 5000;
        });
        this._advancedTexture.addControl(slider);
	var playImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAIJSURBVFhH7ZhNqwFRGMfPRbHyCSgrLLysLG2QhU+gvHwAW59AWVA2tja2WMha7CwtlJRsyEYpUiKJnjtz7jMn9+btmrezmF9N0zn/Wfw603nmmfMFAoRjTHjnFkNQLk8Ft9stKZfLONIJcZM8QhAUNxC9Op0OzmrLU8Hdbgd2u51JBoNBmEwmmGrDS0GLxQLpdBqKxSITzWazcDgc8Cl1eSloMpkgk8nQ8Xw+h0gkwkQbjQadV5O3BFOpFM780O/3wWw2U0m32w3j8RgT5fmozAirSC6XC6lUKmQ2mxG/308SiQQ5nU74hIKg6F0ereAt+/0ekskke+1CWcJEGWQLSgyHQ/B6vVTS4XBAt9vFRB6KCUpUq1W2mrFYDNbrNSafobighFiKJNFCoYCz/0c1QZHVagWhUIiJtlotTN5HVUGJdrvNvkiBQABGoxEmr9FEUOR8PkM+n2ermcvl4Hg8YvoYzQQllsslhMNhKmm1WqFWq2FyH80FJXq9HjidTirqcrlgMBhg8hvuG1ZdX7HNZoN6vY7JfYxNIsJtmeG6UHP7qbttFuLxOD/Nwt92S6xzSiBbkOuGVWj5mZjQ8oPQ8mOiHB8J3v40eTwe/X+aBEl6XywWJBqN0ut6vZJms0mm0ynx+Xw0VwUUvYu4gtz/uHN99MH94dFms4FSqYQjfTDOqOViCMqDkG/8LBvoZG9pnQAAAABJRU5ErkJggg==';
        var play = BABYLON.GUI.Button.CreateImageOnlyButton("play", playImage);
        play.width = "40px";
        play.height = "40px";
        play.top = '150px';
        play.left = '50px';
        play.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        play.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        play.onPointerClickObservable.add(function () {
            that._action = Action.PLAY;
            that._ready = true;
            that.play();
        });
        this._advancedTexture.addControl(play);
	var reverseImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAANNSURBVFhH7ZhLSGpBGID/I9JT6IG7IgsRyoUQ0SYiWkRCtAl6iKQVuSiIdtUmsEXboFZBu1q1CspdGOHWTUVQBLXQ6EESFD1UpObO/zuekrK693rPmcX94Kjzz/HM5zhz5j8D7Atubm5YWVkZm56eFhHtMUAOIpEIVFdXw/39PXR1dYmoDgjRLC4vL1lhYSHD6kAgIKL68EHw+fmZxPDY2toSUf3IEkQ5g8FAcsFgUET1RRW8urpSe25vb09E9YcE+YRgxcXFJBcKhahCFpRYLMbq6urg8fER1tbWwOPx0MzNJ7wd4EMH+MSj47cwm83Uczj28J6H74qi5P0wGo2ssrKS2e12NjAwwLa3t9Nd9A2Ky+Vi6+vrUFJSAqOjo/Dw8AAvLy9p+zzBBSGVSsHt7S0cHh4CH++iBsDv98Pc3JwofQJa9vf3Uy8ODQ2RtRZsbm6yxsZGdWLu7OyImmzUWczHHp3Y3d0tItqwu7vLKioqqO2FhQURfUMVRLxeL52I71qSTCZZS0sLtb24uCiiabIEkczfPTw8LCLaUV9fT22/XyQ+CCIdHR10opZjMgO2W1RUxF5fX9Nlev2Evr4+OlnrMYmTBdudnJykck5BJDNxpqamREQbmpqaqF3kS0FkdnY25y3gX4G3IBTEVE/BAC9IBS615eXlMDY2BlIKIg6Hg1a0nCm/3lgsFjg5OZFXkCcucvcgpn+YZEgreHFxAbW1tXIKxuNxODo6gubmZjkF9/f3gT/AQU9Pj7hdS4bT6aQbdSKR+H4l0ZqDgwOS6+3tpbJ0gjabjQTPz8+pLJXg4OAgyb1PWqURHBkZIbnx8XERSaO7YDQaVdMrn88nom/oJoi7GTxbITE85ufnRU02yvLyMj5MQ1tbG2xsbACf2uB2uyEUCsHp6Sk9K5+dnVHdxMQErY+rq6vA03J+3Z+BSxZvC+7u7ui5OBwOw/HxMdW1trbCysoKNDQ0UPkzWGdnJ9mWlpbSr0Ha29vpM+54LS0t0WcuzPiF1V/9pwfuMMzMzND1vkPBrjaZTMC/BNfX19RDVVVVtAvw9PQENTU1tPTg2mi1Wqkn+LgBo9HI2/o5uDdjNpuhoKBARH6GtAlrBmmzmQz/Bf8OgF97EZZXoCVL1QAAAABJRU5ErkJggg==';
        var reverse = BABYLON.GUI.Button.CreateImageOnlyButton("reverse", reverseImage);
        reverse.width = "40px";
        reverse.height = "40px";
        reverse.top = '150px';
        reverse.left = '100px';
        reverse.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        reverse.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        reverse.onPointerClickObservable.add(function () {
            that._action = Action.REVERSE;
            that.reverse(true);
        });
        this._advancedTexture.addControl(reverse);
	var pauseImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAFuSURBVFhH7ZhLisJQFEQr8YMIomaQfTjP0D24ARfgUhyLS3GYefbhIJoIQfwQU6/z6NANbZ53Epp7QG4o65YlfuDFKyvQYfx6dhYtKEULSmn1K47jGNvtFqPRCE2753l4PB5YLpdYr9e1+sV+v8fhcEC/3/+1c71esdlsEEVRrf4BC75jt9vxFcoqvOz1eqXv++ZRvbjRV6tV7fyGGp+jx/q5ywzqzGxDq494MBiYmSQJ8jxHmqY4n884Ho9GHw6HZjaxGj30coe7zCA28x1O38EgCDAejzGdTjGZTDCfz41evVEzm1iNHnq5w11muOBU8Pl81lef45qhfzNStKAULShFC0rRglK0oBQtKEULStGCUv5XwerYWF99jmuGU0EeHYuiQJZluFwuOJ1ORudh/CdWo4de7nCXGS60Kni/381cLBbmCMmj42w2QxiGRr/dbmY2sRo99HKHu8wgNvMdnb/1oXdYpWhBKVpQBvAClqADyIbiRBwAAAAASUVORK5CYII=';
        var pause = BABYLON.GUI.Button.CreateImageOnlyButton("pause", pauseImage);
        pause.width = "40px";
        pause.height = "40px";
        pause.top = '150px';
        pause.left = '150px';
        pause.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        pause.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        pause.onPointerClickObservable.add(function () {
            that._action = Action.PAUSE;
        });
        this._advancedTexture.addControl(pause);
	var stopImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAD0SURBVFhH7ZjBCYQwEEV/onamNXjwall2orXYgYLoTcV1JKfdzSr8CC7Mg2AQ+fNEIsyYbQcPxrrrY1FBFhVk8Z7iqqpQ1zWSJMFdB90Yg3mekWUZyrJ0d98QwW/keS5Wm7X21iU1pJYP7yeO4xh7ANq2xTAM6Ps+6JJMyZYaUsuLE/2gKIrjDcdxdHfCI9lSQ2r5OD0k67q6XXiuZOtvhkUFWVSQRQVZVJBFBVlUkEUFWVSQ5f8Foyhyu/BcyT4V7LoO0zQdbWLIJZmSfYrr7j54SuP+c/TRNM3RVHseoZHRx7IsSNPUO/rQCSuLCrKoIAfwAgjQ5ryQudr5AAAAAElFTkSuQmCC';
        var stop = BABYLON.GUI.Button.CreateImageOnlyButton("stop", stopImage);
        stop.width = "40px";
        stop.height = "40px";
        stop.top = '150px';
        stop.left = '200px';
        stop.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        stop.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        stop.onPointerClickObservable.add(function () {
            that._action = Action.STOP;
            that.stop();
        });
        this._advancedTexture.addControl(stop);
    };
    return Sierpinski;
}());
exports.Sierpinski = Sierpinski;
//# sourceMappingURL=sierpinski.js.map
 
 }; /* ==  End source for module /sierpinski.js  == */ return module; }());;