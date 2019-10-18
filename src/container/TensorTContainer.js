"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tensorFlow = require("@tensorflow/tfjs-core");
// tslint:disable-next-line:no-submodule-imports
var tsne_1 = require("@tensorflow/tfjs-tsne/dist/tsne");
var immutable_1 = require("immutable");
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var semantic_ui_react_1 = require("semantic-ui-react");
var action_1 = require("~bioblocks-viz~/action");
var component_1 = require("~bioblocks-viz~/component");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
var reducer_1 = require("~bioblocks-viz~/reducer");
var ContainerSelectors_1 = require("~bioblocks-viz~/selector/ContainerSelectors");
var TensorTContainerClass = /** @class */ (function (_super) {
    tslib_1.__extends(TensorTContainerClass, _super);
    function TensorTContainerClass(props) {
        var _this = _super.call(this, props) || this;
        _this.canvasContext = null;
        _this.getPlotlyCoordsFromTsne = function (coords) {
            var _a = _this.props, currentCells = _a.currentCells, pointColor = _a.pointColor;
            return [
                {
                    marker: {
                        color: pointColor,
                    },
                    mode: 'markers',
                    type: 'scattergl',
                    x: coords.map(function (coord) { return coord[0]; }),
                    y: coords.map(function (coord) { return coord[1]; }),
                },
                {
                    marker: {
                        color: _this.props.pointColor,
                        line: {
                            color: '#ffaa00',
                            width: 2,
                        },
                    },
                    mode: 'markers',
                    type: 'scattergl',
                    x: currentCells.toArray().map(function (cellIndex) { return coords[cellIndex][0]; }),
                    y: currentCells.toArray().map(function (cellIndex) { return coords[cellIndex][1]; }),
                },
            ];
        };
        _this.getPlotlyCoordsFromSpring = function (coords, currentCells) {
            return [
                {
                    marker: {
                        color: _this.props.pointColor,
                    },
                    mode: 'markers',
                    type: 'scattergl',
                    x: coords.map(function (coord) { return coord[0]; }),
                    y: coords.map(function (coord) { return coord[1]; }),
                },
                {
                    marker: {
                        color: _this.props.pointColor,
                        line: {
                            color: '#ffaa00',
                            width: 2,
                        },
                    },
                    mode: 'markers',
                    type: 'scattergl',
                    x: currentCells.map(function (cellIndex) { return coords[cellIndex][0]; }),
                    y: currentCells.map(function (cellIndex) { return coords[cellIndex][1]; }),
                },
            ];
        };
        _this.getTensorConfigs = function () { return [
            {
                name: 'Iterate Once',
                onClick: _this.onIterateForward(),
                type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON,
            },
            {
                name: 'Iterate Ten Times',
                onClick: _this.onIterateForward(10),
                type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON,
            },
            {
                name: 'Iterate Fifty Times',
                onClick: _this.onIterateForward(50),
                type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON,
            },
            {
                name: 'Reset',
                onClick: _this.onReset(),
                type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON,
            },
            {
                icon: 'hashtag',
                name: "Total Iterations: " + _this.state.numIterations,
                type: data_1.CONFIGURATION_COMPONENT_TYPE.LABEL,
            },
        ]; };
        _this.handlePointSelection = function (event) {
            var setCurrentCells = _this.props.setCurrentCells;
            var coordsArray = _this.state.coordsArray;
            var selectedCells = new Array();
            var _loop_1 = function (i) {
                var x = event.selectedPoints[i];
                var y = event.selectedPoints[i + 1];
                var cellIndex = coordsArray.findIndex(function (coord) { return coord[0] === x && coord[1] === y; });
                if (cellIndex >= 0) {
                    selectedCells.push(cellIndex);
                }
            };
            for (var i = 0; i < event.selectedPoints.length - 1; i += 2) {
                _loop_1(i);
            }
            setCurrentCells(selectedCells);
        };
        _this.renderIterateLabel = function () { return React.createElement("label", null, "iterations: " + _this.state.numIterations); };
        /**
         * Renders the radio button responsible for toggling the animation on/off.
         */
        _this.renderIterateButton = function () { return (React.createElement(semantic_ui_react_1.Radio, { label: React.createElement("label", { style: { fontSize: '14px', fontWeight: 'bold' } }, "iterate"), onClick: _this.onIterationToggle(), toggle: true })); };
        _this.renderResetButton = function () { return React.createElement(semantic_ui_react_1.Icon, { name: 'undo', onClick: _this.onReset() }); };
        _this.onIterateForward = function (amount) {
            if (amount === void 0) { amount = 1; }
            return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, isComputing, tsne, coordsArray, plotlyCoords;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.state, isComputing = _a.isComputing, tsne = _a.tsne;
                            if (!(tsne && !isComputing)) return [3 /*break*/, 3];
                            this.setState({
                                isComputing: true,
                            });
                            return [4 /*yield*/, tsne.iterate(amount)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, tsne.coordsArray()];
                        case 2:
                            coordsArray = _b.sent();
                            plotlyCoords = this.getPlotlyCoordsFromTsne(coordsArray);
                            this.setState({
                                coordsArray: coordsArray,
                                isComputing: false,
                                numIterations: this.state.numIterations + amount,
                                plotlyCoords: plotlyCoords,
                            });
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
        };
        _this.onIterationToggle = function () { return function () {
            var isAnimating = !_this.state.isAnimating;
            if (isAnimating) {
                var animationFrame_1 = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.onIterateForward(1)()];
                            case 1:
                                _a.sent();
                                if (this.state.isAnimating && this.state.numIterations < 500) {
                                    requestAnimationFrame(animationFrame_1);
                                }
                                else {
                                    this.setState({ isAnimating: false });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); };
                requestAnimationFrame(animationFrame_1);
            }
            _this.setState({ isAnimating: isAnimating });
        }; };
        _this.onReset = function () { return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.computeTensorTsne(0)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }; };
        _this.renderPlaybackControls = function () {
            return (React.createElement(semantic_ui_react_1.Grid.Row, { columns: 'equal', style: { maxHeight: '42px', padding: '14px 0 0 0' } },
                React.createElement(semantic_ui_react_1.Grid.Column, { floated: 'left' }, _this.renderIterateButton()),
                React.createElement(semantic_ui_react_1.Grid.Column, null, _this.renderIterateLabel()),
                React.createElement(semantic_ui_react_1.Grid.Column, { floated: 'right' }, _this.renderResetButton())));
        };
        _this.state = {
            coordsArray: [],
            isAnimating: false,
            isComputing: false,
            numIterations: 0,
            plotlyCoords: [],
        };
        return _this;
    }
    TensorTContainerClass.prototype.setupDataServices = function () {
        this.registerDataset('cells', []);
    };
    TensorTContainerClass.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tensorData, tsneData, tsne, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, helper_1.fetchTensorTSneCoordinateData(this.props.datasetLocation)];
                    case 1:
                        tensorData = _a.sent();
                        tsneData = tensorFlow.tensor(tensorData);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('@tensorflow/tfjs-tsne'); })];
                    case 2:
                        tsne = (_a.sent()).tsne(tsneData);
                        this.setState({
                            tsne: tsne,
                        });
                        return [4 /*yield*/, this.computeTensorTsne(this.state.numIterations)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TensorTContainerClass.prototype.componentDidUpdate = function (prevProps) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, currentCells, datasetLocation, tsne, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this.props, currentCells = _a.currentCells, datasetLocation = _a.datasetLocation;
                        tsne = this.state.tsne;
                        if (!(datasetLocation !== prevProps.datasetLocation)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setupTensorData()];
                    case 1:
                        _e.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!tsne) return [3 /*break*/, 4];
                        if (!(currentCells !== prevProps.currentCells)) return [3 /*break*/, 4];
                        _b = this.setState;
                        _c = {};
                        _d = this.getPlotlyCoordsFromTsne;
                        return [4 /*yield*/, tsne.coordsArray()];
                    case 3:
                        _b.apply(this, [(_c.plotlyCoords = _d.apply(this, [_e.sent()]),
                                _c)]);
                        _e.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TensorTContainerClass.prototype.render = function () {
        var _a = this.props, height = _a.height, iconSrc = _a.iconSrc, isFullPage = _a.isFullPage;
        var plotlyCoords = this.state.plotlyCoords;
        return (React.createElement(react_redux_1.Provider, { store: reducer_1.BBStore },
            React.createElement(component_1.ComponentCard, { componentName: TensorTContainerClass.displayName, iconSrc: iconSrc, isFullPage: isFullPage, height: height },
                React.createElement(semantic_ui_react_1.Grid, { centered: true, style: { height: '100%', marginLeft: 0, width: '100%' } },
                    this.renderPlaybackControls(),
                    React.createElement(semantic_ui_react_1.Grid.Row, { style: { height: "calc(100% - 3px)", margin: 0 } },
                        React.createElement(component_1.TensorTComponent, { onSelectedCallback: this.handlePointSelection, pointsToPlot: plotlyCoords }))))));
    };
    TensorTContainerClass.prototype.computeTensorTsne = function (numIterations) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, isComputing, tsne, coordsArray, plotlyCoords;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.state, isComputing = _a.isComputing, tsne = _a.tsne;
                        if (!(tsne && !isComputing)) return [3 /*break*/, 3];
                        this.setState({
                            isComputing: true,
                        });
                        return [4 /*yield*/, tsne.compute(numIterations)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, tsne.coordsArray()];
                    case 2:
                        coordsArray = _b.sent();
                        plotlyCoords = this.getPlotlyCoordsFromTsne(coordsArray);
                        this.setState({
                            coordsArray: coordsArray,
                            isComputing: false,
                            numIterations: numIterations,
                            plotlyCoords: plotlyCoords,
                        });
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TensorTContainerClass.prototype.setupTensorData = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tensorData, tsneData, tsne, numIterations, coordsArray, plotlyCoords, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        this.setState({
                            isAnimating: false,
                            isComputing: true,
                            plotlyCoords: [],
                            tsne: undefined,
                        });
                        return [4 /*yield*/, helper_1.fetchTensorTSneCoordinateData(this.props.datasetLocation)];
                    case 1:
                        tensorData = _a.sent();
                        tsneData = tensorFlow.tensor(tensorData);
                        tsne = new tsne_1.TSNE(tsneData);
                        numIterations = 0;
                        return [4 /*yield*/, tsne.compute(numIterations)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, tsne.coordsArray()];
                    case 3:
                        coordsArray = _a.sent();
                        plotlyCoords = this.getPlotlyCoordsFromTsne(coordsArray);
                        this.setState({
                            coordsArray: coordsArray,
                            isComputing: false,
                            numIterations: numIterations,
                            plotlyCoords: plotlyCoords,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TensorTContainerClass.defaultProps = {
        currentCells: immutable_1.Set(),
        datasetLocation: 'hpc/full',
        height: '525px',
        isFullPage: false,
        pointColor: '#aa0000',
        setCurrentCells: helper_1.EMPTY_FUNCTION,
        style: {
            padding: 0,
        },
        width: 400,
    };
    TensorTContainerClass.displayName = 'tSNE - TensorFlow';
    return TensorTContainerClass;
}(container_1.BioblocksVisualization));
exports.TensorTContainerClass = TensorTContainerClass;
var mapStateToProps = function (state) { return ({
    currentCells: ContainerSelectors_1.selectCurrentItems(state, 'cells'),
}); };
var mapDispatchToProps = function (dispatch) {
    return redux_1.bindActionCreators({
        setCurrentCells: action_1.createContainerActions('cells').set,
    }, dispatch);
};
exports.TensorTContainer = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(TensorTContainerClass);
//# sourceMappingURL=TensorTContainer.js.map