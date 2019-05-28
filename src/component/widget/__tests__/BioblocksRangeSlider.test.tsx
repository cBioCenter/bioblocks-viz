import { shallow } from 'enzyme';
// tslint:disable-next-line:import-name
import { Range } from 'rc-slider';
import * as React from 'react';
import { Button } from 'semantic-ui-react';

import { BioblocksRangeSlider, BioblocksRangeSliderProps } from '~bioblocks-viz~/component';

describe('BioblocksRangeSlider', () => {
  const sampleBioblocksSlider = (props: Partial<BioblocksRangeSliderProps> = {}) => (
    <BioblocksRangeSlider value={[0, 1]} max={100} min={1} label={'test'} {...props} />
  );

  it('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(sampleBioblocksSlider());
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle onChange callbacks.', () => {
    const onChangeSpy = jest.fn();
    const expected = [42];
    const wrapper = shallow(sampleBioblocksSlider({ onChange: onChangeSpy }));

    const instance = wrapper.instance() as BioblocksRangeSlider;

    expect(instance.state.range).not.toBe(expected);
    wrapper.find(Range).simulate('change', expected);
    expect(onChangeSpy).toHaveBeenLastCalledWith(expected);
    expect(wrapper.state('range')).toBe(expected);
  });

  it('Should handle onAfterChange callbacks.', () => {
    const onAfterChangeSpy = jest.fn();
    const expected = [42];
    const wrapper = shallow(sampleBioblocksSlider({ onAfterChange: onAfterChangeSpy }));
    const instance = wrapper.instance() as BioblocksRangeSlider;

    expect(instance.state.range).not.toBe(expected);
    wrapper.find(Range).simulate('afterChange', expected);
    expect(onAfterChangeSpy).toHaveBeenLastCalledWith(expected);
    expect(instance.state.range).toBe(expected);
  });

  it('Should handle resetting the slider when no default is originally given.', () => {
    const onChangeSpy = jest.fn();
    const wrapper = shallow(sampleBioblocksSlider({ onChange: onChangeSpy }));
    const instance = wrapper.instance() as BioblocksRangeSlider;
    wrapper.find(Range).simulate('change', [42]);
    expect(instance.state.range).toEqual([42]);

    wrapper.find(Button).simulate('click');

    expect(instance.state.range).not.toEqual([42]);
    expect(instance.state.range).toEqual([0, 1]);
  });

  it('Should handle resetting the slider to a default value when available.', () => {
    const expected = [2001];
    const onChangeSpy = jest.fn();
    const wrapper = shallow(sampleBioblocksSlider({ defaultValue: expected, onChange: onChangeSpy }));
    const instance = wrapper.instance() as BioblocksRangeSlider;
    wrapper.find(Range).simulate('change', [42]);
    expect(instance.state.range).toEqual([42]);

    wrapper.find(Button).simulate('click');

    expect(instance.state.range).not.toEqual(42);
    expect(instance.state.range).toEqual(expected);
  });

  it('Should allow the default value to be updated if one was not provided when mounted.', () => {
    const wrapper = shallow(<BioblocksRangeSlider label={'Lucky numbers'} value={[4, 5]} max={1000} min={0} />);
    const instance = wrapper.instance() as BioblocksRangeSlider;
    const expected = [7, 8];

    expect(wrapper.state('value')).not.toEqual(expected);
    wrapper.setProps({
      defaultValue: expected,
    });
    wrapper.find(Button).simulate('click');
    expect(instance.state.defaultValue).toEqual(expected);
    expect(instance.state.range).toEqual(expected);
  });

  it('Should allow the value to be updated via props.', () => {
    const wrapper = shallow(<BioblocksRangeSlider label={'Lucky numbers'} value={[4, 5]} max={1000} min={0} />);
    const instance = wrapper.instance() as BioblocksRangeSlider;
    const expected = [9, 12];

    expect(wrapper.state('value')).not.toEqual(expected);
    wrapper.setProps({
      value: expected,
    });
    wrapper.find(Button).simulate('click');
    expect(instance.state.defaultValue).toEqual(expected);
    expect(instance.state.range).toEqual(expected);
  });
});
