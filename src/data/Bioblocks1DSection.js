"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Class to encapsulate a 1 Dimensional data segment.
 * This is defined as a numerical range with inclusive start, inclusive end, and label associated with it.
 * Additionally, a Section is defined such that [start <= end] - meaning values will be flipped to keep this constraint.
 *
 * @export
 */
var Bioblocks1DSection = /** @class */ (function () {
    function Bioblocks1DSection(label, start, end) {
        if (end === void 0) { end = start; }
        this.label = label;
        this.sectionEnd = 0;
        this.sectionStart = 0;
        this.sectionEnd = Math.max(end, start);
        this.sectionStart = Math.min(start, end);
    }
    Object.defineProperty(Bioblocks1DSection.prototype, "end", {
        get: function () {
            return this.sectionEnd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bioblocks1DSection.prototype, "length", {
        get: function () {
            return this.sectionEnd - this.sectionStart + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bioblocks1DSection.prototype, "start", {
        get: function () {
            return this.sectionStart;
        },
        enumerable: true,
        configurable: true
    });
    Bioblocks1DSection.prototype.contains = function () {
        var e_1, _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        try {
            for (var values_1 = tslib_1.__values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                var value = values_1_1.value;
                if (value < this.sectionStart || value > this.sectionEnd || value === undefined) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    Bioblocks1DSection.prototype.isEqual = function (otherSection) {
        return otherSection.end === this.end && otherSection.label === this.label && otherSection.start === this.start;
    };
    Bioblocks1DSection.prototype.updateStart = function (newNum) {
        if (newNum > this.sectionEnd) {
            this.sectionStart = this.sectionEnd;
            this.sectionEnd = newNum;
        }
        else {
            this.sectionStart = newNum;
        }
    };
    Bioblocks1DSection.prototype.updateEnd = function (newNum) {
        if (newNum < this.sectionStart) {
            this.sectionEnd = this.sectionStart;
            this.sectionStart = newNum;
        }
        else {
            this.sectionEnd = newNum;
        }
    };
    return Bioblocks1DSection;
}());
exports.Bioblocks1DSection = Bioblocks1DSection;
//# sourceMappingURL=Bioblocks1DSection.js.map