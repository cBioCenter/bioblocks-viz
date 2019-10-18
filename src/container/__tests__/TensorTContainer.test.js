"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var container_1 = require("~bioblocks-viz~/container");
var test_1 = require("~bioblocks-viz~/test");
describe('TensorTContainer', function () {
    it('Should match existing snapshot when given no props.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.TensorTContainerClass, null));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when given sample data.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.TensorTContainerClass, null));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle selection events.', function (done) {
        var sampleData = test_1.genTensorTsneData();
        var setCellsSpy = jest.fn();
        var wrapper = enzyme_1.mount(React.createElement(container_1.TensorTContainerClass, { setCurrentCells: setCellsSpy }));
        setInterval(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, test_1.dispatchPlotlySelectionEvent(wrapper, { points: [{ x: sampleData[1][0], y: sampleData[1][1] }] })];
                    case 1:
                        _a.sent();
                        expect(setCellsSpy).toHaveBeenCalled();
                        done();
                        return [2 /*return*/];
                }
            });
        }); }, 4000);
    });
    it('Should handle starting playback.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.TensorTContainerClass, { setCurrentCells: jest.fn() }));
        var instance = wrapper.instance();
        expect(instance.state.isAnimating).toBe(false);
        wrapper
            .find(semantic_ui_react_1.Radio)
            .at(0)
            .simulate('click');
        expect(instance.state.isAnimating).toBe(true);
    });
    it('Should handle pausing playback.', function (done) {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.TensorTContainerClass, { setCurrentCells: jest.fn() }));
        var instance = wrapper.instance();
        expect(instance.state.isAnimating).toBe(false);
        wrapper
            .find(semantic_ui_react_1.Radio)
            .at(0)
            .simulate('click');
        setInterval(function () {
            wrapper
                .find(semantic_ui_react_1.Radio)
                .at(0)
                .simulate('click');
            expect(instance.state.isAnimating).toBe(false);
            done();
        }, 4000);
    });
});
//# sourceMappingURL=TensorTContainer.test.js.map