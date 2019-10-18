"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var NGL = require("ngl");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var AminoAcid_1 = require("~bioblocks-viz~/data/AminoAcid");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
exports.initialNGLState = {
    activeRepresentations: {
        experimental: {
            reps: new Array(),
            structType: 'default',
        },
        predicted: {
            reps: new Array(),
            structType: 'cartoon',
        },
    },
    isDistRepEnabled: true,
    isMovePickEnabled: false,
    stage: undefined,
    superpositionStatus: 'NONE',
};
var NGLComponent = /** @class */ (function (_super) {
    tslib_1.__extends(NGLComponent, _super);
    function NGLComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = exports.initialNGLState;
        _this.prevCanvas = null;
        _this.canvas = null;
        _this.addNewHoveredResidue = function (pickingProxy, stage) {
            var atom = pickingProxy.atom || pickingProxy.closestBondAtom;
            var addHoveredResidues = _this.props.addHoveredResidues;
            var aa = AminoAcid_1.AminoAcid.fromThreeLetterCode(atom.resname);
            var resname = aa ? aa.singleLetterCode : atom.resname;
            // const resname = AMINO_ACID_BY_CODE[atom.resname as AMINO_ACID_THREE_LETTER_CODE]
            //  ? AMINO_ACID_BY_CODE[atom.resname as AMINO_ACID_THREE_LETTER_CODE].singleLetterCode
            //  : atom.resname;
            stage.tooltip.textContent = "" + atom.resno + resname;
            addHoveredResidues([atom.resno]);
        };
        /**
         * Callback for when the canvas element is mounted.
         * This is needed to ensure the NGL camera preserves orientation if the DOM node is re-mounted, like for full-page mode.
         *
         * @param el The canvas element.
         */
        _this.canvasRefCallback = function (el) {
            _this.prevCanvas = _this.canvas;
            _this.canvas = el;
            if (_this.prevCanvas === null && _this.canvas !== null && _this.state.stage !== undefined) {
                var orientation_1 = _this.state.stage.viewerControls.getOrientation();
                _this.state.stage.removeAllComponents();
                var _a = _this.props, experimentalProteins = _a.experimentalProteins, predictedProteins = _a.predictedProteins;
                var superpositionStatus = _this.state.superpositionStatus;
                var allProteins = tslib_1.__spread(experimentalProteins, predictedProteins);
                var parameters = _this.state.stage.parameters;
                var stage_1 = _this.generateStage(_this.canvas, parameters);
                allProteins.map(function (pdb) {
                    _this.initData(stage_1, pdb.nglStructure);
                });
                _this.handleSuperposition(stage_1, superpositionStatus);
                stage_1.viewerControls.orient(orientation_1);
                stage_1.viewer.requestRender();
                _this.setState({
                    stage: stage_1,
                });
            }
        };
        _this.centerCamera = function () {
            var stage = _this.state.stage;
            if (stage) {
                stage.autoView();
            }
        };
        _this.generateStage = function (canvas, params) {
            var stage = new NGL.Stage(canvas, params);
            stage.mouseControls.add('hoverPick', function (aStage, pickingProxy) {
                _this.onHover(aStage, pickingProxy);
            });
            stage.mouseControls.remove('clickPick-*', NGL.MouseActions.movePick);
            // !IMPORTANT! This is needed to prevent the canvas shifting when the user clicks the canvas.
            // It's unclear why the focus does this, but it's undesirable.
            stage.keyBehavior.domElement.focus = function () {
                return;
            };
            return stage;
        };
        _this.getDockItems = function () {
            var isSuperPositionOn = _this.state.superpositionStatus !== 'NONE';
            return [
                {
                    isVisibleCb: function () {
                        return _this.props.selectedSecondaryStructures.length >= 1 ||
                            Object.values(_this.props.lockedResiduePairs).length >= 1 ||
                            _this.props.candidateResidues.length >= 1;
                    },
                    onClick: function () {
                        _this.props.removeAllLockedResiduePairs();
                        _this.props.removeAllSelectedSecondaryStructures();
                        _this.props.removeCandidateResidues();
                        _this.props.removeHoveredResidues();
                    },
                    text: 'Clear Selections',
                },
                {
                    onClick: _this.centerCamera,
                    text: 'Center View',
                },
                {
                    isVisibleCb: function () { return _this.props.experimentalProteins.length + _this.props.predictedProteins.length >= 2; },
                    onClick: _this.onSuperpositionToggle,
                    text: "Superimpose: " + (isSuperPositionOn ? 'On' : 'Off'),
                },
                {
                    onClick: _this.switchCameraType,
                    text: (_this.state.stage && _this.state.stage.parameters.cameraType === 'stereo' ? "Disable" : 'Enable') + " Stereo",
                },
            ];
        };
        _this.getRepresentationConfigs = function () {
            var reps = ['default', 'spacefill', 'backbone', 'cartoon', 'surface', 'tube'];
            return {
                'Structure Representations': [
                    {
                        current: helper_1.capitalizeFirstLetter(_this.state.activeRepresentations.predicted.structType),
                        name: 'Predicted Structure Representation',
                        onChange: function (value) {
                            var predictedProteins = _this.props.predictedProteins;
                            var _a = _this.state, activeRepresentations = _a.activeRepresentations, stage = _a.stage;
                            if (stage) {
                                _this.setState({
                                    activeRepresentations: tslib_1.__assign(tslib_1.__assign({}, activeRepresentations), { predicted: _this.updateRepresentation(stage, reps[value], predictedProteins) }),
                                });
                                stage.viewer.requestRender();
                            }
                        },
                        options: ['Rainbow', 'Spacefill', 'Backbone', 'Cartoon', 'Surface', 'Tube'],
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.RADIO,
                    },
                    {
                        current: helper_1.capitalizeFirstLetter(_this.state.activeRepresentations.experimental.structType),
                        name: 'Experimental Structure Representation',
                        onChange: function (value) {
                            var experimentalProteins = _this.props.experimentalProteins;
                            var _a = _this.state, activeRepresentations = _a.activeRepresentations, stage = _a.stage;
                            if (stage) {
                                _this.setState({
                                    activeRepresentations: tslib_1.__assign(tslib_1.__assign({}, activeRepresentations), { experimental: _this.updateRepresentation(stage, reps[value], experimentalProteins) }),
                                });
                                stage.viewer.requestRender();
                            }
                        },
                        options: ['Rainbow', 'Spacefill', 'Backbone', 'Cartoon', 'Surface', 'Tube'],
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.RADIO,
                    },
                ],
            };
        };
        _this.getSettingsConfigurations = function () {
            var measuredProximity = _this.props.measuredProximity;
            var _a = _this.state, isDistRepEnabled = _a.isDistRepEnabled, isMovePickEnabled = _a.isMovePickEnabled;
            return {
                'View Options': [
                    {
                        checked: isMovePickEnabled,
                        name: 'Zoom on Click',
                        onChange: _this.toggleMovePick,
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.CHECKBOX,
                    },
                    {
                        checked: isDistRepEnabled,
                        name: 'Display Distance in Ångström',
                        onChange: _this.toggleDistRep,
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.CHECKBOX,
                    },
                    {
                        current: measuredProximity,
                        name: 'Proximity Metric',
                        onChange: _this.measuredProximityHandler,
                        options: Object.values(data_1.CONTACT_DISTANCE_PROXIMITY).map(helper_1.capitalizeEveryWord),
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.RADIO,
                    },
                ],
            };
        };
        _this.handleAtomClick = function (pickingProxy) {
            var _a;
            var _b = _this.props, addLockedResiduePair = _b.addLockedResiduePair, addCandidateResidues = _b.addCandidateResidues, candidateResidues = _b.candidateResidues, removeCandidateResidues = _b.removeCandidateResidues;
            var atom = pickingProxy.atom || pickingProxy.closestBondAtom;
            if (candidateResidues.length >= 1) {
                var sortedResidues = tslib_1.__spread(candidateResidues, [atom.resno]).sort();
                addLockedResiduePair((_a = {}, _a[sortedResidues.toString()] = tslib_1.__spread(candidateResidues, [atom.resno]), _a));
                removeCandidateResidues();
            }
            else {
                addCandidateResidues([atom.resno]);
            }
        };
        _this.handleBothSuperposition = function (stage) {
            var e_1, _a;
            for (var i = 1; i < stage.compList.length; ++i) {
                NGL.superpose(stage.compList[i].object, stage.compList[0].object, true);
            }
            try {
                for (var _b = tslib_1.__values(stage.compList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var component = _c.value;
                    component.setPosition([0, 0, 0]);
                    component.updateRepresentations({ position: true });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (stage.compList[0]) {
                stage.compList[0].autoView();
            }
            else {
                stage.autoView();
            }
        };
        _this.handleClickHover = function (structureComponent) {
            var hoveredResidues = _this.props.hoveredResidues;
            hoveredResidues.forEach(function (residueIndex) {
                _this.handleHoveredDistances(residueIndex, structureComponent);
            });
        };
        _this.handleClickPick = function (pickingProxy) {
            var removeLockedResiduePair = _this.props.removeLockedResiduePair;
            if (pickingProxy.picker && pickingProxy.picker.type === 'distance') {
                var residues = [pickingProxy.distance.atom1.resno, pickingProxy.distance.atom2.resno];
                removeLockedResiduePair(residues.sort().toString());
            }
            else if (pickingProxy.atom || pickingProxy.closestBondAtom) {
                _this.handleAtomClick(pickingProxy);
            }
        };
        _this.handleHoveredDistances = function (residueIndex, structureComponent) {
            var _a;
            var _b = _this.props, addLockedResiduePair = _b.addLockedResiduePair, candidateResidues = _b.candidateResidues, removeCandidateResidues = _b.removeCandidateResidues, removeNonLockedResidues = _b.removeNonLockedResidues;
            var getMinDist = function (residueStore, target) {
                var minDist = Number.MAX_SAFE_INTEGER;
                var atomOffset = residueStore.atomOffset[residueIndex];
                var atomCount = residueStore.atomCount[residueIndex];
                for (var i = 0; i < atomCount; ++i) {
                    var atomProxy = structureComponent.structure.getAtomProxy(atomOffset + i);
                    var atomPosition = structureComponent.stage.viewerControls.getPositionOnCanvas(atomProxy.positionToVector3());
                    minDist = Math.min(minDist, target.distanceTo(atomPosition));
                }
                return minDist;
            };
            // ! IMPORTANT !
            // This is a rather brute force approach to see if the mouse is close to a residue.
            // The main problem is __reliably__ getting the (x,y) of where the user clicked and the "residue" they were closest to.
            var _c = structureComponent.stage.mouseObserver, down = _c.down, canvasPosition = _c.canvasPosition, position = _c.position, prevClickCP = _c.prevClickCP, prevPosition = _c.prevPosition;
            var minDistances = [down, canvasPosition, prevClickCP, prevPosition, position].map(function (pos) {
                return getMinDist(structureComponent.structure.residueStore, pos);
            });
            // Shorthand to make it clearer that this method is just checking if any distance is within 100.
            var isWithinSnappingDistance = function (distances, limit) {
                if (limit === void 0) { limit = 100; }
                return distances.filter(function (dist) { return dist < limit; }).length >= 1;
            };
            if (isWithinSnappingDistance(minDistances)) {
                var sortedResidues = tslib_1.__spread(candidateResidues, [residueIndex]).sort();
                addLockedResiduePair((_a = {}, _a[sortedResidues.toString()] = tslib_1.__spread(candidateResidues, [residueIndex]), _a));
                removeCandidateResidues();
            }
            else {
                removeNonLockedResidues();
            }
        };
        _this.handleStructureClick = function (structureComponent, pickingProxy) {
            var _a = _this.props, candidateResidues = _a.candidateResidues, hoveredResidues = _a.hoveredResidues, removeNonLockedResidues = _a.removeNonLockedResidues;
            if (pickingProxy) {
                _this.handleClickPick(pickingProxy);
            }
            else if (candidateResidues.length >= 1 && hoveredResidues.length >= 1) {
                _this.handleClickHover(structureComponent);
            }
            else {
                // User clicked off-structure, so clear non-locked residue state.
                removeNonLockedResidues();
            }
        };
        _this.isExperimentalStructure = function (structureComponent) {
            var predictedProteins = _this.props.predictedProteins;
            if (predictedProteins.find(function (pred) { return pred.nglStructure.name === structureComponent.name; })) {
                return false;
            }
            return true;
        };
        _this.measuredProximityHandler = function (value) {
            var onMeasuredProximityChange = _this.props.onMeasuredProximityChange;
            if (onMeasuredProximityChange) {
                onMeasuredProximityChange(value);
            }
        };
        _this.onCanvasLeave = function () {
            var removeNonLockedResidues = _this.props.removeNonLockedResidues;
            removeNonLockedResidues();
        };
        _this.onClick = function (pickingProxy) {
            var e_2, _a;
            var stage = _this.state.stage;
            var _b = _this.props, candidateResidues = _b.candidateResidues, hoveredResidues = _b.hoveredResidues, removeNonLockedResidues = _b.removeNonLockedResidues;
            if (stage) {
                if (pickingProxy) {
                    _this.handleClickPick(pickingProxy);
                }
                else if (candidateResidues.length >= 1 && hoveredResidues.length >= 1) {
                    try {
                        for (var _c = tslib_1.__values(stage.compList), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var structureComponent = _d.value;
                            _this.handleClickHover(structureComponent);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                else {
                    // User clicked off-structure, so clear non-locked residue state.
                    removeNonLockedResidues();
                }
            }
        };
        _this.onKeyDown = function (event) {
            event.preventDefault();
            var ESC_KEY_CODE = 27;
            if (event.which === ESC_KEY_CODE || event.keyCode === ESC_KEY_CODE) {
                var removeNonLockedResidues = _this.props.removeNonLockedResidues;
                removeNonLockedResidues();
            }
        };
        _this.onResizeHandler = function (event) {
            var onResize = _this.props.onResize;
            var stage = _this.state.stage;
            if (stage) {
                stage.handleResize();
            }
            if (onResize) {
                onResize(event);
            }
        };
        _this.onSuperpositionToggle = function (event) {
            var superpositionStatus = _this.state.superpositionStatus;
            if (superpositionStatus === 'NONE') {
                _this.setState({
                    superpositionStatus: 'BOTH',
                });
            }
            else {
                _this.setState({
                    superpositionStatus: 'NONE',
                });
            }
        };
        _this.switchCameraType = function () {
            var stage = _this.state.stage;
            if (stage) {
                if (stage.parameters.cameraType === 'stereo') {
                    stage.setParameters({
                        cameraType: 'perspective',
                    });
                }
                else {
                    stage.setParameters({
                        cameraFov: 65,
                        cameraType: 'stereo',
                    });
                }
                _this.forceUpdate();
            }
        };
        _this.toggleDistRep = function (event) {
            var isDistRepEnabled = _this.state.isDistRepEnabled;
            _this.setState({
                isDistRepEnabled: !isDistRepEnabled,
            });
        };
        _this.toggleMovePick = function (event) {
            var _a = _this.state, isMovePickEnabled = _a.isMovePickEnabled, stage = _a.stage;
            if (stage) {
                if (isMovePickEnabled) {
                    stage.mouseControls.remove('clickPick-*', NGL.MouseActions.movePick);
                }
                else {
                    stage.mouseControls.add('clickPick-left', NGL.MouseActions.movePick);
                }
                _this.setState({
                    isMovePickEnabled: !isMovePickEnabled,
                });
            }
        };
        _this.updateRepresentation = function (stage, rep, pdbs) {
            var e_3, _a;
            var result = {
                reps: new Array(),
                structType: rep,
            };
            var _loop_1 = function (structureComponent) {
                var _a;
                if (pdbs.find(function (pdb) { return pdb.nglStructure.name === structureComponent.name; })) {
                    structureComponent.removeAllRepresentations();
                    if (rep === 'default') {
                        stage.defaultFileRepresentation(structureComponent);
                    }
                    else {
                        structureComponent.addRepresentation(rep);
                    }
                    (_a = result.reps).push.apply(_a, tslib_1.__spread(_this.deriveActiveRepresentations(structureComponent)));
                }
            };
            try {
                for (var _b = tslib_1.__values(stage.compList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var structureComponent = _c.value;
                    _loop_1(structureComponent);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return result;
        };
        return _this;
    }
    NGLComponent.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, backgroundColor = _a.backgroundColor, experimentalProteins = _a.experimentalProteins, predictedProteins = _a.predictedProteins;
        if (this.canvas) {
            var stage_2 = this.generateStage(this.canvas, { backgroundColor: backgroundColor });
            stage_2.removeAllComponents();
            var allProteins = tslib_1.__spread(experimentalProteins, predictedProteins);
            allProteins.map(function (pdb) {
                _this.initData(stage_2, pdb.nglStructure);
            });
            this.setState({
                stage: stage_2,
            });
        }
        window.addEventListener('resize', this.onResizeHandler, false);
    };
    NGLComponent.prototype.componentWillUnmount = function () {
        var stage = this.state.stage;
        if (stage) {
            stage.viewer.renderer.forceContextLoss();
            stage.dispose();
            this.setState({
                activeRepresentations: exports.initialNGLState.activeRepresentations,
                stage: undefined,
            });
        }
        window.removeEventListener('resize', this.onResizeHandler);
    };
    NGLComponent.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _this = this;
        var _a = this.props, candidateResidues = _a.candidateResidues, experimentalProteins = _a.experimentalProteins, hoveredResidues = _a.hoveredResidues, hoveredSecondaryStructures = _a.hoveredSecondaryStructures, lockedResiduePairs = _a.lockedResiduePairs, predictedProteins = _a.predictedProteins, measuredProximity = _a.measuredProximity, selectedSecondaryStructures = _a.selectedSecondaryStructures;
        var _b = this.state, isDistRepEnabled = _b.isDistRepEnabled, stage = _b.stage, superpositionStatus = _b.superpositionStatus;
        var allProteins = tslib_1.__spread(experimentalProteins, predictedProteins);
        if (stage && allProteins.length !== tslib_1.__spread(prevProps.experimentalProteins, prevProps.predictedProteins).length) {
            stage.removeAllComponents();
            allProteins.map(function (pdb) {
                _this.initData(stage, pdb.nglStructure);
            });
            this.handleSuperposition(stage, superpositionStatus);
        }
        if (stage && stage.compList.length >= 1) {
            if (superpositionStatus !== prevState.superpositionStatus) {
                this.handleSuperposition(stage, superpositionStatus);
            }
            var isHighlightUpdateNeeded = candidateResidues !== prevProps.candidateResidues ||
                hoveredResidues !== prevProps.hoveredResidues ||
                hoveredSecondaryStructures !== prevProps.hoveredSecondaryStructures ||
                isDistRepEnabled !== prevState.isDistRepEnabled ||
                lockedResiduePairs !== prevProps.lockedResiduePairs ||
                measuredProximity !== prevProps.measuredProximity ||
                selectedSecondaryStructures !== prevProps.selectedSecondaryStructures;
            if (isHighlightUpdateNeeded) {
                this.setState({
                    activeRepresentations: tslib_1.__assign({}, this.handleRepresentationUpdate(stage)),
                });
            }
            stage.viewer.requestRender();
        }
    };
    /**
     * Renders the NGL canvas.
     *
     * Because we are working with WebGL via the canvas, updating this visualization happens through the canvas reference.
     *
     * @returns The NGL Component
     */
    NGLComponent.prototype.render = function () {
        var _a = this.props, experimentalProteins = _a.experimentalProteins, height = _a.height, isDataLoading = _a.isDataLoading, menuItems = _a.menuItems, predictedProteins = _a.predictedProteins, style = _a.style, width = _a.width;
        var computedStyle = tslib_1.__assign(tslib_1.__assign({}, style), { height: height, width: width });
        return (React.createElement(component_1.ComponentCard, { componentName: 'NGL Viewer', dockItems: this.getDockItems(), isDataReady: experimentalProteins.length >= 1 || predictedProteins.length >= 1, menuItems: tslib_1.__spread(menuItems, [
                {
                    component: {
                        configs: tslib_1.__assign(tslib_1.__assign({}, this.getSettingsConfigurations()), this.getRepresentationConfigs()),
                        name: 'POPUP',
                        props: {
                            trigger: React.createElement(semantic_ui_react_1.Icon, { name: 'setting' }),
                        },
                    },
                    description: 'Settings',
                },
            ]) },
            React.createElement("div", { className: 'NGLComponent', style: computedStyle },
                React.createElement(semantic_ui_react_1.Dimmer, { active: isDataLoading },
                    React.createElement(semantic_ui_react_1.Loader, null)),
                React.createElement("div", { className: 'NGLCanvas', onKeyDown: this.onKeyDown, onMouseLeave: this.onCanvasLeave, ref: this.canvasRefCallback, role: 'img', style: { height: '100%', width: '100%' } }))));
    };
    /**
     * Adds a NGL structure to the stage.
     *
     * @param structure A NGL Structure.
     * @param stage A NGL Stage.
     */
    NGLComponent.prototype.addStructureToStage = function (structure, stage) {
        var structureComponent = stage.addComponentFromObject(structure);
        var predictedProteins = this.props.predictedProteins;
        var activeRepresentations = this.state.activeRepresentations;
        stage.signals.clicked.add(this.onClick);
        if (predictedProteins.find(function (pred) { return pred.nglStructure.name === structureComponent.name; })) {
            if (activeRepresentations.predicted.structType === 'default') {
                stage.defaultFileRepresentation(structureComponent);
            }
            else {
                structureComponent.addRepresentation(activeRepresentations.predicted.structType);
            }
            this.setState({
                activeRepresentations: {
                    experimental: tslib_1.__assign({}, activeRepresentations.experimental),
                    predicted: tslib_1.__assign(tslib_1.__assign({}, activeRepresentations.predicted), { reps: tslib_1.__spread(this.deriveActiveRepresentations(structureComponent)) }),
                },
            });
        }
        else {
            if (activeRepresentations.experimental.structType === 'default') {
                stage.defaultFileRepresentation(structureComponent);
            }
            else {
                structureComponent.addRepresentation(activeRepresentations.experimental.structType);
            }
            this.setState({
                activeRepresentations: {
                    experimental: tslib_1.__assign(tslib_1.__assign({}, activeRepresentations.experimental), { reps: tslib_1.__spread(this.deriveActiveRepresentations(structureComponent)) }),
                    predicted: tslib_1.__assign({}, activeRepresentations.predicted),
                },
            });
        }
        stage.viewer.requestRender();
    };
    NGLComponent.prototype.deriveActiveRepresentations = function (structureComponent) {
        var _a = this.props, candidateResidues = _a.candidateResidues, hoveredResidues = _a.hoveredResidues, hoveredSecondaryStructures = _a.hoveredSecondaryStructures, lockedResiduePairs = _a.lockedResiduePairs, selectedSecondaryStructures = _a.selectedSecondaryStructures;
        return tslib_1.__spread(this.highlightCandidateResidues(structureComponent, tslib_1.__spread(candidateResidues, hoveredResidues).filter(function (value, index, array) { return array.indexOf(value) === index; })
            .sort()), this.highlightLockedDistancePairs(structureComponent, lockedResiduePairs), this.highlightSecondaryStructures(structureComponent, tslib_1.__spread(hoveredSecondaryStructures, selectedSecondaryStructures)));
    };
    NGLComponent.prototype.getDistanceRepForResidues = function (structureComponent, residues) {
        var _a = this.props, experimentalProteins = _a.experimentalProteins, predictedProteins = _a.predictedProteins, measuredProximity = _a.measuredProximity;
        var isDistRepEnabled = this.state.isDistRepEnabled;
        var pdbData = tslib_1.__spread(experimentalProteins, predictedProteins).find(function (pdb) { return pdb.nglStructure.name === structureComponent.name; });
        if (measuredProximity === data_1.CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
            return helper_1.createDistanceRepresentation(structureComponent, residues.join('.CA, ') + ".CA", isDistRepEnabled);
        }
        else if (pdbData) {
            var _b = pdbData.getMinDistBetweenResidues(residues[0], residues[1]), atomIndexI = _b.atomIndexI, atomIndexJ = _b.atomIndexJ;
            return helper_1.createDistanceRepresentation(structureComponent, [atomIndexI, atomIndexJ], isDistRepEnabled);
        }
    };
    NGLComponent.prototype.handleRepresentationUpdate = function (stage) {
        var e_4, _a, e_5, _b, _c, _d;
        var activeRepresentations = this.state.activeRepresentations;
        var result = {
            experimental: {
                reps: new Array(),
                structType: activeRepresentations.experimental.structType,
            },
            predicted: {
                reps: new Array(),
                structType: activeRepresentations.predicted.structType,
            },
        };
        try {
            for (var _e = tslib_1.__values(stage.compList), _f = _e.next(); !_f.done; _f = _e.next()) {
                var structureComponent = _f.value;
                var isExperimental = this.isExperimentalStructure(structureComponent);
                try {
                    for (var _g = (e_5 = void 0, tslib_1.__values(tslib_1.__spread(activeRepresentations.experimental.reps, activeRepresentations.predicted.reps))), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var rep = _h.value;
                        if (structureComponent.reprList.includes(rep)) {
                            structureComponent.removeRepresentation(rep);
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                if (isExperimental) {
                    (_c = result.experimental.reps).push.apply(_c, tslib_1.__spread(this.deriveActiveRepresentations(structureComponent)));
                }
                else {
                    (_d = result.predicted.reps).push.apply(_d, tslib_1.__spread(this.deriveActiveRepresentations(structureComponent)));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    };
    NGLComponent.prototype.handleSuperposition = function (stage, superpositionStatus) {
        if (superpositionStatus === 'BOTH') {
            this.handleBothSuperposition(stage);
        }
        else if (superpositionStatus === 'NONE') {
            stage.compList.forEach(function (component, index) {
                component.setPosition([index * 50, 0, 0]);
                component.updateRepresentations({ position: true });
            });
            stage.autoView();
        }
    };
    NGLComponent.prototype.highlightCandidateResidues = function (structureComponent, residues) {
        var reps = new Array();
        if (residues.length >= 1) {
            reps.push(helper_1.createBallStickRepresentation(structureComponent, residues));
            if (residues.length >= 2) {
                var rep = this.getDistanceRepForResidues(structureComponent, residues);
                if (rep) {
                    reps.push(rep);
                }
            }
        }
        return reps;
    };
    NGLComponent.prototype.highlightLockedDistancePairs = function (structureComponent, lockedResidues) {
        var e_6, _a;
        var reps = new Array();
        try {
            for (var _b = tslib_1.__values(Object.values(lockedResidues)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var residues = _c.value;
                reps.push(helper_1.createBallStickRepresentation(structureComponent, residues));
                if (residues.length >= 2) {
                    var rep = this.getDistanceRepForResidues(structureComponent, residues);
                    if (rep) {
                        reps.push(rep);
                    }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return reps;
    };
    NGLComponent.prototype.highlightSecondaryStructures = function (structureComponent, secondaryStructures) {
        var e_7, _a;
        var reps = new Array();
        try {
            for (var secondaryStructures_1 = tslib_1.__values(secondaryStructures), secondaryStructures_1_1 = secondaryStructures_1.next(); !secondaryStructures_1_1.done; secondaryStructures_1_1 = secondaryStructures_1.next()) {
                var structure = secondaryStructures_1_1.value;
                reps.push(helper_1.createSecStructRepresentation(structureComponent, structure));
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (secondaryStructures_1_1 && !secondaryStructures_1_1.done && (_a = secondaryStructures_1.return)) _a.call(secondaryStructures_1);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return reps;
    };
    NGLComponent.prototype.initData = function (stage, structure) {
        if (structure) {
            // !IMPORTANT! We need to deeply clone the NGL data!
            // If we have multiple NGL components displaying the same data, removing the component will affect
            // the others because they (internally) delete keys/references.
            this.addStructureToStage(lodash_1.cloneDeep(structure), stage);
        }
        stage.viewer.requestRender();
    };
    NGLComponent.prototype.onHover = function (aStage, pickingProxy) {
        var _a = this.props, candidateResidues = _a.candidateResidues, hoveredResidues = _a.hoveredResidues, removeHoveredResidues = _a.removeHoveredResidues;
        var stage = this.state.stage;
        if (stage) {
            if (pickingProxy && (pickingProxy.atom || pickingProxy.closestBondAtom)) {
                this.addNewHoveredResidue(pickingProxy, stage);
            }
            else if (candidateResidues.length === 0 && hoveredResidues.length !== 0) {
                removeHoveredResidues();
            }
        }
    };
    NGLComponent.defaultProps = {
        addCandidateResidues: helper_1.EMPTY_FUNCTION,
        addHoveredResidues: helper_1.EMPTY_FUNCTION,
        addLockedResiduePair: helper_1.EMPTY_FUNCTION,
        backgroundColor: '#ffffff',
        candidateResidues: [],
        experimentalProteins: [],
        height: '92%',
        hoveredResidues: [],
        hoveredSecondaryStructures: [],
        isDataLoading: false,
        lockedResiduePairs: {},
        measuredProximity: data_1.CONTACT_DISTANCE_PROXIMITY.C_ALPHA,
        menuItems: [],
        onMeasuredProximityChange: helper_1.EMPTY_FUNCTION,
        onResize: helper_1.EMPTY_FUNCTION,
        predictedProteins: [],
        removeAllLockedResiduePairs: helper_1.EMPTY_FUNCTION,
        removeAllSelectedSecondaryStructures: helper_1.EMPTY_FUNCTION,
        removeCandidateResidues: helper_1.EMPTY_FUNCTION,
        removeHoveredResidues: helper_1.EMPTY_FUNCTION,
        removeLockedResiduePair: helper_1.EMPTY_FUNCTION,
        removeNonLockedResidues: helper_1.EMPTY_FUNCTION,
        selectedSecondaryStructures: [],
        width: '100%',
    };
    return NGLComponent;
}(React.Component));
exports.NGLComponent = NGLComponent;
//# sourceMappingURL=NGLComponent.js.map