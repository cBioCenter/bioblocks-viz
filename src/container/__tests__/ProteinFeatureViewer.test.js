"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
var container_1 = require("~bioblocks-viz~/container");
var test_1 = require("~bioblocks-viz~/test");
describe('ProteinFeatureViewer', function () {
    beforeEach(function () {
        fetchMock.resetMocks();
    });
    // tslint:disable-next-line:mocha-no-side-effect-code no-require-imports
    var sampleProtein = require('./Q13485.json');
    it('Should match the default snapshot.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.ProteinFeatureViewer, null));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should show protein information when successfully retrieved.', function () {
        fetchMock.mockResponseOnce(JSON.stringify(sampleProtein));
        var wrapper = enzyme_1.shallow(React.createElement(container_1.ProteinFeatureViewer, null));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should default to an invalid range if there is a problem with the response JSON.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var mh1Domain, wrapper;
        return tslib_1.__generator(this, function (_a) {
            mh1Domain = sampleProtein.features.find(function (feature) { return feature.type === 'DOMAIN' && feature.description === 'MH1'; });
            fetchMock.mockResponseOnce(JSON.stringify(tslib_1.__assign(tslib_1.__assign({}, sampleProtein), { features: tslib_1.__spread(sampleProtein.features, [
                    tslib_1.__assign(tslib_1.__assign({}, mh1Domain), { begin: '', end: '' }),
                ]) })));
            wrapper = enzyme_1.shallow(React.createElement(container_1.ProteinFeatureViewer, { initialProteinId: sampleProtein.accession }));
            wrapper.update();
            expect(wrapper).toMatchSnapshot();
            return [2 /*return*/];
        });
    }); });
    it('Should toggle the grouping flag when the appropriate control is clicked.', function () {
        fetchMock.mockResponseOnce(JSON.stringify(sampleProtein));
        var wrapper = enzyme_1.shallow(React.createElement(container_1.ProteinFeatureViewer, { initialProteinId: '' }));
        expect(wrapper.state('showGrouped')).toEqual(true);
        wrapper
            .find(semantic_ui_react_1.Form.Checkbox)
            .at(0)
            .simulate('change', {}, { checked: false });
        expect(wrapper.state('showGrouped')).toEqual(false);
        wrapper
            .find(semantic_ui_react_1.Form.Checkbox)
            .at(0)
            .simulate('change', {}, { checked: true });
        expect(wrapper.state('showGrouped')).toEqual(true);
        wrapper
            .find(semantic_ui_react_1.Form.Checkbox)
            .at(0)
            .simulate('change', {}, {});
        expect(wrapper.state('showGrouped')).toEqual(true);
    });
    it('Should update the proteinId as the user enters text into the input field.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var wrapper, expectedId;
        return tslib_1.__generator(this, function (_a) {
            wrapper = enzyme_1.shallow(React.createElement(container_1.ProteinFeatureViewer, { initialProteinId: '' }));
            expect(wrapper.state('proteinId')).toEqual('');
            expectedId = 'Q13485';
            fetchMock.mockResponseOnce(JSON.stringify(sampleProtein));
            wrapper
                .find(semantic_ui_react_1.Form.Input)
                .at(0)
                .simulate('change', {}, { value: expectedId });
            expect(wrapper.state('proteinId')).toEqual(expectedId);
            return [2 /*return*/];
        });
    }); });
    it('Should fetch a new protein with a user-supplied protein ID when the user submits it.', function (done) {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.ProteinFeatureViewer, { initialProteinId: '' }));
        expect(wrapper.state('proteinId')).toEqual('');
        expect(wrapper.state('protein')).toBeUndefined();
        wrapper.setState({
            proteinId: 'Q13485',
        });
        fetchMock.mockResponseOnce(JSON.stringify(sampleProtein));
        wrapper
            .find(semantic_ui_react_1.Form)
            .at(0)
            .simulate('submit', {});
        // To test asynchronous render code - https://www.leighhalliday.com/testing-asynchronous-components-mocks-jest
        setTimeout(function () {
            wrapper.update();
            expect(wrapper.state('protein')).toEqual(sampleProtein);
            done();
        });
    });
    it('Should generate annotation text when a hover event is fired.', function (done) {
        fetchMock.mockResponseOnce(JSON.stringify(sampleProtein));
        var wrapper = enzyme_1.mount(React.createElement(container_1.ProteinFeatureViewer, null));
        wrapper.update();
        setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var featureViewerState;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper.update();
                        expect(wrapper.state('protein')).toEqual(sampleProtein);
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover', { x: [42], y: [1] })];
                    case 1:
                        _a.sent();
                        featureViewerState = wrapper
                            .find(component_1.FeatureViewer)
                            .at(0)
                            .instance().state;
                        expect(featureViewerState.hoverAnnotationText).toMatchSnapshot();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Should generate empty annotation text when a hover event is fired and the protein information is not available.', function (done) {
        var mh1Domain = sampleProtein.features.find(function (feature) { return feature.type === 'DOMAIN' && feature.description === 'MH1'; });
        fetchMock.mockResponseOnce(JSON.stringify(tslib_1.__assign(tslib_1.__assign({}, sampleProtein), { dbReferences: [], features: tslib_1.__spread(sampleProtein.features, [
                tslib_1.__assign(tslib_1.__assign({}, mh1Domain), { begin: '', end: '' }),
            ]) })));
        var wrapper = enzyme_1.mount(React.createElement(container_1.ProteinFeatureViewer, null));
        wrapper.update();
        setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var featureViewerState, expected;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper.update();
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover', { x: [42], y: [0] })];
                    case 1:
                        _a.sent();
                        featureViewerState = wrapper
                            .find(component_1.FeatureViewer)
                            .at(0)
                            .instance().state;
                        expected = '';
                        expect(featureViewerState.hoverAnnotationText).toEqual(expected);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Should generate empty annotation text when a hover event is fired but the PFam information is not available.', function (done) {
        var dbRefs = sampleProtein.dbReferences
            .filter(function (dbRef) { return dbRef.type === 'Pfam'; })
            .map(function (pFamRef) { return (tslib_1.__assign(tslib_1.__assign({}, pFamRef), { properties: null })); });
        fetchMock.mockResponseOnce(JSON.stringify(tslib_1.__assign(tslib_1.__assign({}, sampleProtein), { dbReferences: dbRefs })));
        var wrapper = enzyme_1.mount(React.createElement(container_1.ProteinFeatureViewer, null));
        wrapper.update();
        setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var featureViewerState, expected;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper.update();
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover', { x: [42], y: [0] })];
                    case 1:
                        _a.sent();
                        featureViewerState = wrapper
                            .find(component_1.FeatureViewer)
                            .at(0)
                            .instance().state;
                        expected = '';
                        expect(featureViewerState.hoverAnnotationText).toEqual(expected);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Should generate empty annotation text when a hover event is fired but no protein was fetched.', function (done) {
        fetchMock.mockResponseOnce(JSON.stringify(sampleProtein));
        var wrapper = enzyme_1.mount(React.createElement(container_1.ProteinFeatureViewer, null));
        wrapper.update();
        setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var featureViewerState, expected;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wrapper.update();
                        wrapper.setState({
                            protein: undefined,
                        });
                        return [4 /*yield*/, test_1.dispatchPlotlyEvent(wrapper, 'plotly_hover', { x: [42], y: [0] })];
                    case 1:
                        _a.sent();
                        featureViewerState = wrapper
                            .find(component_1.FeatureViewer)
                            .at(0)
                            .instance().state;
                        expected = '';
                        expect(featureViewerState.hoverAnnotationText).toEqual(expected);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('Should handle when there is an error fetching.', function (done) {
        fetchMock.mockReject();
        var wrapper = enzyme_1.mount(React.createElement(container_1.ProteinFeatureViewer, { initialProteinId: '' }));
        expect(wrapper.state('proteinId')).toEqual('');
        expect(wrapper.state('protein')).toBeUndefined();
        wrapper.setState({
            proteinId: 'Q13485',
        });
        wrapper
            .find(semantic_ui_react_1.Form)
            .at(0)
            .simulate('submit', {});
        // To test asynchronous render code - https://www.leighhalliday.com/testing-asynchronous-components-mocks-jest
        setTimeout(function () {
            wrapper.update();
            expect(wrapper.state('protein')).toBeUndefined();
            done();
        });
    });
});
//# sourceMappingURL=ProteinFeatureViewer.test.js.map