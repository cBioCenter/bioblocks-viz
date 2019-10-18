"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var React = require("react");
var component_1 = require("~bioblocks-viz~/component");
describe('TensorTComponent', function () {
    it('Should match existing snapshot when given no props.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.TensorTComponent, null));
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=TensorTComponent.test.js.map