"use strict";
/**
 * Mock implementations for the [NGL](https://github.com/arose/ngl) library.
 *
 * Our NGLComponent is, understandably, pretty coupled to the library so this is an attempt to mock the behaviors.
 *
 * Ideally it would be most beneficial if as much of the original ngl / automocked version could be used.
 * As of this writing, it is not 100% clear to me on how best to approach selectively mocking several
 * classes/methods of the 3rd party library while retaining most of the original functionality.
 *
 * https://facebook.github.io/jest/docs/en/manual-mocks.html
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var three_1 = require("three");
var ngl = jest.genMockFromModule('ngl');
var MockStage = /** @class */ (function () {
    function MockStage(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.compList = new Array();
        this.events = new Map();
        this.callbacks = new Array();
        this.tooltip = { textContent: '' };
        this.keyBehavior = {
            domElement: this.canvas,
        };
        this.mouseControls = {
            actionList: new Array(),
            add: function (eventName, callback) { return _this.events.set(eventName, callback); },
            remove: function (eventName, callback) { return _this.events.delete(eventName); },
            run: function (eventName) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var cb = _this.events.get(eventName);
                if (cb !== undefined) {
                    cb.apply(void 0, tslib_1.__spread(args));
                }
            },
        };
        this.mouseObserver = {
            canvasPosition: {
                distanceTo: jest.fn(function (pos) { return pos; }),
            },
            down: {
                distanceTo: jest.fn(function (pos) { return pos; }),
            },
            position: {
                distanceTo: jest.fn(function (pos) { return pos; }),
            },
            prevClickCP: {
                distanceTo: jest.fn(function (pos) { return pos; }),
            },
            prevPosition: {
                distanceTo: jest.fn(function (pos) { return pos; }),
            },
        };
        this.parameters = {
            cameraType: 'perspective',
        };
        this.signals = {
            clicked: {
                add: function (callback) { return _this.events.set('click', callback); },
                dispatch: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var cb = _this.events.get('click');
                    if (cb !== undefined) {
                        cb.apply(void 0, tslib_1.__spread(args));
                    }
                },
            },
        };
        this.viewer = {
            renderer: {
                forceContextLoss: function () { return jest.fn(); },
            },
            requestRender: function () { return jest.fn(); },
        };
        this.viewerControls = {
            getOrientation: function () { return new three_1.Matrix4(); },
            getPositionOnCanvas: function (pos) { return pos; },
            orient: function (matrix) { return undefined; },
        };
        this.addComponentFromObject = function (structure) {
            var structureComponent = new MockStructureComponent(structure.name, {
                keyBehavior: _this.keyBehavior,
                mouseControls: _this.mouseControls,
                mouseObserver: _this.mouseObserver,
                tooltip: _this.tooltip,
                viewerControls: _this.viewerControls,
            });
            _this.compList.push(structureComponent);
            return structureComponent;
        };
        this.autoView = function () { return jest.fn(); };
        this.defaultFileRepresentation = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return jest.fn();
        };
        this.dispose = function () { return jest.fn(); };
        this.handleResize = function () { return jest.fn(); };
        this.removeAllComponents = function () { return jest.fn(); };
        this.setParameters = function (params) {
            _this.parameters = params;
        };
        return;
    }
    return MockStage;
}());
ngl.Stage = jest.fn().mockImplementation(function (canvas) {
    return new MockStage(canvas);
});
var genericResidue = function (resno, chainIndex) {
    if (chainIndex === void 0) { chainIndex = 0; }
    return ({
        chainIndex: chainIndex,
        isHelix: function () { return false; },
        isProtein: function () { return true; },
        isSheet: function () { return false; },
        isTurn: function () { return false; },
        resno: resno,
    });
};
var helixResidue = function (resno, chainIndex) {
    if (chainIndex === void 0) { chainIndex = 0; }
    return (tslib_1.__assign(tslib_1.__assign({}, genericResidue(resno, chainIndex)), { isHelix: function () { return true; }, resname: 'Histidine' }));
};
var sheetResidue = function (resno, chainIndex) {
    if (chainIndex === void 0) { chainIndex = 0; }
    return (tslib_1.__assign(tslib_1.__assign({}, genericResidue(resno, chainIndex)), { isSheet: function () { return true; }, resname: 'Glutamic Acid' }));
};
var turnResidue = function (resno, chainIndex) {
    if (chainIndex === void 0) { chainIndex = 0; }
    return (tslib_1.__assign(tslib_1.__assign({}, genericResidue(resno, chainIndex)), { isTurn: function () { return true; }, resname: 'Cysteine' }));
};
var sampleResidues = [helixResidue(1), sheetResidue(2), turnResidue(3)];
var chainResidues = tslib_1.__spread(sampleResidues, [helixResidue(1, 1), helixResidue(2, 1), helixResidue(3, 1)]);
// tslint:disable-next-line:max-classes-per-file
var MockStructureComponent = /** @class */ (function () {
    function MockStructureComponent(name, stage) {
        this.stage = stage;
        this.name = '';
        this.position = new Array();
        this.reprList = new Array();
        this.name = name;
        this.structure = new MockStructure(name);
    }
    MockStructureComponent.prototype.addRepresentation = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.reprList.push(name);
        return { name: function () { return name; }, setParameters: jest.fn() };
    };
    MockStructureComponent.prototype.autoView = function () {
        return;
    };
    MockStructureComponent.prototype.hasRepresentation = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.reprList.indexOf(name) !== -1;
    };
    MockStructureComponent.prototype.removeRepresentation = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.reprList.splice(this.reprList.indexOf(name), 1);
    };
    MockStructureComponent.prototype.removeAllRepresentations = function () {
        this.reprList = [];
    };
    MockStructureComponent.prototype.setPosition = function (position) {
        this.position = position;
    };
    MockStructureComponent.prototype.updateRepresentations = function (rep) {
        return;
    };
    return MockStructureComponent;
}());
// tslint:disable-next-line:max-classes-per-file
var MockStructure = /** @class */ (function () {
    function MockStructure(name) {
        var _this = this;
        this.name = name;
        this.atomMap = { dict: { 'CA|C': 2 } };
        this.eachResidue = jest.fn(function (cb) {
            if (_this.name.endsWith('sample.pdb')) {
                return sampleResidues.map(cb);
            }
            else if (_this.name.endsWith('chain.pdb')) {
                return chainResidues.map(cb);
            }
            return {};
        });
        this.getAtomProxy = jest.fn(function (index) { return ({
            distanceTo: function (atomProxy) { return atomProxy.index + index; },
            index: index,
            positionToVector3: function () { return index; },
        }); });
        this.getResidueProxy = jest.fn(function (resno) { return ({
            getAtomIndexByName: function () { return resno; },
        }); });
        this.getSequence = jest.fn(function () { return []; });
        this.residueMap = {
            list: [],
        };
        this.residueStore = {
            atomCount: [2, 2],
            atomOffset: [0, 2],
            // We are the priests, of the Temples of Syrinx.
            // Our great computers fill the hollowed halls.
            residueTypeId: [2, 1, 1, 2],
            resno: [1, 2],
        };
        return;
    }
    return MockStructure;
}());
ngl.Structure = jest.fn().mockImplementation(function (name) {
    return new MockStructure(name);
});
ngl.autoLoad = jest.fn(function (path) {
    return path.localeCompare('error/protein.pdb') === 0 ? Promise.reject('Invalid NGL path.') : new ngl.Structure(path);
});
module.exports = ngl;
//# sourceMappingURL=ngl.js.map