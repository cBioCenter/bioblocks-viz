"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Immutable = require("immutable");
var lodash_1 = require("lodash");
// tslint:disable-next-line: no-submodule-imports
var plotly = require("plotly.js/lib/index");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var data_1 = require("~bioblocks-viz~/data");
exports.defaultPlotlyConfig = {
    displayModeBar: false,
    doubleClick: 'reset',
    scrollZoom: false,
    showAxisDragHandles: false,
    staticPlot: false,
};
exports.defaultPlotlyLayout = {
    autosize: true,
    dragmode: 'zoom',
    hovermode: 'closest',
    legend: {},
    margin: {
        b: 10,
        l: 40,
        r: 10,
        t: 10,
    },
    showlegend: false,
    title: '',
};
/**
 * React wrapper for a Plotly Chart.
 *
 * @description
 * Based upon: https://github.com/davidctj/react-plotlyjs-ts
 *
 * @export
 * @extends {React.Component<IPlotlyChartProps, any>}
 */
var PlotlyChart = /** @class */ (function (_super) {
    tslib_1.__extends(PlotlyChart, _super);
    function PlotlyChart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.plotlyCanvas = null;
        // Makes sure single click isn't fired when double click is in flight. Required due to https://github.com/plotly/plotly.js/issues/1546
        _this.isDoubleClickInProgress = false;
        _this.canvasRef = null;
        _this.plotlyFormattedData = [];
        /**
         * Sends a draw call to Plotly since it is using canvas/WebGL which is outside of the locus of control for React.
         */
        _this.draw = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a, config, layout, mergedLayout, mergedConfig, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, config = _a.config, layout = _a.layout;
                        if (!(this.plotlyCanvas && this.canvasRef)) return [3 /*break*/, 2];
                        mergedLayout = this.getMergedLayout(layout, this.plotlyFormattedData);
                        mergedConfig = this.getMergedConfig(config);
                        this.plotlyFormattedData.forEach(function (datum) {
                            delete datum.selectedpoints;
                            return datum;
                        });
                        _b = this;
                        return [4 /*yield*/, plotly.react(this.canvasRef, this.plotlyFormattedData, mergedLayout, mergedConfig)];
                    case 1:
                        _b.plotlyCanvas = _c.sent();
                        _c.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Resizes the inner Plotly canvas.
         */
        _this.resize = function () {
            if (_this.plotlyCanvas) {
                plotly.Plots.resize(_this.plotlyCanvas);
            }
        };
        _this.deriveChartPiece = function (xDatum, yDatum, data) {
            var x = xDatum;
            var y = yDatum;
            if (data) {
                var isExtraXAxis = data.xaxis && data.xaxis !== 'x';
                var isExtraYAxis = data.yaxis && data.yaxis !== 'y';
                if (isExtraXAxis || isExtraYAxis) {
                    return {
                        chartPiece: data_1.BIOBLOCKS_CHART_PIECE.AXIS,
                        selectedPoints: isExtraXAxis ? [y] : [x],
                    };
                }
            }
            return {
                chartPiece: data_1.BIOBLOCKS_CHART_PIECE.POINT,
                selectedPoints: [x, y],
            };
        };
        /**
         * Generate axis data for those beyond the original x/yaxis.
         *
         * @param ids All of the axis ids associated with plotly data.
         */
        _this.generateExtraPlotlyAxis = function (ids) {
            return Array.from(ids.values())
                .filter(function (id) { return id.length >= 2; }) // Ignores { xaxis: x } and { yaxis: y }.
                .map(function (id) { return _this.generateExtraPlotlyAxisFromId(id); })
                .reduce(function (prev, curr) {
                return tslib_1.__assign(tslib_1.__assign({}, prev), curr);
            }, {});
        };
        _this.getMergedConfig = function (config) {
            if (config === void 0) { config = {}; }
            var copiedConfig = Immutable.fromJS(tslib_1.__assign({}, exports.defaultPlotlyConfig));
            var immutableConfigFromJs = Immutable.fromJS(tslib_1.__assign({}, config));
            return tslib_1.__assign({}, copiedConfig.mergeDeep(immutableConfigFromJs).toJS());
        };
        _this.getMergedLayout = function (layout, plotlyFormattedData) {
            if (layout === void 0) { layout = {}; }
            if (plotlyFormattedData === void 0) { plotlyFormattedData = []; }
            var copiedLayout = Immutable.fromJS(tslib_1.__assign({}, layout));
            var copiedLayoutFromData = Immutable.fromJS(tslib_1.__assign(tslib_1.__assign({}, exports.defaultPlotlyLayout), _this.deriveAxisParams(plotlyFormattedData)));
            var result = tslib_1.__assign({}, copiedLayoutFromData.mergeDeep(copiedLayout).toJS());
            if (_this.savedAxisZoom && result.xaxis && result.yaxis) {
                result.xaxis.range = _this.savedAxisZoom.xaxis.range;
                result.yaxis.range = _this.savedAxisZoom.yaxis.range;
            }
            else if (_this.savedCameraScene) {
                result.scene = tslib_1.__assign(tslib_1.__assign({}, result.scene), { camera: _this.savedCameraScene });
            }
            return result;
        };
        _this.onAfterPlot = function () {
            var onAfterPlotCallback = _this.props.onAfterPlotCallback;
            if (onAfterPlotCallback) {
                onAfterPlotCallback(new data_1.BioblocksChartEvent(data_1.BIOBLOCKS_CHART_EVENT_TYPE.AFTER_PLOT));
            }
        };
        _this.onClick = function (event) {
            var shouldHandleClick = _this.isDoubleClickInProgress === false && event.points !== undefined && event.points.length > 0;
            if (shouldHandleClick) {
                var onClickCallback = _this.props.onClickCallback;
                if (onClickCallback) {
                    var x = event.points[0].x ? event.points[0].x : event.points[0].data.x[0];
                    var y = event.points[0].y ? event.points[0].y : event.points[0].data.y[0];
                    var _a = _this.deriveChartPiece(x, y, event.points[0].data), chartPiece = _a.chartPiece, selectedPoints = _a.selectedPoints;
                    onClickCallback(new data_1.BioblocksChartEvent(data_1.BIOBLOCKS_CHART_EVENT_TYPE.CLICK, chartPiece, selectedPoints));
                }
            }
        };
        _this.onDoubleClick = function () {
            _this.isDoubleClickInProgress = true;
            var onDoubleClickCallback = _this.props.onDoubleClickCallback;
            if (onDoubleClickCallback) {
                onDoubleClickCallback(new data_1.BioblocksChartEvent(data_1.BIOBLOCKS_CHART_EVENT_TYPE.DOUBLE_CLICK));
            }
        };
        _this.onHover = function (event) {
            var onHoverCallback = _this.props.onHoverCallback;
            if (event.points && event.points[0] && onHoverCallback) {
                var x = event.points[0].x ? event.points[0].x : event.points[0].data.x[0];
                var y = event.points[0].y ? event.points[0].y : event.points[0].data.y[0];
                var _a = _this.deriveChartPiece(x, y, event.points[0].data), chartPiece = _a.chartPiece, selectedPoints = _a.selectedPoints;
                onHoverCallback(new data_1.BioblocksChartEvent(data_1.BIOBLOCKS_CHART_EVENT_TYPE.HOVER, chartPiece, selectedPoints));
            }
        };
        _this.onLegendClick = function (event) {
            var onLegendClickCallback = _this.props.onLegendClickCallback;
            if (onLegendClickCallback) {
                return onLegendClickCallback(new data_1.BioblocksChartEvent(data_1.BIOBLOCKS_CHART_EVENT_TYPE.LEGEND_CLICK, data_1.BIOBLOCKS_CHART_PIECE.LEGEND, [], event));
            }
            return false;
        };
        _this.onRelayout = function (event) {
            // !IMPORTANT! Yes, these properties have to be accessed like this, see:
            // https://plot.ly/javascript/plotlyjs-function-reference/#plotlyrestyle
            // https://github.com/plotly/plotly.js/issues/2843
            _this.isDoubleClickInProgress = false;
            if (event !== undefined && 'scene.camera' in event) {
                // Quick fix to type the camera.
                // Alternatively, the event could have types expanded but that requires more casting/tweaking to handle 2d/3d.
                _this.savedCameraScene = event['scene.camera'];
            }
            else if (event !== undefined) {
                var axisKeys = ['xaxis.range[0]', 'xaxis.range[1]', 'yaxis.range[0]', 'yaxis.range[1]'];
                var isEventFormattedCorrect = event !== undefined && axisKeys.reduce(function (prev, cur) { return prev && event[cur] !== undefined; }, true) === true;
                _this.savedAxisZoom = isEventFormattedCorrect
                    ? {
                        xaxis: {
                            autorange: false,
                            range: [event[axisKeys[0]], event[axisKeys[1]]],
                        },
                        yaxis: {
                            autorange: false,
                            range: [event[axisKeys[2]], event[axisKeys[3]]],
                        },
                    }
                    : undefined;
            }
            var onRelayoutCallback = _this.props.onRelayoutCallback;
            if (onRelayoutCallback) {
                onRelayoutCallback(new data_1.BioblocksChartEvent(data_1.BIOBLOCKS_CHART_EVENT_TYPE.RELAYOUT));
            }
        };
        _this.onSelect = function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var onSelectedCallback, allPoints, chartPiece;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onSelectedCallback = this.props.onSelectedCallback;
                        if (event && onSelectedCallback) {
                            allPoints = new Array();
                            if (event.points.length >= 1) {
                                allPoints = event.points.reduce(function (prev, cur) {
                                    prev.push.apply(prev, tslib_1.__spread([cur.x, cur.y]));
                                    return prev;
                                }, allPoints);
                            }
                            else if (event.range) {
                                // If it is a range, it is a box and so the coordinates can be directly accessed like so.
                                allPoints.push(event.range.x[0], event.range.y[0], event.range.x[1], event.range.y[1]);
                            }
                            chartPiece = (allPoints.length > 0
                                ? this.deriveChartPiece(allPoints[0], allPoints[1])
                                : { chartPiece: data_1.BIOBLOCKS_CHART_PIECE.POINT }).chartPiece;
                            onSelectedCallback(new data_1.BioblocksChartEvent(data_1.BIOBLOCKS_CHART_EVENT_TYPE.SELECTION, chartPiece, allPoints, event));
                        }
                        return [4 /*yield*/, this.draw()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onUnHover = function (event) {
            var onUnHoverCallback = _this.props.onUnHoverCallback;
            if (event && onUnHoverCallback) {
                var _a = event.points[0], data = _a.data, x = _a.x, y = _a.y;
                var _b = _this.deriveChartPiece(x, y, data), chartPiece = _b.chartPiece, selectedPoints = _b.selectedPoints;
                onUnHoverCallback(new data_1.BioblocksChartEvent(data_1.BIOBLOCKS_CHART_EVENT_TYPE.UNHOVER, chartPiece, selectedPoints));
            }
        };
        return _this;
    }
    /**
     * Setup all the event listeners for the plotly canvas.
     */
    PlotlyChart.prototype.attachListeners = function () {
        if (this.plotlyCanvas) {
            this.plotlyCanvas.on('plotly_afterplot', this.onAfterPlot);
            this.plotlyCanvas.on('plotly_click', this.onClick);
            this.plotlyCanvas.on('plotly_doubleclick', this.onDoubleClick);
            this.plotlyCanvas.on('plotly_hover', this.onHover);
            this.plotlyCanvas.on('plotly_legendclick', this.onLegendClick);
            this.plotlyCanvas.on('plotly_relayout', this.onRelayout);
            this.plotlyCanvas.on('plotly_selected', this.onSelect);
            this.plotlyCanvas.on('plotly_unhover', this.onUnHover);
        }
        window.removeEventListener('resize', this.resize);
        window.addEventListener('resize', this.resize);
    };
    PlotlyChart.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, immutableData, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.canvasRef && !this.plotlyCanvas)) return [3 /*break*/, 3];
                        data = this.props.data;
                        immutableData = Immutable.fromJS(data);
                        this.plotlyFormattedData = immutableData.toJS();
                        _a = this;
                        return [4 /*yield*/, plotly.react(this.canvasRef, this.plotlyFormattedData)];
                    case 1:
                        _a.plotlyCanvas = _b.sent();
                        this.attachListeners();
                        return [4 /*yield*/, this.draw()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PlotlyChart.prototype.componentWillUnmount = function () {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
        }
        if (this.plotlyCanvas) {
            plotly.purge(this.plotlyCanvas);
            this.plotlyCanvas = null;
            this.canvasRef = null;
        }
        window.removeEventListener('resize', this.resize);
    };
    /**
     * Determines if we should send a draw call to Plotly based on if data has actually changed.
     *
     * @param prevProps The previous props for the PlotlyChart.
     */
    PlotlyChart.prototype.componentDidUpdate = function (prevProps) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, data, layout, config, isDataEqual;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, data = _a.data, layout = _a.layout, config = _a.config;
                        isDataEqual = data.length === prevProps.data.length;
                        if (isDataEqual) {
                            data.forEach(function (datum, index) {
                                if (!lodash_1.isEqual(datum, prevProps.data[index])) {
                                    isDataEqual = false;
                                    return;
                                }
                            });
                        }
                        if (!(!isDataEqual || !lodash_1.isEqual(layout, prevProps.layout) || !lodash_1.isEqual(config, prevProps.config))) return [3 /*break*/, 2];
                        this.plotlyFormattedData = isDataEqual
                            ? this.plotlyFormattedData
                            : Immutable.fromJS(data).toJS();
                        return [4 /*yield*/, this.draw()];
                    case 1:
                        _b.sent();
                        this.forceUpdate();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PlotlyChart.prototype.render = function () {
        var _this = this;
        var _a = this.props, height = _a.height, showLoader = _a.showLoader, style = _a.style, width = _a.width;
        return (React.createElement(React.Fragment, null,
            showLoader && (React.createElement(semantic_ui_react_1.Dimmer, { active: !this.isDataLoaded() },
                React.createElement(semantic_ui_react_1.Loader, null))),
            React.createElement("div", { className: 'plotly-chart', ref: function (node) { return (_this.canvasRef = node ? node : null); }, style: tslib_1.__assign(tslib_1.__assign({ marginBottom: 5 }, style), { height: height, width: width }) })));
    };
    /**
     * Create [0-n] plotly axes given some plotly data.
     *
     * @param allData The already formatted Plotly data - meaning each data should have the proper axis already assigned.
     * @returns A object containing xaxis and yaxis fields, as well as xaxis# and yaxis# fields where # is derived from the given data.
     */
    PlotlyChart.prototype.deriveAxisParams = function (allData) {
        var e_1, _a;
        var uniqueXAxisIds = new Set();
        var uniqueYAxisIds = new Set();
        try {
            for (var allData_1 = tslib_1.__values(allData), allData_1_1 = allData_1.next(); !allData_1_1.done; allData_1_1 = allData_1.next()) {
                var data = allData_1_1.value;
                var xaxis = data.xaxis, yaxis = data.yaxis;
                if (xaxis) {
                    uniqueXAxisIds.add(xaxis);
                }
                if (yaxis) {
                    uniqueYAxisIds.add(yaxis);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (allData_1_1 && !allData_1_1.done && (_a = allData_1.return)) _a.call(allData_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // TODO Have the spacing number - 0.05 - be configurable. Requires some design work to look good for various numbers of total axes.
        return tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, this.generateExtraPlotlyAxis(uniqueXAxisIds)), this.generateExtraPlotlyAxis(uniqueYAxisIds)), { xaxis: {
                domain: [0, 1 - uniqueXAxisIds.size * 0.05],
                zeroline: false,
            }, yaxis: {
                domain: [0, 1 - uniqueXAxisIds.size * 0.05],
                zeroline: false,
            } });
    };
    PlotlyChart.prototype.generateExtraPlotlyAxisFromId = function (id) {
        var _a;
        var axisId = id.substr(0, 1);
        var axisNum = Number.parseInt(id.substr(1), 10);
        return _a = {},
            _a[axisId + "axis" + axisNum] = {
                // TODO Have this number - 0.05 - be configurable. Requires some design work to look good for various numbers of total axes.
                domain: [1 - (axisNum - 1) * 0.05, 1 - (axisNum - 2) * 0.05],
                fixedrange: true,
                visible: false,
            },
            _a;
    };
    /**
     * Is the data ready to be plotted?
     */
    PlotlyChart.prototype.isDataLoaded = function () {
        var isLoadedFn = function (plotlyData) {
            return plotlyData.filter(function (dataPoint) { return (dataPoint.x && dataPoint.x.length >= 1) || (dataPoint.xy && dataPoint.xy.length >= 1); }).length > 0;
        };
        return isLoadedFn(this.props.data) || isLoadedFn(this.plotlyFormattedData);
    };
    PlotlyChart.defaultProps = {
        config: {},
        data: [],
        height: '100%',
        layout: {},
        showLoader: true,
        width: '100%',
    };
    return PlotlyChart;
}(React.Component));
exports.PlotlyChart = PlotlyChart;
//# sourceMappingURL=PlotlyChart.js.map