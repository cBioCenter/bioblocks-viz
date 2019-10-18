"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
describe('ComponentDock', function () {
    it('Should match existing snapshot when given empty dock items.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentDock, { dockItems: [] }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should not render when visible is toggled.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentDock, { dockItems: [], visible: false }));
        expect(wrapper.isEmptyRender()).toBe(true);
    });
    it('Should match existing snapshot when given sample dock items.', function () {
        var dockItems = [
            {
                text: 'A Little Respect',
            },
            {
                text: 'Erasure',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentDock, { dockItems: dockItems }));
        expect(wrapper).toMatchSnapshot();
    });
    it('Should invoke visible callback if present.', function () {
        var dockItems = [
            {
                isVisibleCb: jest.fn(function () { return true; }),
                text: 'A Little Respect',
            },
            {
                isVisibleCb: jest.fn(function () { return false; }),
                text: 'Erasure',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentDock, { dockItems: dockItems }));
        expect(wrapper.find(semantic_ui_react_1.Grid.Column)).toHaveLength(1);
        expect(dockItems[0].isVisibleCb).toHaveBeenCalledTimes(1);
        expect(dockItems[1].isVisibleCb).toHaveBeenCalledTimes(1);
    });
    it('Should invoke onClick callback if present.', function () {
        var dockItems = [
            {
                onClick: jest.fn(),
                text: 'A Little Respect',
            },
            {
                onClick: jest.fn(),
                text: 'Erasure',
            },
        ];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.ComponentDock, { dockItems: dockItems }));
        wrapper
            .find('a')
            .at(0)
            .simulate('click');
        wrapper
            .find('a')
            .at(1)
            .simulate('click');
        expect(dockItems[0].onClick).toHaveBeenCalledTimes(1);
        expect(dockItems[1].onClick).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=ComponentDock.test.js.map