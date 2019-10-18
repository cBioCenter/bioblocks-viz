"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var data_1 = require("~bioblocks-viz~/data");
/**
 * Helper function to create and wait for a Component to be mounted.
 *
 * @param Component The component to mount.
 * @returns A wrapper for the component.
 */
exports.getAsyncMountedComponent = function (Component) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var wrapper;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wrapper = enzyme_1.mount(Component);
                wrapper.update();
                return [4 /*yield*/, exports.flushPromises()];
            case 1:
                _a.sent();
                return [2 /*return*/, wrapper];
        }
    });
}); };
/**
 * Helper function to create and wait for a Component via enzyme's shallow render method..
 *
 * @param Component The component to mount.
 * @returns A wrapper for the component.
 */
exports.getAsyncShallowComponent = function (Component) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var wrapper;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wrapper = enzyme_1.shallow(Component);
                wrapper.update();
                return [4 /*yield*/, exports.flushPromises()];
            case 1:
                _a.sent();
                return [2 /*return*/, wrapper];
        }
    });
}); };
/**
 * Helper function to dispatch an event through plotly.
 *
 * @param wrapper The PlotlyChart.
 * @param eventName The name of the event to dispatch.
 * @param [data={ x: 0, y: 0 }] Custom plotly data for the event.
 */
exports.dispatchPlotlyEvent = function (wrapper, eventName, data) {
    if (data === void 0) { data = { x: [0], y: [0] }; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var plotlyWrapper, canvas;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plotlyWrapper = wrapper.find('PlotlyChart');
                    canvas = plotlyWrapper.instance().plotlyCanvas;
                    if (canvas) {
                        canvas.dispatchEvent(new Event(eventName), data);
                    }
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
/**
 * Helper function to dispatch an event through plotly.
 *
 * @param wrapper The PlotlyChart.
 * @param eventName The name of the event to dispatch.
 * @param [data={ x: 0, y: 0 }] Custom plotly data for the event.
 */
exports.dispatchPlotlySelectionEvent = function (wrapper, data) {
    if (data === void 0) { data = {
        points: [{ x: 0, y: 0 }],
        range: { x: [0], y: [0] },
    }; }
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var plotlyWrapper, canvas;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    plotlyWrapper = wrapper.find('PlotlyChart');
                    canvas = plotlyWrapper.instance().plotlyCanvas;
                    if (canvas) {
                        canvas.dispatchEvent(new Event('plotly_selected'), data);
                    }
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
/**
 * Helper function to dispatch an event through plotly.
 *
 * @param wrapper The PlotlyChart.
 * @param event The name of the event to dispatch.
 */
exports.dispatchPlotlySecondaryAxisEvent = function (wrapper, event, data) {
    if (data === void 0) { data = { data: {}, x: [0], y: [0] }; }
    var canvas = wrapper.instance().plotlyCanvas;
    if (canvas) {
        canvas.dispatchEvent(new Event(event), data);
    }
};
var MockContextClass = /** @class */ (function (_super) {
    tslib_1.__extends(MockContextClass, _super);
    function MockContextClass(props) {
        return _super.call(this, props) || this;
    }
    MockContextClass.prototype.render = function () {
        return React.createElement("div", null, "I am a class for a mock context!");
    };
    return MockContextClass;
}(React.Component));
exports.MockContextClass = MockContextClass;
exports.genSecondaryStructureSection = function (structId, resno, length) {
    if (length === void 0) { length = 1; }
    return [new data_1.Bioblocks1DSection(structId, resno, resno + length - 1)];
};
/**
 * Gets some data suitable for a tensorflow t-sne component. Taken from 'hpc' spring dataset.
 *
 */
exports.genTensorTsneData = function () { return [
    [
        -6.07794,
        0.66089,
        3.42628,
        1.85904,
        -2.41684,
        -0.43664,
        -2.30753,
        2.35615,
        -1.12598,
        -0.60199,
        -1.1218,
        0.11698,
        -0.04982,
        0.36092,
        -0.0508,
        -0.08095,
        0.80147,
        -0.4348,
        0.1589,
        -0.37422,
        -0.29722,
        0.25252,
        0.23296,
        -0.29226,
        -0.3324,
        -1.13309,
        0.37442,
        -0.0253,
        -0.02493,
        0.36059,
    ],
    [
        -5.00513,
        1.26166,
        4.98725,
        1.97746,
        -2.81049,
        -0.48861,
        0.39672,
        -0.04346,
        -1.18266,
        -0.22673,
        0.64698,
        -0.32172,
        -0.46212,
        -0.94495,
        -0.28995,
        -0.28883,
        -0.89687,
        -0.15866,
        -0.11644,
        1.05208,
        -0.51977,
        -0.30863,
        1.09945,
        0.41791,
        -0.56852,
        -0.2366,
        -0.1608,
        0.89874,
        -0.19515,
        0.05163,
    ],
]; };
// Helpful when dealing with async component lifecycle method testing.
// https://medium.com/@lucksp_22012/jest-enzyme-react-testing-with-async-componentdidmount-7c4c99e77d2d
exports.flushPromises = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
    return [2 /*return*/, new Promise(setImmediate)];
}); }); };
//# sourceMappingURL=BioblocksTestUtils.js.map