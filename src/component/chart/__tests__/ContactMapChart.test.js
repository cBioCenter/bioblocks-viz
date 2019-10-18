"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var component_1 = require("~bioblocks-viz~/component");
var test_1 = require("~bioblocks-viz~/test");
describe('ContactMapChart', function () {
    var emptyData = [
        {
            color: '',
            name: '',
            nodeSize: 0,
            points: [],
        },
    ];
    it('Should match existing snapshot when given simple data.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ContactMapChart, { contactData: emptyData }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when given data with extra axes.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ContactMapChart, { contactData: emptyData, secondaryStructures: [tslib_1.__spread(test_1.genSecondaryStructureSection('H', 0, 4), test_1.genSecondaryStructureSection('E', 3, 4))] }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when given data with multiple secondary structures.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ContactMapChart, { contactData: emptyData, secondaryStructures: [
                tslib_1.__spread(test_1.genSecondaryStructureSection('H', 0, 3), test_1.genSecondaryStructureSection('E', 3, 4)),
                tslib_1.__spread(test_1.genSecondaryStructureSection('C', 0, 3), test_1.genSecondaryStructureSection('H', 11, 4)),
            ] }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should be able to determine the number of legend entries that will be created..', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ContactMapChart, { contactData: [
                { name: 'first', nodeSize: 10, points: [] },
                { name: 'second', nodeSize: 10, points: [] },
                { name: 'first', nodeSize: 10, points: [] },
            ] }));
        var state = wrapper.state();
        expect(state.numLegends).toEqual(2);
    });
});
//# sourceMappingURL=ContactMapChart.test.js.map