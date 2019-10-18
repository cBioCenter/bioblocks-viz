"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// tslint:disable-next-line: no-submodule-imports
var plotly = require("plotly.js/lib/index-gl2d");
module.exports = tslib_1.__assign(tslib_1.__assign({}, plotly), { Plots: {
        resize: function () { return jest.fn(); },
    }, newPlot: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return mockCanvas;
    }, purge: jest.fn(), react: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return mockCanvas;
    } });
var MockPlotlyHTMLElement = /** @class */ (function () {
    function MockPlotlyHTMLElement() {
        var _this = this;
        this.callbacks = new Map();
        this.on = function (event, callback) {
            _this.callbacks.set(event, callback);
        };
    }
    MockPlotlyHTMLElement.prototype.dispatchEvent = function (event, data) {
        var cb = this.callbacks.get(event.type);
        if (cb) {
            switch (event.type) {
                case 'plotly_click':
                case 'plotly_hover':
                case 'plotly_unhover':
                    cb({ points: [tslib_1.__assign({}, data)] });
                    break;
                case 'plotly_selected':
                    cb(data);
                    break;
                default:
                    cb();
            }
        }
        return true;
    };
    return MockPlotlyHTMLElement;
}());
exports.MockPlotlyHTMLElement = MockPlotlyHTMLElement;
var mockCanvas = new MockPlotlyHTMLElement();
//# sourceMappingURL=plotly.js.map