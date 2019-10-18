"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
var test_1 = require("~bioblocks-viz~/test");
describe('ProteinFeatureViewer', function () {
    var sampleData;
    beforeEach(function () {
        sampleData = [
            new data_1.TintedBioblocks1DSection('N64', 1999, 2001),
            new data_1.TintedBioblocks1DSection('Melee', 2001, 2008),
            new data_1.TintedBioblocks1DSection('Brawl', 2008, 2014),
            new data_1.TintedBioblocks1DSection('3DS/WiiU', 2014, 2018),
            new data_1.TintedBioblocks1DSection('Ultimate', 2018, 2019),
        ];
    });
    it('Should match the default snapshot.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.FeatureViewer, null));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match the snapshot for sample data.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.FeatureViewer, { data: sampleData }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match the snapshot for sample data when specifying a max length.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.FeatureViewer, { data: sampleData, maxLength: 2013 }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match the snapshot for sample data when showing features grouped.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.FeatureViewer, { data: sampleData, showGrouped: true }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match the snapshot when a background bar is provided.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.FeatureViewer, { backgroundBar: new data_1.TintedBioblocks1DSection('', 1999, 2018, 'purple') }));
        expect(wrapper).toMatchSnapshot();
    });
    describe('Event handlers', function () {
        it('Should handle selecting a single feature.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, state;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.FeatureViewer, { data: sampleData }))];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlySelectionEvent(wrapper, { points: [{ x: 2017 }] })];
                    case 2:
                        _a.sent();
                        state = wrapper.instance().state;
                        expect(state.selectedFeatureIndices.toArray()).toEqual([3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should handle selecting multiple features sharing an overlap.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, state;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.FeatureViewer, { data: sampleData }))];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlySelectionEvent(wrapper, { points: [{ x: 2018 }] })];
                    case 2:
                        _a.sent();
                        state = wrapper.instance().state;
                        expect(state.selectedFeatureIndices.toArray()).toEqual([3, 4]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should handle selecting multiple features via selection box.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, state;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.FeatureViewer, { data: sampleData }))];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlySelectionEvent(wrapper, {
                                points: [{ x: [1999, 2018], y: [0, 2] }],
                                range: { x: [1999, 2018], y: [0, 2] },
                            })];
                    case 2:
                        _a.sent();
                        state = wrapper.instance().state;
                        expect(state.selectedFeatureIndices.toArray()).toEqual([0, 1, 2, 3, 4]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should call the appropriate callback on selection events.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onSelectionSpy, wrapper, onSelectedArgs, sampleData_1, sampleData_1_1, data, end, label, start;
            var e_1, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onSelectionSpy = jest.fn();
                        return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.FeatureViewer, { data: sampleData, onSelectCallback: onSelectionSpy }))];
                    case 1:
                        wrapper = _b.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlySelectionEvent(wrapper, {
                                points: [{ x: [1999, 2018], y: [0, 2] }],
                                range: { x: [1999, 2018], y: [0, 2] },
                            })];
                    case 2:
                        _b.sent();
                        expect(onSelectionSpy).toHaveBeenCalledTimes(1);
                        onSelectedArgs = onSelectionSpy.mock.calls[0];
                        expect(onSelectedArgs[0]).toMatchObject({
                            end: 2018,
                            length: 20,
                            start: 1999,
                        });
                        try {
                            for (sampleData_1 = tslib_1.__values(sampleData), sampleData_1_1 = sampleData_1.next(); !sampleData_1_1.done; sampleData_1_1 = sampleData_1.next()) {
                                data = sampleData_1_1.value;
                                end = data.end, label = data.label, start = data.start;
                                expect(onSelectedArgs[0].featuresSelected).toContainEqual({
                                    label: label,
                                    sectionEnd: end,
                                    sectionStart: start,
                                });
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (sampleData_1_1 && !sampleData_1_1.done && (_a = sampleData_1.return)) _a.call(sampleData_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should handle clicking a single feature.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, state;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.FeatureViewer, { data: sampleData }))];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_click', { x: 2002, y: 1 })];
                    case 2:
                        _a.sent();
                        state = wrapper.instance().state;
                        expect(state.selectedFeatureIndices.toArray()).toEqual([1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should call the appropriate callback when clicking a single feature.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onClickSpy, wrapper;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onClickSpy = jest.fn();
                        return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.FeatureViewer, { data: sampleData, onClickCallback: onClickSpy }))];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_click', { x: 2002, y: 1 })];
                    case 2:
                        _a.sent();
                        expect(onClickSpy).toHaveBeenCalledWith([{ label: 'Melee', sectionEnd: 2008, sectionStart: 2001 }]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should handle hovering over a single feature.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, state;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.getAsyncMountedComponent(React.createElement(component_1.FeatureViewer, { data: sampleData }))];
                    case 1:
                        wrapper = _a.sent();
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover', { x: 2013, y: 1 })];
                    case 2:
                        _a.sent();
                        state = wrapper.instance().state;
                        expect(state.hoveredFeatureIndex).toEqual(2);
                        expect(state.hoverAnnotationText).toEqual('');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=FeatureViewer.test.js.map