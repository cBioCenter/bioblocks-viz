"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
describe('SpringContainer', function () {
    it('Should match existing snapshot.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(container_1.SpringContainerClass, null)).update();
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=SpringContainer.test.js.map