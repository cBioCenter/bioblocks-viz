"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var immutable_1 = require("immutable");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var FeatureViewer = /** @class */ (function (_super) {
    tslib_1.__extends(FeatureViewer, _super);
    function FeatureViewer(props) {
        var _this = _super.call(this, props) || this;
        _this.onFeatureHover = function (event) {
            var e_1, _a;
            var _b = _this.props, data = _b.data, getTextForHover = _b.getTextForHover;
            var hoveredFeatureIndex = -1;
            // TODO Handle vertical viewer, better selection logic.
            var xCoords = [event.selectedPoints[0], event.selectedPoints[2]];
            for (var i = 0; i < data.length; ++i) {
                try {
                    for (var xCoords_1 = (e_1 = void 0, tslib_1.__values(xCoords)), xCoords_1_1 = xCoords_1.next(); !xCoords_1_1.done; xCoords_1_1 = xCoords_1.next()) {
                        var xCoord = xCoords_1_1.value;
                        if (data[i].contains(xCoord)) {
                            hoveredFeatureIndex = i;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (xCoords_1_1 && !xCoords_1_1.done && (_a = xCoords_1.return)) _a.call(xCoords_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            _this.setState({
                hoverAnnotationText: getTextForHover && hoveredFeatureIndex >= 0
                    ? getTextForHover(data[hoveredFeatureIndex].label, hoveredFeatureIndex)
                    : '',
                hoveredFeatureIndex: hoveredFeatureIndex,
            });
        };
        _this.onFeatureClick = function (event) {
            var _a = _this.props, data = _a.data, onClickCallback = _a.onClickCallback;
            var selectedFeatureIndices = _this.deriveFeatureIndices(data, event.selectedPoints);
            if (onClickCallback) {
                onClickCallback(_this.deriveSelectedFeatures(data, selectedFeatureIndices.toArray()));
            }
            _this.setState({
                selectedFeatureIndices: selectedFeatureIndices,
                selectedRange: new data_1.Bioblocks1DSection('selection', -1, -1),
            });
        };
        _this.onFeatureSelect = function (event) {
            var _a = _this.props, data = _a.data, onSelectCallback = _a.onSelectCallback;
            var selectedFeatureIndices = _this.deriveFeatureIndices(data, event.selectedPoints);
            var plotlyEvent = event.plotlyEvent;
            var selectedRange = _this.state.selectedRange;
            if (plotlyEvent.range) {
                selectedRange = new data_1.Bioblocks1DSection('selection', Math.floor(plotlyEvent.range.x[0]), Math.ceil(plotlyEvent.range.x[1]));
                var selection = {
                    end: selectedRange.end,
                    featuresSelected: _this.deriveSelectedFeatures(data, selectedFeatureIndices.toArray()),
                    length: selectedRange.length,
                    start: selectedRange.start,
                };
                if (onSelectCallback) {
                    onSelectCallback(selection);
                }
            }
            _this.setState({
                selectedFeatureIndices: selectedFeatureIndices,
                selectedRange: selectedRange,
            });
        };
        /**
         * Derive the indices of the Features from the points the user selected.
         */
        _this.deriveFeatureIndices = function (data, userSelectedPoints) {
            var featureIndices = immutable_1.Set();
            var _loop_1 = function (i) {
                var xCoord = userSelectedPoints[i];
                data
                    .reduce(function (result, datum, index) { return (datum.contains(xCoord) ? tslib_1.__spread(result, [index]) : result); }, new Array())
                    .forEach(function (indexToAdd) {
                    featureIndices = featureIndices.add(indexToAdd);
                });
            };
            // Points come to us as [x0, y0, x1, y1, ..., xn, yn], so we skip every other point.
            for (var i = 0; i < userSelectedPoints.length; i += 2) {
                _loop_1(i);
            }
            return featureIndices;
        };
        /**
         * Shorthand to get the raw section data for a set of Features given some indices.
         */
        _this.deriveSelectedFeatures = function (data, selectedFeatureIndices) {
            return selectedFeatureIndices.map(function (index) { return new data_1.Bioblocks1DSection(data[index].label, data[index].start, data[index].end); });
        };
        _this.state = {
            hoverAnnotationText: '',
            hoveredFeatureIndex: -1,
            plotlyConfig: {
                showAxisDragHandles: false,
                showAxisRangeEntryBoxes: false,
            },
            plotlyData: [],
            plotlyLayout: {},
            selectedFeatureIndices: immutable_1.Set(),
            selectedRange: new data_1.Bioblocks1DSection('selection', -1, -1),
        };
        return _this;
    }
    FeatureViewer.getDerivedStateFromProps = function (nextProps, nextState) {
        var backgroundBar = nextProps.backgroundBar, data = nextProps.data, height = nextProps.height, maxLength = nextProps.maxLength, showGrouped = nextProps.showGrouped, title = nextProps.title, width = nextProps.width;
        var hoverAnnotationText = nextState.hoverAnnotationText, hoveredFeatureIndex = nextState.hoveredFeatureIndex, selectedRange = nextState.selectedRange;
        var maxGroups = -1;
        var groupData = data.map(function (datum, index) {
            var yIndex = showGrouped
                ? index
                : data.findIndex(function (candidateDatum) { return datum.label.localeCompare(candidateDatum.label) === 0; });
            maxGroups = Math.max(maxGroups, yIndex);
            return FeatureViewer.getPlotlyDataObject(datum, showGrouped, yIndex);
        });
        var backgroundBarData = FeatureViewer.getPlotlyBackgroundBarObject(backgroundBar
            ? backgroundBar
            : new data_1.TintedBioblocks1DSection('', 0, data.reduce(function (prev, cur) { return Math.max(prev, cur.end); }, -1), '#b9bcb6'), showGrouped, maxGroups / 2);
        var selectionData = {
            fill: 'toself',
            hoverinfo: 'none',
            line: {
                width: 0,
            },
            marker: {
                color: '#f9f69f',
                opacity: 0.5,
            },
            mode: 'lines+markers',
            showlegend: false,
            x: selectedRange.start !== -1 && selectedRange.end !== -1
                ? [selectedRange.start, selectedRange.end, selectedRange.end, selectedRange.start]
                : [],
            y: [0, 0, maxGroups + 1, maxGroups + 1],
        };
        var plotlyData = tslib_1.__spread([backgroundBarData, selectionData], groupData);
        return {
            plotlyData: plotlyData,
            plotlyLayout: {
                annotations: FeatureViewer.getAnnotationPlotlyData(hoveredFeatureIndex, hoverAnnotationText, plotlyData[hoveredFeatureIndex]),
                dragmode: 'select',
                height: height,
                hovermode: 'closest',
                margin: {
                    b: 30,
                    t: 60,
                },
                showlegend: false,
                title: title,
                width: width,
                xaxis: data.length > 0
                    ? {
                        autorange: false,
                        fixedrange: true,
                        range: [0, maxLength ? maxLength : data.reduce(function (prev, cur) { return Math.max(prev, cur.end); }, -1) + 200],
                        showgrid: false,
                        tick0: 0,
                        tickmode: 'auto',
                        ticks: 'outside',
                    }
                    : { visible: false },
                yaxis: {
                    autorange: false,
                    fixedrange: true,
                    range: [-0.25, showGrouped ? 2 : data.length],
                    visible: false,
                },
            },
        };
    };
    FeatureViewer.getBoxForBioblocksSection = function (datum) {
        return [
            datum.end - (datum.end - datum.start) / 2,
            null,
            datum.start,
            datum.start,
            datum.end,
            datum.end,
            datum.start,
        ];
    };
    FeatureViewer.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height;
        var _b = this.state, plotlyConfig = _b.plotlyConfig, plotlyData = _b.plotlyData, plotlyLayout = _b.plotlyLayout;
        return (React.createElement("div", { style: { height: height, width: width } },
            React.createElement(component_1.PlotlyChart, { config: plotlyConfig, data: plotlyData, layout: plotlyLayout, onClickCallback: this.onFeatureClick, onHoverCallback: this.onFeatureHover, onSelectedCallback: this.onFeatureSelect, showLoader: false })));
    };
    FeatureViewer.defaultProps = {
        data: [],
        height: 200,
        showGrouped: false,
        title: '',
        width: 600,
    };
    FeatureViewer.getAnnotationPlotlyData = function (hoveredFeatureIndex, text, hoveredDatum) {
        return hoveredFeatureIndex >= 0 && hoveredDatum.x && hoveredDatum.y
            ? [
                {
                    align: 'left',
                    arrowhead: 0,
                    arrowsize: 1,
                    arrowwidth: 1,
                    ax: 0,
                    ay: -25,
                    bgcolor: '#ffffff',
                    bordercolor: '#000000',
                    borderpad: 5,
                    showarrow: true,
                    text: text,
                    x: hoveredDatum.x[0],
                    xref: 'x',
                    y: hoveredDatum.y[hoveredDatum.y.length - 3],
                    yref: 'y',
                },
            ]
            : [];
    };
    FeatureViewer.getPlotlyBackgroundBarObject = function (datum, showGrouped, yIndex) { return (tslib_1.__assign(tslib_1.__assign({}, FeatureViewer.getPlotlyDataObject(datum, showGrouped, yIndex)), { y: showGrouped
            ? [0.25, null, 0.25, 0.75, 0.75, 0.25, 0.25]
            : [yIndex + 0.5, null, yIndex + 1, yIndex, yIndex, yIndex + 1, yIndex + 1] })); };
    FeatureViewer.getPlotlyDataObject = function (datum, showGrouped, yIndex) { return ({
        fill: 'toself',
        fillcolor: datum.color.toString(),
        hoverinfo: 'none',
        hoveron: 'fills',
        line: {
            width: 0,
        },
        mode: 'text+lines',
        name: "" + datum.label,
        text: [datum.label],
        textfont: { color: ['#FFFFFF'] },
        type: 'scatter',
        // Creates a 'box' so we can fill it and hover over it and add a point to the middle for the label.
        x: FeatureViewer.getBoxForBioblocksSection(datum),
        y: showGrouped
            ? [0.5, null, 0, 1, 1, 0, 0]
            : [yIndex + 0.5, null, yIndex + 1, yIndex, yIndex, yIndex + 1, yIndex + 1],
    }); };
    return FeatureViewer;
}(React.Component));
exports.FeatureViewer = FeatureViewer;
//# sourceMappingURL=FeatureViewer.js.map