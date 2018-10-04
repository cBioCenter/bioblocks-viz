import { shallow } from 'enzyme';
import * as React from 'react';
import { Form } from 'semantic-ui-react';

import { ChellRadioGroup, IChellRadioGroupProps } from '~chell-viz~/component';

describe('ChellRadioGroup', () => {
  const sampleChellSlider = (props: Partial<IChellRadioGroupProps> = {}) => (
    <ChellRadioGroup id="Sample" options={['first']} {...props} />
  );

  it('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(sampleChellSlider());
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle change events.', () => {
    const onChangeSpy = jest.fn();
    const wrapper = shallow(sampleChellSlider({ options: ['sandor', 'gregor'], onChange: onChangeSpy }));
    const expected = 1;
    expect(wrapper.state('selectedIndex')).not.toBe(expected);
    wrapper
      .find(Form.Radio)
      .at(1)
      .simulate('change');
    expect(wrapper.state('selectedIndex')).toBe(expected);
    expect(onChangeSpy).toHaveBeenCalled();
  });
});
