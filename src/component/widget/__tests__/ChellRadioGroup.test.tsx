import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { Radio } from 'semantic-ui-react';
import ChellRadioGroup, { IChellRadioGroupProps } from '../ChellRadioGroup';

describe('ChellRadioGroup', () => {
  const sampleChellSlider = (props: Partial<IChellRadioGroupProps> = {}) => (
    <ChellRadioGroup id="Sample" options={['first']} {...props} />
  );

  it('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(sampleChellSlider());
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Should handle change events.', () => {
    const onChangeSpy = jest.fn();
    const wrapper = shallow(sampleChellSlider({ options: ['sandor', 'gregor'], onChange: onChangeSpy }));
    const expected = 1;
    expect(wrapper.state().selectedIndex).not.toBe(expected);
    wrapper
      .find(Radio)
      .at(1)
      .simulate('change');
    expect(wrapper.state().selectedIndex).toBe(expected);
    expect(onChangeSpy).toHaveBeenCalled();
  });
});
