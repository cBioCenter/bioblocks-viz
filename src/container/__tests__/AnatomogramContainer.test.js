"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
describe('AnatomogramContainer', function () {
    it('Should match existing snapshot for homo sapiens.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.AnatomogramContainerClass, { species: 'homo_sapiens' })).update();
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot for mus musculus.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.AnatomogramContainerClass, { species: 'mus_musculus' })).update();
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=AnatomogramContainer.test.js.map