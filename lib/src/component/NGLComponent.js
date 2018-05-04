"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var NGL = require("ngl");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var ResidueContext_1 = require("../context/ResidueContext");
var ReactHelper_1 = require("../helper/ReactHelper");
exports.SUPPORTED_REPS = [
    'axes',
    'backbone',
    'ball+stick',
    'distance',
    'label',
    'line',
    'hyperball',
    'spacefill',
];
var defaultProps = __assign({ data: undefined, height: 400 }, ResidueContext_1.initialResidueContext, { padding: 0, width: 400 });
var initialState = {
    max_x: 0,
    min_x: 1000,
    nodeSize: 4,
    probabilityFilter: 0.99,
    residueOffset: 0,
    stage: undefined,
    structureComponent: undefined,
};
exports.NGLComponentWithDefaultProps = ReactHelper_1.withDefaultProps(defaultProps, /** @class */ (function (_super) {
    __extends(NGLComponentClass, _super);
    function NGLComponentClass(props) {
        var _this = _super.call(this, props) || this;
        _this.state = initialState;
        _this.canvas = null;
        _this.residueSelectionRepresentations = {};
        _this.onClick = function (pickingProxy) {
            var _a = _this.props, addCandidateResidues = _a.addCandidateResidues, addLockedResiduePair = _a.addLockedResiduePair, candidateResidues = _a.candidateResidues, removeCandidateResidues = _a.removeCandidateResidues, removeHoveredResidues = _a.removeHoveredResidues;
            var structureComponent = _this.state.structureComponent;
            if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
                var atom = pickingProxy.atom || pickingProxy.closestBondAtom;
                var resno = atom.resno + _this.state.residueOffset;
                if (candidateResidues.length >= 1) {
                    addLockedResiduePair(candidateResidues.concat([resno]));
                    removeCandidateResidues();
                }
                else {
                    addCandidateResidues([resno]);
                }
            }
            else if (structureComponent) {
                // User clicked off-structure, so clear non-locked residue state.
                _this.removeNonLockedRepresentations(structureComponent);
                removeCandidateResidues();
                removeHoveredResidues();
            }
        };
        return _this;
    }
    NGLComponentClass.prototype.componentDidMount = function () {
        if (this.canvas) {
            var stage = new NGL.Stage(this.canvas);
            this.setState({
                stage: stage,
            });
            var data = this.props.data;
            if (data) {
                this.addStructureToStage(data, stage);
            }
        }
    };
    NGLComponentClass.prototype.componentWillUnmount = function () {
        var stage = this.state.stage;
        if (stage) {
            stage.dispose();
            this.setState({
                stage: undefined,
            });
        }
    };
    NGLComponentClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _this = this;
        var _a = this.props, data = _a.data, lockedResiduePairs = _a.lockedResiduePairs;
        var _b = this.state, stage = _b.stage, structureComponent = _b.structureComponent;
        var isNewData = data && data !== prevProps.data;
        if (data && stage && isNewData) {
            stage.removeAllComponents();
            this.addStructureToStage(data, stage);
        }
        if (structureComponent && prevProps.lockedResiduePairs !== lockedResiduePairs) {
            this.removeHighlights(structureComponent, prevProps.lockedResiduePairs);
            Object.keys(lockedResiduePairs).forEach(function (key) {
                _this.highlightElement(structureComponent, lockedResiduePairs[key]);
            });
        }
        if (structureComponent && this.props.hoveredResidues !== prevProps.hoveredResidues) {
            this.removeNonLockedRepresentations(structureComponent);
            this.highlightElement(structureComponent, this.props.hoveredResidues);
        }
    };
    /**
     * Renders the NGL canvas.
     *
     * Because we are working with WebGL via the canvas, updating this visualization happens through the canvas reference.
     *
     * @returns The NGL Component
     */
    NGLComponentClass.prototype.render = function () {
        var _this = this;
        var _a = this.props, height = _a.height, padding = _a.padding, width = _a.width;
        return (React.createElement("div", { id: "NGLComponent", style: { padding: padding } },
            React.createElement("div", { ref: function (el) { return (_this.canvas = el); }, style: { height: height, width: width } }),
            React.createElement(semantic_ui_react_1.GridRow, null,
                React.createElement(semantic_ui_react_1.Button, { onClick: this.props.removeAllLockedResiduePairs }, "Remove Locked Residues"))));
    };
    /**
     * Adds a NGL structure to the stage.
     *
     * @param data A NGL Structure.
     * @param stage A NGL Stage.
     */
    NGLComponentClass.prototype.addStructureToStage = function (data, stage) {
        var _this = this;
        var structureComponent = stage.addComponentFromObject(data);
        this.setState({
            residueOffset: data.residueStore.resno[0],
            structureComponent: structureComponent,
        });
        stage.defaultFileRepresentation(structureComponent);
        structureComponent.reprList.forEach(function (rep) {
            rep.setParameters({ opacity: 1.0 });
        });
        structureComponent.stage.mouseControls.add("hoverPick" /* HOVER_PICK */, function (aStage, pickingProxy) { return _this.onHover(aStage, pickingProxy, data, structureComponent); });
        stage.signals.clicked.add(this.onClick);
    };
    NGLComponentClass.prototype.onHover = function (aStage, pickingProxy, data, structureComponent) {
        if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
            var atom = pickingProxy.atom || pickingProxy.closestBondAtom;
            var resno = atom.resno + this.state.residueOffset;
            this.removeNonLockedRepresentations(structureComponent);
            this.highlightElement(structureComponent, [resno]);
            this.props.addHoveredResidues([resno]);
            var candidateResidues = this.props.candidateResidues;
            if (candidateResidues.length >= 1) {
                this.highlightElement(structureComponent, candidateResidues.concat([resno]));
            }
        }
    };
    NGLComponentClass.prototype.removeHighlights = function (structureComponent, residues) {
        var repDict = this.residueSelectionRepresentations;
        Object.keys(residues).forEach(function (prevKey) {
            repDict[prevKey].map(function (rep) { return structureComponent.removeRepresentation(rep); });
        });
    };
    /**
     * Highlight a specific residue on a 3D structure.
     *
     * @param structureComponent The structure for which the residue to highlight belongs.
     * @param selection [NGL Selection](https://github.com/arose/ngl/blob/master/doc/usage/selection-language.md) for what to highlight.
     */
    NGLComponentClass.prototype.highlightElement = function (structureComponent, residues) {
        var residueOffset = this.state.residueOffset;
        var residueKey = residues.toString();
        var residueWithOffset = residues.map(function (res) { return res - residueOffset; });
        var repDict = this.residueSelectionRepresentations;
        if (repDict[residueKey]) {
            repDict[residueKey].map(function (rep) { return structureComponent.removeRepresentation(rep); });
        }
        else {
            repDict[residueKey] = [];
        }
        var selection = residueWithOffset.join('.CA, ') + '.CA';
        if (residueWithOffset.length >= 2) {
            repDict[residueKey].push(structureComponent.addRepresentation('distance', {
                atomPair: [selection.split(',')],
                color: 'skyblue',
                labelUnit: 'nm',
            }));
        }
        if (residueWithOffset.length !== 0) {
            repDict[residueKey].push(structureComponent.addRepresentation('ball+stick', {
                sele: residueWithOffset.join(', '),
            }));
        }
    };
    NGLComponentClass.prototype.removeNonLockedRepresentations = function (structureComponent) {
        var repDict = this.residueSelectionRepresentations;
        for (var _i = 0, _a = Object.keys(repDict); _i < _a.length; _i++) {
            var key = _a[_i];
            if (!this.props.lockedResiduePairs[key]) {
                repDict[key].forEach(function (rep) { return structureComponent.removeRepresentation(rep); });
                delete this.residueSelectionRepresentations[key];
            }
        }
    };
    return NGLComponentClass;
}(React.Component)));
exports.NGLComponent = function (props) { return (React.createElement(ResidueContext_1.ResidueContext.Consumer, null, function (_a) {
    var addLockedResiduePair = _a.addLockedResiduePair, addHoveredResidues = _a.addHoveredResidues, addCandidateResidues = _a.addCandidateResidues, candidateResidues = _a.candidateResidues, hoveredResidues = _a.hoveredResidues, lockedResiduePairs = _a.lockedResiduePairs, removeAllLockedResiduePairs = _a.removeAllLockedResiduePairs, removeCandidateResidues = _a.removeCandidateResidues, removeHoveredResidues = _a.removeHoveredResidues;
    return (React.createElement(exports.NGLComponentWithDefaultProps, __assign({}, props, { addCandidateResidues: addCandidateResidues, addHoveredResidues: addHoveredResidues, addLockedResiduePair: addLockedResiduePair, candidateResidues: candidateResidues, hoveredResidues: hoveredResidues, lockedResiduePairs: lockedResiduePairs, removeAllLockedResiduePairs: removeAllLockedResiduePairs, removeCandidateResidues: removeCandidateResidues, removeHoveredResidues: removeHoveredResidues })));
})); };
