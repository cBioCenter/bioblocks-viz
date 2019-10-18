"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
// tslint:disable-next-line:import-name
var rc_slider_1 = require("rc-slider");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
describe('BioblocksRangeSlider', function () {
    var sampleBioblocksSlider = function (props) {
        if (props === void 0) { props = {}; }
        return (React.createElement(component_1.BioblocksRangeSlider, tslib_1.__assign({ value: [0, 1], max: 100, min: 1, label: 'test' }, props)));
    };
    it('Should match existing snapshot when given simple data.', function () {
        var wrapper = enzyme_1.shallow(sampleBioblocksSlider());
        expect(wrapper).toMatchSnapshot();
    });
    it('Should handle onChange callbacks.', function () {
        var onChangeSpy = jest.fn();
        var expected = [42];
        var wrapper = enzyme_1.shallow(sampleBioblocksSlider({ onChange: onChangeSpy }));
        var instance = wrapper.instance();
        expect(instance.state.range).not.toBe(expected);
        wrapper.find(rc_slider_1.Range).simulate('change', expected);
        expect(onChangeSpy).toHaveBeenLastCalledWith(expected);
        expect(wrapper.state('range')).toBe(expected);
    });
    it('Should handle onAfterChange callbacks.', function () {
        var onAfterChangeSpy = jest.fn();
        var expected = [42];
        var wrapper = enzyme_1.shallow(sampleBioblocksSlider({ onAfterChange: onAfterChangeSpy }));
        var instance = wrapper.instance();
        expect(instance.state.range).not.toBe(expected);
        wrapper.find(rc_slider_1.Range).simulate('afterChange', expected);
        expect(onAfterChangeSpy).toHaveBeenLastCalledWith(expected);
        expect(instance.state.range).toBe(expected);
    });
    it('Should handle resetting the slider when no default is originally given.', function () {
        var onChangeSpy = jest.fn();
        var wrapper = enzyme_1.shallow(sampleBioblocksSlider({ onChange: onChangeSpy }));
        var instance = wrapper.instance();
        wrapper.find(rc_slider_1.Range).simulate('change', [42]);
        expect(instance.state.range).toEqual([42]);
        wrapper.find(semantic_ui_react_1.Button).simulate('click');
        expect(instance.state.range).not.toEqual([42]);
        expect(instance.state.range).toEqual([0, 1]);
    });
    it('Should handle resetting the slider to a default value when available.', function () {
        var expected = [2001];
        var onChangeSpy = jest.fn();
        var wrapper = enzyme_1.shallow(sampleBioblocksSlider({ defaultValue: expected, onChange: onChangeSpy }));
        var instance = wrapper.instance();
        wrapper.find(rc_slider_1.Range).simulate('change', [42]);
        expect(instance.state.range).toEqual([42]);
        wrapper.find(semantic_ui_react_1.Button).simulate('click');
        expect(instance.state.range).not.toEqual(42);
        expect(instance.state.range).toEqual(expected);
    });
    it('Should allow the default value to be updated if one was not provided when mounted.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.BioblocksRangeSlider, { label: 'Lucky numbers', value: [4, 5], max: 1000, min: 0 }));
        var instance = wrapper.instance();
        var expected = [7, 8];
        expect(wrapper.state('value')).not.toEqual(expected);
        wrapper.setProps({
            defaultValue: expected,
        });
        wrapper.find(semantic_ui_react_1.Button).simulate('click');
        expect(instance.state.defaultValue).toEqual(expected);
        expect(instance.state.range).toEqual(expected);
    });
    it('Should allow the value to be updated via props.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.BioblocksRangeSlider, { label: 'Lucky numbers', value: [4, 5], max: 1000, min: 0 }));
        var instance = wrapper.instance();
        var expected = [9, 12];
        expect(wrapper.state('value')).not.toEqual(expected);
        wrapper.setProps({
            value: expected,
        });
        wrapper.find(semantic_ui_react_1.Button).simulate('click');
        expect(instance.state.defaultValue).toEqual(expected);
        expect(instance.state.range).toEqual(expected);
    });
});
//# sourceMappingURL=BioblocksRangeSlider.test.js.map