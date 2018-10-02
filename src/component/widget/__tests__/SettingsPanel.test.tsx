import { shallow } from 'enzyme';
import * as React from 'react';
import { Button } from 'semantic-ui-react';

import { ISettingsPanelState, SettingsPanel } from '../SettingsPanel';

describe('ChellSlider', () => {
  it('Should match the existing snapshot when given no configurations.', () => {
    const wrapper = shallow(<SettingsPanel configurations={[]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should not be visible initially.', () => {
    const wrapper = shallow(<SettingsPanel configurations={[]} />);
    const state = wrapper.state() as ISettingsPanelState;
    expect(state.visible).toBe(false);
  });

  it('Should be visible when the corresponding button is clicked.', () => {
    const wrapper = shallow(<SettingsPanel configurations={[]} />);
    wrapper
      .find(Button)
      .at(0)
      .simulate('click');
    const state = wrapper.state() as ISettingsPanelState;
    expect(state.visible).toBe(true);
  });
});
