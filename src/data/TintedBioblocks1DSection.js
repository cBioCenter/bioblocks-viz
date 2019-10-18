"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("~bioblocks-viz~/data");
/**
 * Class to encapsulate a 1 Dimensional data segment that has an associated color with it.
 *
 * @export
 * @extends Bioblocks1DSection
 */
var TintedBioblocks1DSection = /** @class */ (function (_super) {
    tslib_1.__extends(TintedBioblocks1DSection, _super);
    function TintedBioblocks1DSection(label, start, end, color) {
        if (end === void 0) { end = start; }
        if (color === void 0) { color = 'orange'; }
        var _this = _super.call(this, label, start, end) || this;
        _this.label = label;
        _this.sectionColor = 'orange';
        _this.sectionColor = color;
        return _this;
    }
    Object.defineProperty(TintedBioblocks1DSection.prototype, "color", {
        get: function () {
            return this.sectionColor;
        },
        enumerable: true,
        configurable: true
    });
    TintedBioblocks1DSection.prototype.updateColor = function (color) {
        this.sectionColor = color;
    };
    return TintedBioblocks1DSection;
}(data_1.Bioblocks1DSection));
exports.TintedBioblocks1DSection = TintedBioblocks1DSection;
//# sourceMappingURL=TintedBioblocks1DSection.js.map