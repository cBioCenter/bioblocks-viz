"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var helper_1 = require("~bioblocks-viz~/helper");
/**
 * Class to represent an extra x and/or y axis for a Plotly chart.
 */
var AuxiliaryAxis = /** @class */ (function () {
    /**
     * Creates an instance of AuxiliaryAxis.
     * @param sections The underlying data to be represented by these axes.
     * @param [axisIndex=2] The index of this axis, if there are multiple auxiliary axes.
     * @param [colorMap] Allows specific data pieces to be colored and provide a default color.
     * @param [dataTransformFn] Determine how a section is to be transformed to the main and opposite axis.
     *  For example, for a sine wave, the main axis increments by 1 but the opposite needs to be increased by a Math.sin() call.
     * @param [filterFn=() => false] Function to allow certain elements to be filtered out and thus not show up on the axis.
     */
    function AuxiliaryAxis(sections, axisIndex, colorMap, dataTransformFn, filterFn) {
        var _this = this;
        if (axisIndex === void 0) { axisIndex = 2; }
        if (colorMap === void 0) { colorMap = new helper_1.ColorMapper(); }
        if (filterFn === void 0) { filterFn = function () { return false; }; }
        this.sections = sections;
        this.axisIndex = axisIndex;
        this.colorMap = colorMap;
        this.dataTransformFn = dataTransformFn;
        this.filterFn = filterFn;
        this.axes = new Map();
        this.highlightedAxes = new Map();
        /**
         * Plotly data specific for the x axis.
         *
         * @param key The label for this piece of data.
         */
        this.generateXAxisSegment = function (key) { return (tslib_1.__assign(tslib_1.__assign({}, _this.auxiliaryAxisDefaults(key)), { orientation: 'h', xaxis: 'x', yaxis: "y" + _this.axisIndex })); };
        /**
         * Plotly data specific for the highlighted x axis.
         *
         * @param key The label for this piece of data.
         */
        this.generateHighlightedXAxisSegment = function (key) { return (tslib_1.__assign(tslib_1.__assign({}, _this.highlightedAuxiliaryAxisDefaults(key)), { orientation: 'h', xaxis: 'x', yaxis: "y" + _this.axisIndex })); };
        /**
         * Plotly data specific for the y axis.
         *
         * @param key The label for this piece of data.
         */
        this.generateYAxisSegment = function (key) { return (tslib_1.__assign(tslib_1.__assign({}, _this.auxiliaryAxisDefaults(key)), { orientation: 'v', xaxis: "x" + _this.axisIndex, yaxis: 'y' })); };
        /**
         * Plotly data specific for the highlighted y axis.
         *
         * @param key The label for this piece of data.
         */
        this.generateHighlightedYAxisSegment = function (key) { return (tslib_1.__assign(tslib_1.__assign({}, _this.highlightedAuxiliaryAxisDefaults(key)), { orientation: 'v', xaxis: "x" + _this.axisIndex, yaxis: 'y' })); };
        /**
         * Default plotly data for an axis.
         *
         * @param key The label for this piece of data.
         */
        this.auxiliaryAxisDefaults = function (key) { return ({
            connectgaps: false,
            hoverinfo: 'none',
            line: {
                color: _this.colorMap.getColorFor(key),
                shape: 'spline',
                smoothing: 1.3,
                width: 1.5,
            },
            marker: {
                symbol: [],
            },
            mode: 'lines',
            name: key,
            showlegend: false,
            type: 'scatter',
            x: [],
            y: [],
        }); };
        /**
         * Default plotly data for a highlighted axis.
         *
         * @param key The label for this piece of data.
         */
        this.highlightedAuxiliaryAxisDefaults = function (key) { return (tslib_1.__assign(tslib_1.__assign({}, _this.auxiliaryAxisDefaults(key)), { fill: 'toself', line: {
                color: _this.colorMap.getColorFor(key),
                width: 0,
            } })); };
        /**
         * Determines the points that make up the axis for both the main and opposite axis side.
         * @param section The section of data to derive points for.
         */
        this.derivePointsInAxis = function (section) {
            var result = {
                main: [section.start],
                opposite: [null],
            };
            for (var i = section.start; i <= section.end; ++i) {
                var transformResult = _this.dataTransformFn && _this.dataTransformFn[section.label]
                    ? _this.dataTransformFn[section.label](section, i)
                    : { main: i, opposite: -1 };
                result.main.push(transformResult.main);
                result.opposite.push(transformResult.opposite);
            }
            result.main.push(section.end);
            result.opposite.push(null);
            return result;
        };
        this.deriveHighlightedPointsInAxis = function (section) {
            var result = {
                main: [section.start],
                opposite: [null],
            };
            result.main.push(section.start);
            result.opposite.push(-1);
            result.main.push(section.start);
            result.opposite.push(1);
            result.main.push(section.end);
            result.opposite.push(1);
            result.main.push(section.end);
            result.opposite.push(-1);
            result.main.push(section.end);
            result.opposite.push(null);
            return result;
        };
        this.setupAuxiliaryAxis();
    }
    Object.defineProperty(AuxiliaryAxis.prototype, "axis", {
        /**
         * Get all the axis objects belonging to this Auxiliary Axis.
         */
        get: function () {
            return this.axes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxiliaryAxis.prototype, "xAxes", {
        /**
         * Get all the x-axis objects belonging to this Auxiliary Axis.
         */
        get: function () {
            var result = new Array();
            this.axes.forEach(function (value) {
                result.push(value.x);
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxiliaryAxis.prototype, "highlightedXAxes", {
        /**
         * Get all the highlighted x-axis objects belonging to this Auxiliary Axis.
         */
        get: function () {
            var result = new Array();
            this.highlightedAxes.forEach(function (value) {
                result.push(value.x);
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxiliaryAxis.prototype, "yAxes", {
        /**
         * Get all the y-axis objects belonging to this Auxiliary Axis.
         */
        get: function () {
            var result = new Array();
            this.axes.forEach(function (value) {
                result.push(value.y);
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuxiliaryAxis.prototype, "highlightedYAxes", {
        /**
         * Get all the highlighted y-axis objects belonging to this Auxiliary Axis.
         */
        get: function () {
            var result = new Array();
            this.highlightedAxes.forEach(function (value) {
                result.push(value.y);
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    AuxiliaryAxis.prototype.getAxisById = function (id) {
        return this.axes.get(id);
    };
    /**
     * Create the Auxiliary Axis.
     */
    AuxiliaryAxis.prototype.setupAuxiliaryAxis = function () {
        var e_1, _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            for (var _k = tslib_1.__values(this.sections), _l = _k.next(); !_l.done; _l = _k.next()) {
                var section = _l.value;
                if (this.filterFn(section)) {
                    continue;
                }
                var label = section.label;
                if (!this.axes.has(label)) {
                    this.axes.set(label, {
                        x: this.generateXAxisSegment(label),
                        y: this.generateYAxisSegment(label),
                    });
                }
                if (!this.highlightedAxes.has(label)) {
                    this.highlightedAxes.set(label, {
                        x: this.generateHighlightedXAxisSegment(label),
                        y: this.generateHighlightedYAxisSegment(label),
                    });
                }
                var labelAxis = this.axes.get(label);
                var highlightAxis = this.highlightedAxes.get(label);
                if (labelAxis && highlightAxis) {
                    var points = this.derivePointsInAxis(section);
                    (_b = labelAxis.x.x).push.apply(_b, tslib_1.__spread(points.main));
                    (_c = labelAxis.x.y).push.apply(_c, tslib_1.__spread(points.opposite));
                    (_d = labelAxis.y.y).push.apply(_d, tslib_1.__spread(points.main));
                    (_e = labelAxis.y.x).push.apply(_e, tslib_1.__spread(points.opposite));
                    var highlightedPoints = this.deriveHighlightedPointsInAxis(section);
                    (_f = highlightAxis.x.x).push.apply(_f, tslib_1.__spread(highlightedPoints.main));
                    (_g = highlightAxis.x.y).push.apply(_g, tslib_1.__spread(highlightedPoints.opposite));
                    (_h = highlightAxis.y.y).push.apply(_h, tslib_1.__spread(highlightedPoints.main));
                    (_j = highlightAxis.y.x).push.apply(_j, tslib_1.__spread(highlightedPoints.opposite));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_l && !_l.done && (_a = _k.return)) _a.call(_k);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return AuxiliaryAxis;
}());
exports.AuxiliaryAxis = AuxiliaryAxis;
//# sourceMappingURL=AuxiliaryAxis.js.map