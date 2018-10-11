import { shallow } from 'enzyme';
import * as React from 'react';
import { Button } from 'semantic-ui-react';

import { ISettingsPanelState, SettingsPanel } from '~chell-viz~/component';
import { ChellWidgetConfig } from '~chell-viz~/data';

describe('SettingsPanel', () => {
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

  it('Should display a placeholder message if given an unhandled configuration type.', () => {
    const mockConfig: ChellWidgetConfig = {
      current: '0',
      name: 'Player HP',
      onChange: jest.fn(),
      type: 'Neural Interface' as any,
      values: { current: 0, max: 100, min: 0 },
    };
    const wrapper = shallow(<SettingsPanel configurations={[mockConfig]} />);
    const expectedKey = 'player-hp-0';
    const result = wrapper.findWhere(component => component.key() === expectedKey);
    expect(result).toHaveLength(1);
    expect(result).toMatchSnapshot();
  });
});
