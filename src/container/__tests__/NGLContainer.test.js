"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var react_redux_1 = require("react-redux");
var semantic_ui_react_1 = require("semantic-ui-react");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
var reducer_1 = require("~bioblocks-viz~/reducer");
var test_1 = require("~bioblocks-viz~/test");
describe('NGLContainer', function () {
    it('Should match the default snapshot when hooked up to a redux store.', function () {
        var store = reducer_1.BBStore;
        var wrapper = enzyme_1.mount(React.createElement(react_redux_1.Provider, { store: store },
            React.createElement(container_1.NGLContainer, null)));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match the default snapshot when not hooked up to a redux store.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.NGLContainerClass, null));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle experimental PDB files.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var pdbs, wrapper;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        data_1.BioblocksPDB.createPDB('exp_1_sample.pdb'),
                        data_1.BioblocksPDB.createPDB('exp_2_sample.pdb'),
                    ])];
                case 1:
                    pdbs = _a.sent();
                    return [4 /*yield*/, test_1.getAsyncShallowComponent(React.createElement(container_1.NGLContainerClass, { experimentalProteins: pdbs }))];
                case 2:
                    wrapper = _a.sent();
                    expect(wrapper.instance().state).toEqual({
                        experimentalProteins: pdbs,
                        predictedProteins: [],
                        selectedExperimentalProteins: ['exp_1_sample'],
                        selectedPredictedProteins: [],
                    });
                    wrapper.setProps({
                        experimentalProteins: [],
                    });
                    return [4 /*yield*/, test_1.flushPromises()];
                case 3:
                    _a.sent();
                    expect(wrapper.instance().state).toEqual({
                        experimentalProteins: [],
                        predictedProteins: [],
                        selectedExperimentalProteins: [],
                        selectedPredictedProteins: [],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should handle predicted PDB files.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var pdbs, wrapper;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        data_1.BioblocksPDB.createPDB('pred_1_sample.pdb'),
                        data_1.BioblocksPDB.createPDB('pred_2_sample.pdb'),
                    ])];
                case 1:
                    pdbs = _a.sent();
                    wrapper = enzyme_1.shallow(React.createElement(container_1.NGLContainerClass, { predictedProteins: pdbs }));
                    return [4 /*yield*/, test_1.flushPromises()];
                case 2:
                    _a.sent();
                    expect(wrapper.instance().state).toEqual({
                        experimentalProteins: [],
                        predictedProteins: [pdbs[0], pdbs[1]],
                        selectedExperimentalProteins: [],
                        selectedPredictedProteins: ['pred_1_sample'],
                    });
                    wrapper.setProps({
                        predictedProteins: [pdbs[1]],
                    });
                    return [4 /*yield*/, test_1.flushPromises()];
                case 3:
                    _a.sent();
                    expect(wrapper.instance().state).toEqual({
                        experimentalProteins: [],
                        predictedProteins: [pdbs[1]],
                        selectedExperimentalProteins: [],
                        selectedPredictedProteins: ['pred_2_sample'],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should handle selecting PDB files via checkbox.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var pdbs, wrapper;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        data_1.BioblocksPDB.createPDB('exp_1_sample.pdb'),
                        data_1.BioblocksPDB.createPDB('exp_2_sample.pdb'),
                        data_1.BioblocksPDB.createPDB('pred_1_sample.pdb'),
                        data_1.BioblocksPDB.createPDB('pred_2_sample.pdb'),
                    ])];
                case 1:
                    pdbs = _a.sent();
                    wrapper = enzyme_1.mount(React.createElement(container_1.NGLContainerClass, { experimentalProteins: [pdbs[0], pdbs[1]], predictedProteins: [pdbs[2], pdbs[3]] }));
                    return [4 /*yield*/, test_1.flushPromises()];
                case 2:
                    _a.sent();
                    expect(wrapper.instance().state).toEqual({
                        experimentalProteins: [pdbs[0], pdbs[1]],
                        predictedProteins: [pdbs[2], pdbs[3]],
                        selectedExperimentalProteins: ['exp_1_sample'],
                        selectedPredictedProteins: ['pred_1_sample'],
                    });
                    wrapper
                        .find(semantic_ui_react_1.Popup)
                        .at(0)
                        .simulate('click');
                    wrapper
                        .find(semantic_ui_react_1.Checkbox)
                        .at(1)
                        .simulate('change');
                    expect(wrapper.instance().state).toEqual({
                        experimentalProteins: [pdbs[0], pdbs[1]],
                        predictedProteins: [pdbs[2], pdbs[3]],
                        selectedExperimentalProteins: ['exp_1_sample', 'exp_2_sample'],
                        selectedPredictedProteins: ['pred_1_sample'],
                    });
                    wrapper
                        .find(semantic_ui_react_1.Checkbox)
                        .at(0)
                        .simulate('change');
                    expect(wrapper.instance().state).toEqual({
                        experimentalProteins: [pdbs[0], pdbs[1]],
                        predictedProteins: [pdbs[2], pdbs[3]],
                        selectedExperimentalProteins: ['exp_2_sample'],
                        selectedPredictedProteins: ['pred_1_sample'],
                    });
                    wrapper
                        .find(semantic_ui_react_1.Menu.Item)
                        .at(1)
                        .simulate('click');
                    wrapper
                        .find(semantic_ui_react_1.Checkbox)
                        .at(3)
                        .simulate('change');
                    expect(wrapper.instance().state).toEqual({
                        experimentalProteins: [pdbs[0], pdbs[1]],
                        predictedProteins: [pdbs[2], pdbs[3]],
                        selectedExperimentalProteins: ['exp_2_sample'],
                        selectedPredictedProteins: ['pred_1_sample', 'pred_2_sample'],
                    });
                    wrapper
                        .find(semantic_ui_react_1.Checkbox)
                        .at(2)
                        .simulate('change');
                    expect(wrapper.instance().state).toEqual({
                        experimentalProteins: [pdbs[0], pdbs[1]],
                        predictedProteins: [pdbs[2], pdbs[3]],
                        selectedExperimentalProteins: ['exp_2_sample'],
                        selectedPredictedProteins: ['pred_2_sample'],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should not show a popup when there are no PDB files to select.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, pdbs;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = enzyme_1.mount(React.createElement(container_1.NGLContainerClass, null));
                    wrapper
                        .find(semantic_ui_react_1.Icon)
                        .at(0)
                        .simulate('click');
                    expect(wrapper.find(semantic_ui_react_1.Checkbox).length).toBe(0);
                    return [4 /*yield*/, Promise.all([
                            data_1.BioblocksPDB.createPDB('exp_1_sample.pdb'),
                            data_1.BioblocksPDB.createPDB('exp_2_sample.pdb'),
                        ])];
                case 1:
                    pdbs = _a.sent();
                    wrapper.setProps({ experimentalProteins: pdbs, predictedProteins: pdbs });
                    return [4 /*yield*/, test_1.flushPromises()];
                case 2:
                    _a.sent();
                    wrapper
                        .find(semantic_ui_react_1.Popup)
                        .at(0)
                        .simulate('click');
                    expect(wrapper.find(semantic_ui_react_1.Checkbox).length).not.toBe(0);
                    wrapper
                        .find(semantic_ui_react_1.Menu.Item)
                        .at(1)
                        .simulate('click');
                    expect(wrapper.find(semantic_ui_react_1.Checkbox).length).not.toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should handle clearing PDB files.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var pdbs, wrapper, instance;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        data_1.BioblocksPDB.createPDB('pred_1_sample.pdb'),
                        data_1.BioblocksPDB.createPDB('pred_2_sample.pdb'),
                    ])];
                case 1:
                    pdbs = _a.sent();
                    wrapper = enzyme_1.mount(React.createElement(container_1.NGLContainerClass, { experimentalProteins: pdbs, predictedProteins: pdbs }));
                    instance = wrapper.instance();
                    return [4 /*yield*/, instance.componentDidMount()];
                case 2:
                    _a.sent();
                    wrapper
                        .find(semantic_ui_react_1.Icon)
                        .at(0)
                        .simulate('click');
                    return [4 /*yield*/, test_1.flushPromises()];
                case 3:
                    _a.sent();
                    expect(instance.state.selectedExperimentalProteins).toEqual(['pred_1_sample']);
                    expect(instance.state.selectedPredictedProteins).toEqual(['pred_1_sample']);
                    wrapper.setProps({
                        experimentalProteins: [],
                        predictedProteins: [],
                    });
                    return [4 /*yield*/, test_1.flushPromises()];
                case 4:
                    _a.sent();
                    expect(instance.state.selectedExperimentalProteins).toEqual([]);
                    expect(instance.state.selectedPredictedProteins).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it.skip('Should show the correct sequence match.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var experimentalPDB, predictedPDB, wrapper, foo;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, data_1.BioblocksPDB.createPDB('exp_1_sample')];
                case 1:
                    experimentalPDB = _a.sent();
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB('pred_1_sample')];
                case 2:
                    predictedPDB = _a.sent();
                    Object.defineProperty(experimentalPDB, 'sequence', { value: 'ABCDEFGHIJ' });
                    Object.defineProperty(predictedPDB, 'sequence', { value: 'ABCDEFGHIJ' });
                    wrapper = enzyme_1.mount(React.createElement(container_1.NGLContainerClass, { experimentalProteins: [experimentalPDB], predictedProteins: [predictedPDB] }));
                    wrapper
                        .find('i')
                        .at(0)
                        .simulate('click');
                    return [4 /*yield*/, test_1.flushPromises()];
                case 3:
                    _a.sent();
                    wrapper.update();
                    return [4 /*yield*/, test_1.flushPromises()];
                case 4:
                    _a.sent();
                    foo = wrapper.text();
                    expect(wrapper
                        .find(semantic_ui_react_1.Table.Cell)
                        .at(1)
                        .text()).toEqual('100.0%');
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB('exp_2_sample')];
                case 5:
                    experimentalPDB = _a.sent();
                    return [4 /*yield*/, data_1.BioblocksPDB.createPDB('pred_2_sample')];
                case 6:
                    predictedPDB = _a.sent();
                    Object.defineProperty(experimentalPDB, 'sequence', { value: 'BCDEFFGHIJ' });
                    Object.defineProperty(predictedPDB, 'sequence', { value: 'ABCDEFGHIJ' });
                    wrapper.setProps({
                        experimentalProteins: [experimentalPDB],
                        predictedProteins: [predictedPDB],
                    });
                    expect(wrapper
                        .find(semantic_ui_react_1.Table.Cell)
                        .at(4)
                        .text()).toEqual('50.0%');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=NGLContainer.test.js.map