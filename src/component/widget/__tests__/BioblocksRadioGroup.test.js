"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
describe('BioblocksRadioGroup', function () {
    var sampleBioblocksSlider = function (props) {
        if (props === void 0) { props = {}; }
        return (React.createElement(component_1.BioblocksRadioGroup, tslib_1.__assign({ id: "Sample", options: ['first'] }, props)));
    };
    it('Should match existing snapshot when given simple data.', function () {
        var wrapper = enzyme_1.shallow(sampleBioblocksSlider());
        expect(wrapper).toMatchSnapshot();
    });
    it('Should default to the first option if no default is given.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.BioblocksRadioGroup, { id: 'War-5-Kings', options: ['Lannister', 'Stark', 'Stannis', 'Greyjoy', 'Renly'] }));
        var instance = wrapper.instance();
        expect(instance.state.selectedIndex).toEqual(0);
    });
    it('Should default to the first option if the default is invalid.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.BioblocksRadioGroup, { defaultOption: 'Mance', id: 'War-5-Kings', options: ['Lannister', 'Stark', 'Stannis', 'Greyjoy', 'Renly'] }));
        var instance = wrapper.instance();
        expect(instance.state.selectedIndex).toEqual(0);
    });
    it('Should allow a default option to be provided.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.BioblocksRadioGroup, { defaultOption: 'Stannis', id: 'War-5-Kings', options: ['Lannister', 'Stark', 'Stannis', 'Greyjoy', 'Renly'] }));
        var instance = wrapper.instance();
        expect(instance.state.selectedIndex).toEqual(2);
    });
    it('Should handle change events.', function () {
        var onChangeSpy = jest.fn();
        var wrapper = enzyme_1.shallow(sampleBioblocksSlider({ options: ['sandor', 'gregor'], onChange: onChangeSpy }));
        var expected = 1;
        expect(wrapper.state('selectedIndex')).not.toBe(expected);
        wrapper
            .find(semantic_ui_react_1.Form.Radio)
            .at(1)
            .simulate('change');
        expect(wrapper.state('selectedIndex')).toBe(expected);
        expect(onChangeSpy).toHaveBeenCalled();
    });
});
//# sourceMappingURL=BioblocksRadioGroup.test.js.map