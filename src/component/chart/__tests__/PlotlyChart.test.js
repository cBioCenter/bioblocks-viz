"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var test_1 = require("~bioblocks-viz~/test");
beforeEach(function () {
    jest.resetModules();
});
describe('PlotlyChart', function () {
    var sampleData;
    beforeEach(function () {
        sampleData = [
            {
                marker: {
                    color: 'blue',
                },
                mode: 'markers',
                type: 'pointcloud',
                xy: new Float32Array([1, 2, 3, 4]),
            },
        ];
    });
    /**
     * Helper function to create and wait for a PlotlyChart to be mounted.
     *
     * @param props Custom props to be passed to the chart.
     * @returns A wrapper for the PlotlyChart that has been mounted.
     */
    var getMountedPlotlyChart = function (props) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.mount(React.createElement(component_1.PlotlyChart, tslib_1.__assign({}, props)));
                    wrapper.update();
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, wrapper];
            }
        });
    }); };
    it('Should match existing snapshot when given empty data.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.PlotlyChart, { data: [] }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when given sample data.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.PlotlyChart, { data: sampleData }));
        expect(wrapper).toMatchSnapshot();
    });
    describe('Event Callbacks', function () {
        it('Should handle plotly events.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var spies, wrapper, _a, _b, key;
            var e_1, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        spies = {
                            onClickSpy: jest.fn(),
                            onDoubleClickSpy: jest.fn(),
                            onHoverSpy: jest.fn(),
                            onRelayoutSpy: jest.fn(),
                            onSelectedSpy: jest.fn(),
                            onUnHoverSpy: jest.fn(),
                        };
                        return [4 /*yield*/, getMountedPlotlyChart({
                                data: sampleData,
                                onClickCallback: spies.onClickSpy,
                                onDoubleClickCallback: spies.onDoubleClickSpy,
                                onHoverCallback: spies.onHoverSpy,
                                onRelayoutCallback: spies.onRelayoutSpy,
                                onSelectedCallback: spies.onSelectedSpy,
                                onUnHoverCallback: spies.onUnHoverSpy,
                            })];
                    case 1:
                        wrapper = _d.sent();
                        return [4 /*yield*/, Promise.all([
                                test_1.dispatchPlotlyEvent(wrapper, 'plotly_click'),
                                test_1.dispatchPlotlyEvent(wrapper, 'plotly_doubleclick'),
                                test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover'),
                                test_1.dispatchPlotlyEvent(wrapper, 'plotly_relayout'),
                                test_1.dispatchPlotlySelectionEvent(wrapper),
                                test_1.dispatchPlotlyEvent(wrapper, 'plotly_unhover'),
                            ])];
                    case 2:
                        _d.sent();
                        try {
                            for (_a = tslib_1.__values(Object.keys(spies)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                key = _b.value;
                                expect(spies[key]).toHaveBeenCalledTimes(1);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should attach events when the container is attached.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var spies, wrapper;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spies = {
                            onClickSpy: jest.fn(),
                            onSelectedSpy: jest.fn(),
                        };
                        return [4 /*yield*/, getMountedPlotlyChart({
                                data: sampleData,
                                onClickCallback: spies.onClickSpy,
                                onSelectedCallback: spies.onSelectedSpy,
                            })];
                    case 1:
                        wrapper = _a.sent();
                        expect(wrapper).toMatchSnapshot();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should call the appropriate callback when the window is resized.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onResizeSpy, wrapper, chartInstance;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onResizeSpy = jest.fn();
                        return [4 /*yield*/, getMountedPlotlyChart({ data: sampleData })];
                    case 1:
                        wrapper = _a.sent();
                        chartInstance = wrapper.instance();
                        chartInstance.resize = onResizeSpy;
                        chartInstance.attachListeners();
                        window.dispatchEvent(new Event('resize'));
                        expect(onResizeSpy).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should call the appropriate callback when plotly emits a click event.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onClickSpy, wrapper;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onClickSpy = jest.fn();
                        return [4 /*yield*/, getMountedPlotlyChart({
                                data: sampleData,
                                onClickCallback: onClickSpy,
                            })];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_click')];
                    case 2:
                        _a.sent();
                        expect(onClickSpy).toBeCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should return the appropriate event when plotly emits a click event on a point.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onClickSpy, wrapper, bioblocksEvent;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onClickSpy = jest.fn();
                        return [4 /*yield*/, getMountedPlotlyChart({
                                data: sampleData,
                                onClickCallback: onClickSpy,
                            })];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_click', { x: 1, y: 2 })];
                    case 2:
                        _a.sent();
                        bioblocksEvent = onClickSpy.mock.calls[0][0];
                        expect(bioblocksEvent.chartPiece).toBe(data_1.BIOBLOCKS_CHART_PIECE.POINT);
                        expect(bioblocksEvent.type).toBe(data_1.BIOBLOCKS_CHART_EVENT_TYPE.CLICK);
                        expect(bioblocksEvent.selectedPoints).toEqual([1, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should return the appropriate event when plotly emits a click event on a secondary x axis.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onClickSpy, wrapper, bioblocksEvent;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onClickSpy = jest.fn();
                        return [4 /*yield*/, getMountedPlotlyChart({
                                data: sampleData,
                                onClickCallback: onClickSpy,
                            })];
                    case 1:
                        wrapper = _a.sent();
                        test_1.dispatchPlotlySecondaryAxisEvent(wrapper, 'plotly_click', { data: { xaxis: 'x2', yaxis: 'y' }, x: 1, y: 2 });
                        bioblocksEvent = onClickSpy.mock.calls[0][0];
                        expect(bioblocksEvent.chartPiece).toBe(data_1.BIOBLOCKS_CHART_PIECE.AXIS);
                        expect(bioblocksEvent.type).toBe(data_1.BIOBLOCKS_CHART_EVENT_TYPE.CLICK);
                        expect(bioblocksEvent.selectedPoints).toEqual([2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should return the appropriate event when plotly emits a click event on a secondary y axis.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onClickSpy, wrapper, bioblocksEvent;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onClickSpy = jest.fn();
                        return [4 /*yield*/, getMountedPlotlyChart({
                                data: sampleData,
                                onClickCallback: onClickSpy,
                            })];
                    case 1:
                        wrapper = _a.sent();
                        test_1.dispatchPlotlySecondaryAxisEvent(wrapper, 'plotly_click', { data: { xaxis: 'x', yaxis: 'y2' }, x: 1, y: 2 });
                        bioblocksEvent = onClickSpy.mock.calls[0][0];
                        expect(bioblocksEvent.chartPiece).toBe(data_1.BIOBLOCKS_CHART_PIECE.AXIS);
                        expect(bioblocksEvent.type).toBe(data_1.BIOBLOCKS_CHART_EVENT_TYPE.CLICK);
                        expect(bioblocksEvent.selectedPoints).toEqual([1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should call the appropriate callback when plotly emits a hover event.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onHoverSpy, wrapper;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onHoverSpy = jest.fn();
                        return [4 /*yield*/, getMountedPlotlyChart({
                                data: sampleData,
                                onHoverCallback: onHoverSpy,
                            })];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover')];
                    case 2:
                        _a.sent();
                        expect(onHoverSpy).toBeCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should call the appropriate callback when plotly emits a selected event.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onSelectedSpy, wrapper;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onSelectedSpy = jest.fn();
                        return [4 /*yield*/, getMountedPlotlyChart({
                                data: sampleData,
                                onSelectedCallback: onSelectedSpy,
                            })];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlySelectionEvent(wrapper)];
                    case 2:
                        _a.sent();
                        expect(onSelectedSpy).toBeCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should call the appropriate callback when plotly emits a selected event for a range of points.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onSelectedSpy, wrapper;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onSelectedSpy = jest.fn();
                        return [4 /*yield*/, getMountedPlotlyChart({
                                data: sampleData,
                                onSelectedCallback: onSelectedSpy,
                            })];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlySelectionEvent(wrapper, { points: [], range: { x: [0, 1], y: [0, 1] } })];
                    case 2:
                        _a.sent();
                        expect(onSelectedSpy).toBeCalled();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Should unmount correctly.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, chartInstance;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMountedPlotlyChart({
                        data: sampleData,
                    })];
                case 1:
                    wrapper = _a.sent();
                    chartInstance = wrapper.instance();
                    expect(chartInstance.plotlyCanvas).not.toBeNull();
                    expect(chartInstance.plotlyCanvas).not.toBeUndefined();
                    wrapper.unmount();
                    expect(chartInstance.plotlyCanvas).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should not call draw if data is unchanged.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, chartInstance, drawSpy;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMountedPlotlyChart({
                        data: sampleData,
                    })];
                case 1:
                    wrapper = _a.sent();
                    chartInstance = wrapper.instance();
                    drawSpy = jest.fn();
                    chartInstance.draw = drawSpy;
                    wrapper.setProps({
                        data: sampleData,
                    });
                    expect(drawSpy).toHaveBeenCalledTimes(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should call draw when data is updated.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, chartInstance, drawSpy;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMountedPlotlyChart({
                        data: sampleData,
                    })];
                case 1:
                    wrapper = _a.sent();
                    chartInstance = wrapper.instance();
                    drawSpy = jest.fn();
                    chartInstance.draw = drawSpy;
                    wrapper.setProps({
                        data: [],
                    });
                    expect(drawSpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should call draw when layout is updated.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, chartInstance, drawSpy;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMountedPlotlyChart({
                        data: sampleData,
                    })];
                case 1:
                    wrapper = _a.sent();
                    chartInstance = wrapper.instance();
                    drawSpy = jest.fn();
                    chartInstance.draw = drawSpy;
                    wrapper.setProps({
                        layout: {
                            autosize: false,
                        },
                    });
                    expect(drawSpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should call draw when config is updated.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, chartInstance, drawSpy;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMountedPlotlyChart({
                        data: sampleData,
                    })];
                case 1:
                    wrapper = _a.sent();
                    chartInstance = wrapper.instance();
                    drawSpy = jest.fn();
                    chartInstance.draw = drawSpy;
                    wrapper.setProps({
                        config: {
                            displayModeBar: true,
                        },
                    });
                    expect(drawSpy).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should handle extra axes correctly.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMountedPlotlyChart({
                        data: tslib_1.__spread(sampleData, [{ xaxis: 'x2' }, { yaxis: 'y2' }]),
                    })];
                case 1:
                    wrapper = _a.sent();
                    expect(wrapper).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=PlotlyChart.test.js.map