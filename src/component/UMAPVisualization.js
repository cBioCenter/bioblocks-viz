"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var immutable_1 = require("immutable");
var React = require("react");
var umap_js_1 = require("umap-js");
// tslint:disable-next-line: no-submodule-imports
var umap_1 = require("umap-js/dist/umap");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
var helper_1 = require("~bioblocks-viz~/helper");
var UMAPVisualization = /** @class */ (function (_super) {
    tslib_1.__extends(UMAPVisualization, _super);
    function UMAPVisualization(props) {
        var _this = _super.call(this, props) || this;
        _this.getLegendStats = function () {
            var plotlyData = _this.state.plotlyData;
            var legend = document.getElementsByClassName('legend')[0];
            // const legendWidth = legend ? legend.getBBox().width * 0.75 : 0;
            var legendWidth = legend ? 200 : 0;
            // Show legend if:
            // 2 or more data arrays, excluding selected points.
            // Only 1 data array with no name - OR - a name that is not unannotated.
            var showLegend = plotlyData.filter(function (datum) { return datum.name !== 'selected'; }).length >= 2 ||
                (plotlyData.length === 1 &&
                    (plotlyData[0].name === undefined ||
                        (plotlyData[0].name !== undefined && !plotlyData[0].name.includes('Unannotated'))));
            return {
                legendWidth: legendWidth,
                showLegend: showLegend,
            };
        };
        _this.render2D = function (showLegend, plotlyData) {
            var _a = _this.state, currentEpoch = _a.currentEpoch, ranges = _a.ranges, totalNumberEpochs = _a.totalNumberEpochs;
            return (React.createElement(component_1.PlotlyChart, { layout: tslib_1.__assign(tslib_1.__assign({}, component_1.defaultPlotlyLayout), { dragmode: 'select', legend: {
                        itemdoubleclick: false,
                        traceorder: 'grouped',
                        x: 1,
                        y: 0.95,
                    }, margin: {
                        b: 50,
                        l: 40,
                    }, showlegend: showLegend, xaxis: {
                        autorange: false,
                        range: [Math.floor(ranges.minX), Math.ceil(ranges.maxX)],
                        title: 'Dim 1',
                        titlefont: { size: 12 },
                    }, yaxis: {
                        autorange: false,
                        range: [Math.floor(ranges.minY), Math.ceil(ranges.maxY)],
                        title: 'Dim 2',
                        titlefont: { size: 12 },
                    } }), data: plotlyData, onLegendClickCallback: _this.onLegendClick, onSelectedCallback: currentEpoch === totalNumberEpochs ? _this.handlePointSelection : helper_1.EMPTY_FUNCTION, showLoader: true }));
        };
        _this.render3D = function (showLegend, plotlyData) {
            var _a = _this.state, currentEpoch = _a.currentEpoch, totalNumberEpochs = _a.totalNumberEpochs, dragMode = _a.dragMode, ranges = _a.ranges;
            return (React.createElement(component_1.PlotlyChart, { config: tslib_1.__assign(tslib_1.__assign({}, component_1.defaultPlotlyConfig), { displayModeBar: false, displaylogo: false, scrollZoom: true }), layout: tslib_1.__assign(tslib_1.__assign({}, component_1.defaultPlotlyLayout), { dragmode: dragMode, legend: {
                        itemdoubleclick: false,
                        traceorder: 'grouped',
                        x: 0.85,
                        y: 0.95,
                    }, margin: {
                        b: 10,
                        l: 0,
                        r: 5,
                    }, scene: {
                        aspectmode: 'cube',
                        xaxis: { autorange: false, range: [Math.floor(ranges.minX), Math.ceil(ranges.maxX)], title: 'Dim 1' },
                        yaxis: { autorange: false, range: [Math.floor(ranges.minY), Math.ceil(ranges.maxY)], title: 'Dim 2' },
                        zaxis: { autorange: false, range: [Math.floor(ranges.minZ), Math.ceil(ranges.maxZ)], title: 'Dim 3' },
                    }, showlegend: showLegend }), data: plotlyData, onLegendClickCallback: _this.onLegendClick, onSelectedCallback: currentEpoch === totalNumberEpochs ? _this.handlePointSelection : helper_1.EMPTY_FUNCTION, showLoader: true }));
        };
        _this.getData = function (umapEmbedding, dataLabels, tooltipNames) {
            if (dataLabels === void 0) { dataLabels = []; }
            if (tooltipNames === void 0) { tooltipNames = []; }
            var result = umapEmbedding.length > 0 && umapEmbedding[0].length > 2
                ? _this.getData3D(umapEmbedding, dataLabels, tooltipNames)
                : _this.getData2D(umapEmbedding, dataLabels, tooltipNames);
            var plotlyData = Object.values(result);
            var unannotated = plotlyData.splice(plotlyData.findIndex(function (datum) { return datum.legendgroup === 'Unannotated'; }), 1);
            var MAX_LEGEND_LENGTH = 20;
            return unannotated.concat(plotlyData.sort(function (a, b) { return b.x.length - a.x.length; })).map(function (data, index) {
                var dataVisibility = _this.state.dataVisibility;
                data.visible = dataVisibility[index] === undefined || dataVisibility[index] === true ? true : 'legendonly';
                if (data.name.length > MAX_LEGEND_LENGTH) {
                    var countStartPos = data.name.lastIndexOf('(');
                    var count = data.name.slice(countStartPos);
                    data.name =
                        data.name.length - count.length - 1 > MAX_LEGEND_LENGTH
                            ? data.name.slice(0, MAX_LEGEND_LENGTH - count.length + 1) + "... " + count
                            : data.name;
                }
                return data;
            });
        };
        _this.getData2D = function (umapEmbedding, dataLabels, tooltipNames) {
            if (dataLabels === void 0) { dataLabels = []; }
            if (tooltipNames === void 0) { tooltipNames = []; }
            var currentCells = _this.props.currentCells;
            var highlightData = {
                hoverinfo: 'none',
                marker: {
                    color: '#ffaa00',
                    symbol: 'circle-open',
                    width: 2,
                },
                mode: 'markers',
                name: 'selected',
                showlegend: false,
                type: 'scattergl',
                x: new Array(),
                y: new Array(),
            };
            var result = umapEmbedding.reduce(function (acc, umapRow, index) {
                var label = dataLabels[index];
                var _a = label ? label : { color: 'gray', name: 'Unannotated' }, color = _a.color, name = _a.name;
                if (acc[name]) {
                    acc[name].text.push(tooltipNames[index]);
                    acc[name].x.push(umapRow[0]);
                    acc[name].y.push(umapRow[1]);
                    acc[name].name = name + " (" + acc[name].x.length + ")";
                }
                else {
                    acc[name] = {
                        hoverinfo: 'none',
                        hovertemplate: '%{data.name}<br>%{text}<extra></extra>',
                        legendgroup: name === 'Unannotated' ? 'Unannotated' : 'Annotated',
                        marker: {
                            color: color ? color : 'gray',
                        },
                        mode: 'markers',
                        name: name + " (" + 1 + ")",
                        text: [tooltipNames[index]],
                        type: 'scattergl',
                        x: [umapRow[0]],
                        y: [umapRow[1]],
                    };
                }
                if (currentCells.contains(index)) {
                    highlightData.x.push(umapRow[0]);
                    highlightData.y.push(umapRow[1]);
                }
                return acc;
            }, {});
            result.BB_HIGHLIGHTED = highlightData;
            return result;
        };
        _this.getData3D = function (umapEmbedding, dataLabels, tooltipNames) {
            if (dataLabels === void 0) { dataLabels = []; }
            if (tooltipNames === void 0) { tooltipNames = []; }
            var currentCells = _this.props.currentCells;
            var highlightData = {
                hoverinfo: 'none',
                marker: {
                    color: '#ffaa00',
                    symbol: 'circle-open',
                    width: 2,
                },
                mode: 'markers',
                name: 'selected',
                showlegend: false,
                type: 'scattergl',
                x: new Array(),
                y: new Array(),
                z: new Array(),
            };
            var result = umapEmbedding.reduce(function (acc, umapRow, index) {
                var label = dataLabels[index];
                var _a = label ? label : { color: 'gray', name: 'Unannotated' }, color = _a.color, name = _a.name;
                if (acc[name]) {
                    acc[name].text.push(tooltipNames[index]);
                    acc[name].x.push(umapRow[0]);
                    acc[name].y.push(umapRow[1]);
                    acc[name].z.push(umapRow[2]);
                    acc[name].name = name + " (" + (acc[name].x.length + 1) + ")";
                }
                else {
                    acc[name] = {
                        hoverinfo: 'none',
                        hovertemplate: '%{data.name}<br>%{text}<extra></extra>',
                        legendgroup: name === 'Unannotated' ? 'Unannotated' : 'Annotated',
                        marker: {
                            color: color ? color : 'gray',
                            size: 4,
                        },
                        mode: 'markers',
                        name: name + " (" + 1 + ")",
                        text: [tooltipNames[index]],
                        type: 'scatter3d',
                        x: [umapRow[0]],
                        y: [umapRow[1]],
                        z: [umapRow[2]],
                    };
                }
                if (currentCells.contains(index)) {
                    highlightData.x.push(umapRow[0]);
                    highlightData.y.push(umapRow[1]);
                    highlightData.z.push(umapRow[2]);
                }
                return acc;
            }, {});
            result.BB_HIGHLIGHTED = highlightData;
            return result;
        };
        _this.get3DMenuItems = function () {
            var _a = _this.state, currentEpoch = _a.currentEpoch, dragMode = _a.dragMode, totalNumberEpochs = _a.totalNumberEpochs;
            var disabled = currentEpoch === undefined || totalNumberEpochs === undefined || currentEpoch < totalNumberEpochs;
            return [
                {
                    component: {
                        name: 'BUTTON',
                        onClick: disabled ? helper_1.EMPTY_FUNCTION : _this.onZoomClick,
                        props: {
                            active: dragMode === 'zoom',
                            disabled: disabled,
                        },
                    },
                    description: 'Zoom',
                    iconName: 'zoom',
                },
                {
                    component: {
                        name: 'BUTTON',
                        onClick: disabled ? helper_1.EMPTY_FUNCTION : _this.onPanClick,
                        props: {
                            active: dragMode === 'pan',
                            disabled: disabled,
                        },
                    },
                    description: 'Pan',
                    iconName: 'arrows alternate',
                },
                {
                    component: {
                        name: 'BUTTON',
                        onClick: disabled ? helper_1.EMPTY_FUNCTION : _this.onOrbitClick,
                        props: {
                            active: dragMode === 'orbit',
                            disabled: disabled,
                        },
                    },
                    description: 'Orbit',
                    iconName: 'sync alternate',
                },
                {
                    component: {
                        name: 'BUTTON',
                        onClick: disabled ? helper_1.EMPTY_FUNCTION : _this.onTurntableClick,
                        props: {
                            active: dragMode === 'turntable',
                            disabled: disabled,
                        },
                    },
                    description: 'Turntable',
                    iconName: 'weight',
                },
            ];
        };
        _this.onOrbitClick = function () {
            _this.setState({
                dragMode: 'orbit',
            });
        };
        _this.onPanClick = function () {
            _this.setState({
                dragMode: 'pan',
            });
        };
        _this.onTurntableClick = function () {
            _this.setState({
                dragMode: 'turntable',
            });
        };
        _this.onZoomClick = function () {
            _this.setState({
                dragMode: 'zoom',
            });
        };
        _this.getMenuItems = function () {
            var umapEmbedding = _this.state.umapEmbedding;
            var result = [
                {
                    component: {
                        configs: _this.getSettingsConfigs(),
                        name: 'POPUP',
                        props: {
                            disabled: umapEmbedding.length === 0,
                            position: 'top center',
                            wide: false,
                        },
                    },
                    description: 'Settings',
                },
            ];
            if (umapEmbedding.length >= 1 && umapEmbedding[0].length === 3) {
                result.push.apply(result, tslib_1.__spread(_this.get3DMenuItems()));
            }
            return result;
        };
        _this.getSettingsConfigs = function () {
            var _a = _this.state, numDimensions = _a.numDimensions, numMinDist = _a.numMinDist, numNeighbors = _a.numNeighbors, numSpread = _a.numSpread;
            return {
                Settings: [
                    {
                        marks: {
                            0: '0',
                            5: '5',
                        },
                        name: 'Min Dist',
                        onChange: _this.onMinDistChange,
                        step: 0.01,
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.SLIDER,
                        values: {
                            current: numMinDist,
                            defaultValue: 0.99,
                            max: 5,
                            min: 0,
                        },
                    },
                    {
                        marks: {
                            0: '0',
                            30: '30',
                        },
                        name: 'Neighbors',
                        onChange: _this.onNumNeighborsChange,
                        step: 1,
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.SLIDER,
                        values: {
                            current: numNeighbors,
                            defaultValue: 15,
                            max: 30,
                            min: 0,
                        },
                    },
                    {
                        marks: {
                            0: '0',
                            10: '10',
                        },
                        name: 'Spread',
                        onChange: _this.onSpreadChange,
                        step: 1,
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.SLIDER,
                        values: {
                            current: numSpread,
                            defaultValue: 1,
                            max: 10,
                            min: 0,
                        },
                    },
                    {
                        current: numDimensions.toString(),
                        name: 'Dimensions',
                        onChange: _this.onDimensionChange,
                        options: ['2', '3'],
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.RADIO,
                    },
                    {
                        name: 'Re-Run UMAP',
                        onClick: _this.executeUMAP,
                        type: data_1.CONFIGURATION_COMPONENT_TYPE.BUTTON,
                    },
                ],
            };
        };
        _this.handlePointSelection = function (event) {
            var setCurrentCells = _this.props.setCurrentCells;
            var umapEmbedding = _this.state.umapEmbedding;
            var selectedCells = new Array();
            var _loop_1 = function (i) {
                var x = event.selectedPoints[i];
                var y = event.selectedPoints[i + 1];
                var cellIndex = umapEmbedding.findIndex(function (coord) { return coord[0] === x && coord[1] === y; });
                if (cellIndex >= 0) {
                    selectedCells.push(cellIndex);
                }
            };
            for (var i = 0; i < event.selectedPoints.length - 1; i += 2) {
                _loop_1(i);
            }
            setCurrentCells(selectedCells);
        };
        _this.renderCategoryDropdown = function () {
            var _a = _this.props, currentLabel = _a.currentLabel, labels = _a.labels;
            return (labels.length >= 1 && (React.createElement("div", { style: {
                    float: 'right',
                    fontSize: '14px',
                    paddingRight: '5px',
                    position: 'relative',
                    width: '30%',
                    zIndex: 777,
                } },
                "Annotation:",
                ' ',
                React.createElement(semantic_ui_react_1.Dropdown, { direction: 'right', fluid: false, inline: true, onChange: _this.onLabelChange, options: labels.map(function (label) { return ({
                        text: label,
                        value: label,
                    }); }), text: currentLabel }),
                ' ')));
        };
        _this.onDimensionChange = function (value) {
            _this.setState({
                numDimensions: value === 0 ? 2 : 3,
            });
        };
        _this.onLabelChange = function (event, data) {
            var onLabelChange = _this.props.onLabelChange;
            _this.setState({
                dataVisibility: {},
            });
            onLabelChange(event, data);
        };
        _this.onMinDistChange = function (value) {
            _this.setState({
                numMinDist: value,
            });
        };
        _this.onNumNeighborsChange = function (value) {
            _this.setState({
                numNeighbors: value,
            });
        };
        _this.onSpreadChange = function (value) {
            _this.setState({
                numSpread: value,
            });
        };
        _this.executeUMAP = function () {
            var _a = _this.props, dataMatrix = _a.dataMatrix, distanceFn = _a.distanceFn;
            // console.log('dataMatrix', dataMatrix);
            // console.log('distanceFn', distanceFn);
            // is this an update? if so, halt any previous executions
            clearTimeout(_this.timeout1);
            clearTimeout(_this.timeout2);
            _this.setState({
                currentEpoch: undefined,
                plotlyData: new Array(),
                ranges: UMAPVisualization.initialState.ranges,
                totalNumberEpochs: undefined,
                umapEmbedding: [],
            });
            // start processing umap
            var t0 = performance.now();
            _this.timeout1 = setTimeout(function () {
                var _a = _this.state, numDimensions = _a.numDimensions, numNeighbors = _a.numNeighbors, numSpread = _a.numSpread, numMinDist = _a.numMinDist;
                var umap = new umap_js_1.UMAP({
                    distanceFn: distanceFn,
                    minDist: numMinDist,
                    nComponents: numDimensions,
                    nNeighbors: numNeighbors,
                    spread: numSpread,
                });
                if (dataMatrix.length === 0 || dataMatrix[0].length === 0) {
                    return;
                }
                var optimalNumberEpochs = umap.initializeFit(dataMatrix);
                // const optimalNumberEpochs = Math.min(umap.initializeFit(dataMatrix), 1);
                // console.log(`UMAP wants to do ${optimalNumberEpochs} epochs`);
                var stepUmapFn = function (epochCounter) {
                    umap.step();
                    if (epochCounter % _this.props.numIterationsBeforeReRender === 0 && epochCounter < optimalNumberEpochs) {
                        if (epochCounter % 50 === 0) {
                            // console.log(`${epochCounter} :: ${(performance.now() - t0) / 1000} sec`);
                        }
                        var umapEmbedding = umap.getEmbedding();
                        if (epochCounter === 0) {
                            // console.log('embedding:', umapEmbedding);
                        }
                        var ranges_1 = tslib_1.__assign({}, UMAPVisualization.initialState.ranges);
                        umapEmbedding.forEach(function (row) {
                            ranges_1.maxX = Math.max(ranges_1.maxX, row[0] + 2);
                            ranges_1.maxY = Math.max(ranges_1.maxY, row[1] + 2);
                            ranges_1.maxZ = Math.max(ranges_1.maxZ, row[2] + 2);
                            ranges_1.minX = Math.min(ranges_1.minX, row[0] - 2);
                            ranges_1.minY = Math.min(ranges_1.minY, row[1] - 2);
                            ranges_1.minZ = Math.min(ranges_1.minZ, row[2] - 2);
                        });
                        var plotlyData = _this.getData(umapEmbedding, _this.props.dataLabels, _this.props.tooltipNames);
                        _this.setState({
                            currentEpoch: epochCounter + 1,
                            plotlyData: plotlyData,
                            ranges: ranges_1,
                            umapEmbedding: umapEmbedding,
                        });
                    }
                    if (epochCounter < optimalNumberEpochs) {
                        _this.timeout2 = setTimeout(function () {
                            stepUmapFn(epochCounter + 1);
                        });
                    }
                };
                _this.setState({
                    dataVisibility: {},
                    totalNumberEpochs: optimalNumberEpochs,
                });
                stepUmapFn(0);
            });
        };
        _this.onLegendClick = function (event) {
            var _a;
            if ('expandedIndex' in event.plotlyEvent && event.plotlyEvent.expandedIndex !== undefined) {
                var dataVisibility = _this.state.dataVisibility;
                var expandedIndex = event.plotlyEvent.expandedIndex;
                _this.setState({
                    dataVisibility: tslib_1.__assign(tslib_1.__assign({}, dataVisibility), (_a = {}, _a[expandedIndex] = dataVisibility[expandedIndex] === undefined ? false : !dataVisibility[expandedIndex], _a)),
                });
            }
            return false;
        };
        _this.state = tslib_1.__assign(tslib_1.__assign({}, UMAPVisualization.initialState), { numDimensions: props.nComponents, numMinDist: props.minDist, numNeighbors: props.nNeighbors, numSpread: props.spread });
        return _this;
    }
    UMAPVisualization.prototype.setupDataServices = function () {
        this.registerDataset('cells', []);
    };
    UMAPVisualization.prototype.componentDidMount = function () {
        this.executeUMAP();
    };
    UMAPVisualization.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a = this.props, currentCells = _a.currentCells, dataLabels = _a.dataLabels, dataMatrix = _a.dataMatrix, distanceFn = _a.distanceFn, minDist = _a.minDist, nComponents = _a.nComponents, nNeighbors = _a.nNeighbors, spread = _a.spread, tooltipNames = _a.tooltipNames;
        var _b = this.state, dataVisibility = _b.dataVisibility, umapEmbedding = _b.umapEmbedding;
        if (distanceFn !== prevProps.distanceFn || dataMatrix !== prevProps.dataMatrix) {
            this.executeUMAP();
        }
        else if (dataLabels !== prevProps.dataLabels ||
            tooltipNames !== prevProps.tooltipNames ||
            dataVisibility !== prevState.dataVisibility ||
            currentCells !== prevProps.currentCells) {
            this.setState({
                plotlyData: this.getData(umapEmbedding, dataLabels, tooltipNames),
            });
        }
        else if (nComponents !== prevProps.nComponents) {
            this.setState({
                numDimensions: nComponents,
            });
        }
        else if (spread !== prevProps.spread) {
            this.setState({
                numSpread: spread,
            });
        }
        else if (minDist !== prevProps.minDist) {
            this.setState({
                numMinDist: minDist,
            });
        }
        else if (nNeighbors !== prevProps.nNeighbors) {
            this.setState({
                numNeighbors: nNeighbors,
            });
        }
    };
    UMAPVisualization.prototype.render = function () {
        var iconSrc = this.props.iconSrc;
        var _a = this.state, currentEpoch = _a.currentEpoch, plotlyData = _a.plotlyData, totalNumberEpochs = _a.totalNumberEpochs, umapEmbedding = _a.umapEmbedding;
        var epochInfo;
        if (totalNumberEpochs && currentEpoch) {
            epochInfo = "epoch " + currentEpoch + "/" + totalNumberEpochs;
        }
        var legendStats = this.getLegendStats();
        return (React.createElement("div", null,
            React.createElement(component_1.ComponentCard, { componentName: 'UMAP', expandedStyle: {
                    height: '80vh',
                    width: "calc(" + legendStats.legendWidth + "px + 80vh)",
                }, dockItems: [
                    {
                        isLink: false,
                        text: umapEmbedding.length + " sequence" + (umapEmbedding.length !== 1 ? 's' : '') + " | " + (epochInfo ? epochInfo : ''),
                    },
                ], height: '575px', iconSrc: iconSrc, isDataReady: epochInfo !== undefined, menuItems: this.getMenuItems(), width: legendStats.legendWidth + 535 + "px" },
                this.renderCategoryDropdown(),
                umapEmbedding.length >= 1 && umapEmbedding[0].length === 3
                    ? this.render3D(legendStats.showLegend, plotlyData)
                    : this.render2D(legendStats.showLegend, plotlyData))));
    };
    UMAPVisualization.defaultProps = {
        currentCells: immutable_1.Set(),
        currentLabel: '',
        distanceFn: umap_1.euclidean,
        errorMessages: [],
        labels: [],
        minDist: 0.99,
        nComponents: 2,
        nNeighbors: 15,
        numIterationsBeforeReRender: 1,
        onLabelChange: helper_1.EMPTY_FUNCTION,
        setCurrentCells: helper_1.EMPTY_FUNCTION,
        spread: 1,
    };
    UMAPVisualization.initialState = {
        currentEpoch: undefined,
        // tslint:disable-next-line: no-object-literal-type-assertion
        dataVisibility: {},
        dragMode: 'turntable',
        numDimensions: UMAPVisualization.defaultProps.nComponents,
        numMinDist: UMAPVisualization.defaultProps.minDist,
        numNeighbors: UMAPVisualization.defaultProps.nNeighbors,
        numSpread: UMAPVisualization.defaultProps.spread,
        plotlyData: new Array(),
        ranges: {
            maxX: -20,
            maxY: -20,
            maxZ: -20,
            minX: 20,
            minY: 20,
            minZ: 20,
        },
        totalNumberEpochs: undefined,
        umapEmbedding: new Array(new Array()),
    };
    return UMAPVisualization;
}(container_1.BioblocksVisualization));
exports.UMAPVisualization = UMAPVisualization;
//# sourceMappingURL=UMAPVisualization.js.map