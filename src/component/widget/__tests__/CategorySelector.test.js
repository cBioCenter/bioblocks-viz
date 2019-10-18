"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
describe('CategorySelector', function () {
    var categories = [
        'Costello Music',
        'Here We Stand',
        'We Need Medicine',
        'Eyes Wide, Tongue Tied',
        'In Your Own Sweet Time',
    ];
    it('Should match existing snapshot when given simple data.', function () {
        var selectorWrapper = enzyme_1.shallow(React.createElement(component_1.CategorySelector, { categories: categories }));
        expect(selectorWrapper).toMatchSnapshot();
    });
    it('Should invoke callback if provided when category is selected.', function () {
        var onCategoryChangeSpy = jest.fn();
        var selectorWrapper = enzyme_1.mount(React.createElement(component_1.CategorySelector, { categories: categories, onCategoryChange: onCategoryChangeSpy }));
        var selectionIndex = categories.indexOf('Here We Stand');
        selectorWrapper.find(semantic_ui_react_1.Dropdown).simulate('click');
        selectorWrapper
            .find(semantic_ui_react_1.DropdownItem)
            .at(selectionIndex)
            .simulate('click');
        expect(onCategoryChangeSpy).toHaveBeenCalled();
    });
});
//# sourceMappingURL=CategorySelector.test.js.map