"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// tslint:disable-next-line:no-relative-imports
var _1 = require("./");
var helper_1 = require("~bioblocks-viz~/helper");
/**
 * Class to represent the x and y axis for a secondary structure on a Plotly graph.
 *
 * @export
 */
var SecondaryStructureAxis = /** @class */ (function (_super) {
    tslib_1.__extends(SecondaryStructureAxis, _super);
    function SecondaryStructureAxis(sections, minimumRequiredResidues, axisIndex, colorMap, dataTransformFn, filterFn) {
        if (minimumRequiredResidues === void 0) { minimumRequiredResidues = 3; }
        if (axisIndex === void 0) { axisIndex = 2; }
        if (colorMap === void 0) { colorMap = new helper_1.ColorMapper(new Map([['C', 'red'], ['E', 'green'], ['H', 'blue']]), 'black'); }
        if (dataTransformFn === void 0) { dataTransformFn = {
            C: SecondaryStructureAxis.centerSectionPositionFn,
            E: SecondaryStructureAxis.centerSectionPositionFn,
            H: function (section, index) { return ({
                main: index,
                opposite: Math.sin(index),
            }); },
        }; }
        if (filterFn === void 0) { filterFn = function (section) { return section.length <= minimumRequiredResidues; }; }
        var _this = _super.call(this, sections, axisIndex, colorMap, dataTransformFn) || this;
        _this.sections = sections;
        _this.minimumRequiredResidues = minimumRequiredResidues;
        _this.axisIndex = axisIndex;
        _this.colorMap = colorMap;
        _this.dataTransformFn = dataTransformFn;
        _this.filterFn = filterFn;
        return _this;
    }
    SecondaryStructureAxis.prototype.setupAuxiliaryAxis = function () {
        _super.prototype.setupAuxiliaryAxis.call(this);
        var sheetAxis = this.getAxisById('E');
        var BLANK_LINE = 'line-ne';
        var TRIANGLE_RIGHT = 'triangle-right';
        var TRIANGLE_DOWN = 'triangle-down';
        if (sheetAxis && sheetAxis.x.x && sheetAxis.x.y) {
            var symbols = {
                main: new Array(sheetAxis.x.x.length).fill(BLANK_LINE),
                opposite: new Array(sheetAxis.x.x.length).fill(BLANK_LINE),
            };
            for (var i = 1; i < sheetAxis.x.x.length - 1; ++i) {
                if (sheetAxis.x.y[i + 1] === null) {
                    symbols.main[i] = TRIANGLE_RIGHT;
                    symbols.opposite[i] = TRIANGLE_DOWN;
                }
            }
            sheetAxis.x = tslib_1.__assign(tslib_1.__assign({}, sheetAxis.x), this.generateBetaSheetStyle(sheetAxis.x, symbols.main));
            sheetAxis.y = tslib_1.__assign(tslib_1.__assign({}, sheetAxis.y), this.generateBetaSheetStyle(sheetAxis.y, symbols.opposite));
        }
    };
    /**
     * Generate the Plotly layout specific to beta sheet representation.
     *
     * @param data Data for this axis.
     * @param symbols The symbols that make up this axis. Should be an array of empty lines with an arrow at the end.
     * @returns Plotly layout specific to beta sheet representation.
     */
    SecondaryStructureAxis.prototype.generateBetaSheetStyle = function (data, symbols) {
        return {
            line: tslib_1.__assign(tslib_1.__assign({}, data.line), { width: 5 }),
            marker: tslib_1.__assign(tslib_1.__assign({}, data.marker), { color: this.colorMap.getColorFor('E'), size: 10, symbol: symbols }),
            mode: 'lines+markers',
        };
    };
    SecondaryStructureAxis.centerSectionPositionFn = function (section, index) { return ({
        main: index,
        opposite: 0,
    }); };
    return SecondaryStructureAxis;
}(_1.AuxiliaryAxis));
exports.SecondaryStructureAxis = SecondaryStructureAxis;
//# sourceMappingURL=SecondaryStructureAxis.js.map