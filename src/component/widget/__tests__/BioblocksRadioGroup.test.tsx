import { shallow } from 'enzyme';
import * as React from 'react';
import { Form } from 'semantic-ui-react';

import { BioblocksRadioGroup, IBioblocksRadioGroupProps } from '~bioblocks-viz~/component';

describe('BioblocksRadioGroup', () => {
  const sampleBioblocksSlider = (props: Partial<IBioblocksRadioGroupProps> = {}) => (
    <BioblocksRadioGroup id="Sample" options={['first']} {...props} />
  );

  it('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(sampleBioblocksSlider());
    expect(wrapper).toMatchSnapshot();
  });

  it('Should default to the first option if no default is given.', () => {
    const wrapper = shallow(
      <BioblocksRadioGroup id={'War-5-Kings'} options={['Lannister', 'Stark', 'Stannis', 'Greyjoy', 'Renly']} />,
    );
    const instance = wrapper.instance() as BioblocksRadioGroup;
    expect(instance.state.selectedIndex).toEqual(0);
  });

  it('Should default to the first option if the default is invalid.', () => {
    const wrapper = shallow(
      <BioblocksRadioGroup
        defaultOption={'Mance'}
        id={'War-5-Kings'}
        options={['Lannister', 'Stark', 'Stannis', 'Greyjoy', 'Renly']}
      />,
    );
    const instance = wrapper.instance() as BioblocksRadioGroup;
    expect(instance.state.selectedIndex).toEqual(0);
  });

  it('Should allow a default option to be provided.', () => {
    const wrapper = shallow(
      <BioblocksRadioGroup
        defaultOption={'Stannis'} // The Mannis
        id={'War-5-Kings'}
        options={['Lannister', 'Stark', 'Stannis', 'Greyjoy', 'Renly']}
      />,
    );
    const instance = wrapper.instance() as BioblocksRadioGroup;
    expect(instance.state.selectedIndex).toEqual(2);
  });

  it('Should handle change events.', () => {
    const onChangeSpy = jest.fn();
    const wrapper = shallow(sampleBioblocksSlider({ options: ['sandor', 'gregor'], onChange: onChangeSpy }));
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
