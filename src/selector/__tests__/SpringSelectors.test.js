"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var selector_1 = require("~bioblocks-viz~/selector");
describe('SpringSelector', function () {
    it('Should create a new spring state if one does not exist.', function () {
        var expectedState = {
            category: '',
            graphData: { nodes: [] },
        };
        expect(selector_1.getSpring(undefined)).toMatchObject(expectedState);
        expect(selector_1.getSpring({})).toMatchObject(expectedState);
    });
    it('Should allow selecting SPRING.', function () {
        var _a;
        var expectedState = {
            category: 'tissue',
            graphData: { nodes: [] },
            species: 'mus_musculus',
        };
        expect(selector_1.getSpring((_a = {},
            _a['bioblocks/spring'] = {
                category: 'tissue',
                graphData: { nodes: [] },
                species: 'mus_musculus',
            },
            _a))).toMatchObject(expectedState);
    });
    it('Should select basic data from SPRING.', function () {
        var _a;
        var state = (_a = {},
            _a['sample/spring'] = {
                category: ',',
                graphData: { nodes: [] },
            },
            _a);
        expect(selector_1.getGraphData(state, 'sample')).toEqual({ nodes: [] });
    });
    it('Should allow selection of categories based off the graph data.', function () {
        var _a, _b;
        var graphData = {
            nodes: [{ number: 1, labelForCategory: { tissue: 'liver', sample: '#1' } }],
        };
        var state = (_a = {},
            _a['sample/spring'] = {
                category: ',',
                graphData: graphData,
                species: 'mus_musculus',
            },
            _a);
        expect(selector_1.getCategories({}, 'sample')).toEqual(immutable_1.Set());
        expect(selector_1.getCategories((_b = {}, _b['sample/spring'] = { graphData: {} }, _b), 'sample')).toEqual(immutable_1.Set());
        expect(selector_1.getCategories(state, 'sample')).toEqual(immutable_1.Set(['tissue', 'sample']));
    });
    it('Should allow selection of labels based off the graph data.', function () {
        var _a, _b;
        var graphData = {
            nodes: [
                { number: 1, labelForCategory: { tissue: 'liver', sample: '#1' } },
                { number: 2, labelForCategory: { tissue: 'brain', sample: '#2' } },
            ],
        };
        var state = (_a = {},
            _a['sample/spring'] = {
                category: ',',
                graphData: graphData,
                species: 'mus_musculus',
            },
            _a);
        expect(selector_1.getLabels({}, 'sample')).toEqual(immutable_1.Set());
        expect(selector_1.getLabels((_b = {}, _b['sample/spring'] = { graphData: {} }, _b), 'sample')).toEqual(immutable_1.Set());
        expect(selector_1.getLabels(state, 'sample')).toEqual(immutable_1.Set(['liver', '#1', 'brain', '#2']));
    });
});
//# sourceMappingURL=SpringSelectors.test.js.map