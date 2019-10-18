"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
describe('ComponentCard', function () {
    /**
     * Helper function to decouple the exact mechanism to expand the component card.
     *
     * @param component The mounted ComponentCard
     */
    var expandComponentCard = function (component) {
        component.find(semantic_ui_react_1.Icon).simulate('click');
        component.update();
    };
    it('Should match existing snapshot when given default props.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentCard, { componentName: 'The Boxer' }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when framed.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentCard, { componentName: 'The Boxer', isFramedComponent: true }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when not framed.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentCard, { componentName: 'The Boxer', isFramedComponent: false }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle resizing a framed component.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.ComponentCard, { componentName: "Let's", isFramedComponent: true },
            React.createElement("div", null, "Go!")));
        window.dispatchEvent(new Event('resize'));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle expanding a framed full page component.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.ComponentCard, { componentName: "Let's", isFramedComponent: true, isFullPage: true },
            React.createElement("div", null, "Go!")));
        expandComponentCard(wrapper);
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle expanding a framed and non-full page component.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.ComponentCard, { componentName: "Let's", isFramedComponent: true, isFullPage: false },
            React.createElement("div", null, "Go!")));
        expandComponentCard(wrapper);
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle expanding a non-framed full page component.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.ComponentCard, { componentName: "Let's", isFramedComponent: false, isFullPage: true },
            React.createElement("div", null, "Go!")));
        expandComponentCard(wrapper);
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle expanding a non-framed and non-full page component.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.ComponentCard, { componentName: "Let's", isFramedComponent: false, isFullPage: false },
            React.createElement("div", null, "Go!")));
        expandComponentCard(wrapper);
        expect(wrapper).toMatchSnapshot();
    });
});
//# sourceMappingURL=ComponentCard.test.js.map