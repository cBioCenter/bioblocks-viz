import { shallow } from 'enzyme';
// tslint:disable-next-line:import-name
import Slider from 'rc-slider';
import * as React from 'react';
import { Button } from 'semantic-ui-react';

import { BioblocksSlider, BioblocksSliderProps } from '~bioblocks-viz~/component';

describe('BioblocksSlider', () => {
  const sampleBioblocksSlider = (props: Partial<BioblocksSliderProps> = {}) => (
    <BioblocksSlider value={1} max={100} min={1} label={'test'} {...props} />
  );

  it('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(sampleBioblocksSlider());
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle onChange callbacks.', () => {
    const onChangeSpy = jest.fn();
    const expected = 42;
    const wrapper = shallow(sampleBioblocksSlider({ onChange: onChangeSpy }));

    expect(wrapper.state('value')).not.toBe(expected);
    wrapper.find(Slider).simulate('change', expected);
    expect(onChangeSpy).toHaveBeenLastCalledWith(expected);
    expect(wrapper.state('value')).toBe(expected);
  });

  it('Should handle onAfterChange callbacks.', () => {
    const onAfterChangeSpy = jest.fn();
    const expected = 42;
    const wrapper = shallow(sampleBioblocksSlider({ onAfterChange: onAfterChangeSpy }));

    expect(wrapper.state('value')).not.toBe(expected);
    wrapper.find(Slider).simulate('afterChange', expected);
    expect(onAfterChangeSpy).toHaveBeenLastCalledWith(expected);
    expect(wrapper.state('value')).toBe(expected);
  });

  it('Should handle resetting the slider when no default is originally given.', () => {
    const onChangeSpy = jest.fn();
    const wrapper = shallow(sampleBioblocksSlider({ onChange: onChangeSpy }));
    wrapper.find(Slider).simulate('change', 42);
    expect(wrapper.state('value')).toBe(42);

    wrapper.find(Button).simulate('click');

    expect(wrapper.state('value')).not.toBe(42);
    expect(wrapper.state('value')).toBe(1);
  });

  it('Should handle resetting the slider to a default value when available.', () => {
    const expected = 2001;
    const onChangeSpy = jest.fn();
    const wrapper = shallow(sampleBioblocksSlider({ defaultValue: expected, onChange: onChangeSpy }));
    wrapper.find(Slider).simulate('change', 42);
    expect(wrapper.state('value')).toBe(42);

    wrapper.find(Button).simulate('click');

    expect(wrapper.state('value')).not.toBe(42);
    expect(wrapper.state('value')).toBe(expected);
  });

  it('Should allow the default value to be updated if one was not provided when mounted.', () => {
    const wrapper = shallow(<BioblocksSlider label={'Lucky numbers'} value={-1} max={1000} min={0} />);
    const expected = 777;

    expect(wrapper.state('value')).not.toBe(expected);
    wrapper.setProps({
      defaultValue: expected,
    });
    wrapper.find(Button).simulate('click');
    expect(wrapper.state('value')).toBe(expected);
  });

  it('Should allow the value to be updated via props.', () => {
    const wrapper = shallow(<BioblocksSlider label={'Lucky numbers'} value={-1} max={1000} min={0} />);
    const expected = 777;

    expect(wrapper.state('value')).not.toBe(expected);
    wrapper.setProps({
      value: expected,
    });
    wrapper.find(Button).simulate('click');
    expect(wrapper.state('value')).toBe(expected);
  });
});
