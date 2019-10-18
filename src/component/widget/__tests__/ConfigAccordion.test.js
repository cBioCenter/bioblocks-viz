"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
describe('ConfigAccordion', function () {
    it('Should match existing snapshot when given default props.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ConfigAccordion, { configs: [], title: '' }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should match existing snapshot when given some configuration.', function () {
        var configs = [{ Jeannie: [React.createElement("div", { key: 1 }, "Nitro"), React.createElement("div", { key: 1 }, "Devil")] }];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ConfigAccordion, { configs: configs, title: 'songs' }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle click events when there are 2 or more exclusive configs.', function () {
        var configs = [
            { 'The Fratellis': [React.createElement("div", { key: 1 }, "Jeannie Nitro"), React.createElement("div", { key: 2 }, "Me and the Devil")] },
            { Eminem: [React.createElement("div", { key: 3 }, "Stan"), React.createElement("div", { key: 4 }, "Evil Deeds")] },
        ];
        var wrapper = enzyme_1.mount(React.createElement(component_1.ConfigAccordion, { configs: configs, title: 'songs' }));
        var instance = wrapper.instance();
        expect(instance.state.activeIndices).toEqual([0]);
        wrapper
            .find(semantic_ui_react_1.Accordion.Title)
            .at(0)
            .simulate('click');
        expect(instance.state.activeIndices).toEqual([]);
        wrapper
            .find(semantic_ui_react_1.Accordion.Title)
            .at(1)
            .simulate('click');
        expect(instance.state.activeIndices).toEqual([1]);
    });
    it('Should close configs when the same one is clicked.', function () {
        var configs = [
            { 'The Fratellis': [React.createElement("div", { key: 1 }, "Jeannie Nitro"), React.createElement("div", { key: 2 }, "Me and the Devil")] },
            { Eminem: [React.createElement("div", { key: 3 }, "Stan"), React.createElement("div", { key: 4 }, "Evil Deeds")] },
        ];
        var wrapper = enzyme_1.mount(React.createElement(component_1.ConfigAccordion, { configs: configs, title: 'songs' }));
        var instance = wrapper.instance();
        expect(instance.state.activeIndices).toEqual([0]);
        wrapper
            .find(semantic_ui_react_1.Accordion.Title)
            .at(0)
            .simulate('click');
        expect(instance.state.activeIndices).toEqual([]);
        wrapper
            .find(semantic_ui_react_1.Accordion.Title)
            .at(0)
            .simulate('click');
        expect(instance.state.activeIndices).toEqual([0]);
    });
    it('Should handle click events when there are 2 or more mutual configs.', function () {
        var configs = [
            { 'The Fratellis': [React.createElement("div", { key: 1 }, "Jeannie Nitro"), React.createElement("div", { key: 2 }, "Me and the Devil")] },
            { Eminem: [React.createElement("div", { key: 3 }, "Stan"), React.createElement("div", { key: 4 }, "Evil Deeds")] },
        ];
        var wrapper = enzyme_1.mount(React.createElement(component_1.ConfigAccordion, { allowMultipleOpen: true, configs: configs, title: 'songs' }));
        var instance = wrapper.instance();
        expect(instance.state.activeIndices).toEqual([0]);
        wrapper
            .find(semantic_ui_react_1.Accordion.Title)
            .at(1)
            .simulate('click');
        expect(instance.state.activeIndices).toEqual([0, 1]);
    });
    it('Should handle click events when rendering shallowly.', function () {
        var configs = [
            { 'The Fratellis': [React.createElement("div", { key: 1 }, "Jeannie Nitro"), React.createElement("div", { key: 2 }, "Me and the Devil")] },
            { Eminem: [React.createElement("div", { key: 3 }, "Stan"), React.createElement("div", { key: 4 }, "Evil Deeds")] },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ConfigAccordion, { configs: configs, title: 'songs' }));
        var instance = wrapper.instance();
        expect(instance.state.activeIndices).toEqual([0]);
        wrapper
            .find(semantic_ui_react_1.Accordion.Title)
            .at(0)
            .simulate('click');
        expect(instance.state.activeIndices).toEqual([0]);
    });
});
//# sourceMappingURL=ConfigAccordion.test.js.map