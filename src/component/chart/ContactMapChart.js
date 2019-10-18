"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var component_1 = require("~bioblocks-viz~/component");
var helper_1 = require("~bioblocks-viz~/helper");
exports.generateChartDataEntry = function (hoverinfo, color, name, subtitle, nodeSize, points, extra) {
    if (extra === void 0) { extra = {}; }
    return (tslib_1.__assign({ hoverinfo: hoverinfo, marker: typeof color === 'string'
            ? { color: new Array(points.length * 2).fill(color) }
            : {
                colorscale: [[0, color.start], [1, color.end]],
            }, mode: 'lines+markers', name: name,
        nodeSize: nodeSize,
        points: points,
        subtitle: subtitle }, extra));
};
/**
 * Intermediary between a ContactMap and a PlotlyChart.
 *
 * Will transform data and setup layout from science/bioblocks into a format suitable for Plotly consumption.
 * @extends {React.Component<IContactMapChartProps, any>}
 */
var ContactMapChart = /** @class */ (function (_super) {
    tslib_1.__extends(ContactMapChart, _super);
    function ContactMapChart(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleLegendVisibility = function () {
            _this.setState({
                showlegend: !_this.state.showlegend,
            });
        };
        _this.state = {
            numLegends: 0,
            plotlyData: [],
            showlegend: false,
        };
        return _this;
    }
    ContactMapChart.prototype.componentDidMount = function () {
        this.setupData();
    };
    ContactMapChart.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, contactData = _a.contactData, secondaryStructures = _a.secondaryStructures, selectedSecondaryStructures = _a.selectedSecondaryStructures;
        if (prevProps.contactData !== contactData ||
            prevProps.secondaryStructures !== secondaryStructures ||
            prevProps.selectedSecondaryStructures !== selectedSecondaryStructures) {
            this.setupData();
        }
    };
    ContactMapChart.prototype.render = function () {
        var _a = this.props, configurations = _a.configurations, contactData = _a.contactData, isDataLoading = _a.isDataLoading, legendModifiers = _a.legendModifiers, marginModifiers = _a.marginModifiers, range = _a.range, showConfigurations = _a.showConfigurations, passThroughProps = tslib_1.__rest(_a, ["configurations", "contactData", "isDataLoading", "legendModifiers", "marginModifiers", "range", "showConfigurations"]);
        var _b = this.state, plotlyData = _b.plotlyData, showlegend = _b.showlegend;
        return (React.createElement(component_1.PlotlyChart, tslib_1.__assign({ data: plotlyData, showLoader: isDataLoading, layout: {
                legend: {
                    orientation: 'h',
                    y: legendModifiers.y,
                    yanchor: 'bottom',
                },
                margin: {
                    b: marginModifiers.b,
                    l: marginModifiers.l,
                },
                showlegend: showlegend,
                xaxis: {
                    fixedrange: true,
                    nticks: 10,
                    range: [0, range],
                    rangemode: 'nonnegative',
                    showline: true,
                    tickmode: 'auto',
                    title: 'Residue #',
                },
                yaxis: {
                    fixedrange: true,
                    nticks: 10,
                    range: [range, 0],
                    rangemode: 'nonnegative',
                    showline: true,
                    tickmode: 'auto',
                    title: 'Residue #',
                },
            } }, passThroughProps)));
    };
    /**
     * Sets up the chart and axis data for the ContactMap.
     *
     * Transforms all data from bioblocks terminology to data properly formatted for Plotly consumption.
     */
    ContactMapChart.prototype.setupData = function () {
        var _a = this.props, contactData = _a.contactData, dataTransformFn = _a.dataTransformFn, secondaryStructures = _a.secondaryStructures, secondaryStructureColors = _a.secondaryStructureColors, selectedSecondaryStructures = _a.selectedSecondaryStructures;
        var plotlyData = tslib_1.__spread(contactData.map(function (entry) { return dataTransformFn(entry, true); }));
        secondaryStructures.forEach(function (secondaryStructure, index) {
            var axis = new component_1.SecondaryStructureAxis(secondaryStructure, 3, index + 2, secondaryStructureColors);
            plotlyData.push.apply(plotlyData, tslib_1.__spread(axis.xAxes, axis.yAxes));
        });
        var highlightedAxes = new Array();
        selectedSecondaryStructures.forEach(function (selectedStructure, index) {
            var axis = new component_1.AuxiliaryAxis(selectedStructure, index + 2, new helper_1.ColorMapper(new Map(), 'orange'));
            highlightedAxes.push.apply(highlightedAxes, tslib_1.__spread(axis.highlightedXAxes, axis.highlightedYAxes));
        });
        this.setState({
            numLegends: new Set(plotlyData.filter(function (datum) { return datum.showlegend !== false && datum.name !== undefined; }).map(function (legend) { return legend.name; })).size,
            // Makes sure that highlighted axis is behind the axis.
            plotlyData: tslib_1.__spread(highlightedAxes, plotlyData),
        });
    };
    ContactMapChart.defaultProps = {
        configurations: new Array(),
        dataTransformFn: helper_1.generateScatterGLData,
        height: '100%',
        isDataLoading: false,
        legendModifiers: {
            y: -0.4,
        },
        marginModifiers: {
            b: 67,
            l: 67,
        },
        range: 33000,
        secondaryStructures: [],
        selectedSecondaryStructures: [],
        selectedSecondaryStructuresColor: '#feb83f',
        showConfigurations: true,
        width: '100%',
    };
    return ContactMapChart;
}(React.Component));
exports.ContactMapChart = ContactMapChart;
//# sourceMappingURL=ContactMapChart.js.map