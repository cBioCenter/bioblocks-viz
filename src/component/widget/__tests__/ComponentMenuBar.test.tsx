import { shallow } from 'enzyme';
import * as React from 'react';

import { ComponentMenuBar, IComponentMenuBarItem } from '~bioblocks-viz~/component';

describe('ComponentMenuBar', () => {
  it('Should match existing snapshot when given default props.', () => {
    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render popup menu items.', () => {
    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();

    expect(
      wrapper
        .find('span')
        .at(0)
        .prop('style'),
    ).toHaveProperty('visibility', 'hidden');
  });

  it('Should determine the visiblity of menu items via mouse hover.', () => {
    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    const instance = wrapper.instance() as ComponentMenuBar;
    expect(instance.state.isHovered).toBe(false);
    expect(
      wrapper
        .find('span')
        .at(0)
        .prop('style'),
    ).toHaveProperty('visibility', 'hidden');
    expect(
      wrapper
        .find('span')
        .at(1)
        .prop('style'),
    ).toHaveProperty('visibility', 'hidden');

    wrapper.simulate('mouseenter');
    expect(instance.state.isHovered).toBe(true);
    expect(
      wrapper
        .find('span')
        .at(0)
        .prop('style'),
    ).toHaveProperty('visibility', 'visible');
    expect(
      wrapper
        .find('span')
        .at(1)
        .prop('style'),
    ).toHaveProperty('visibility', 'visible');
    wrapper.simulate('mouseleave');
    expect(instance.state.isHovered).toBe(false);
    expect(
      wrapper
        .find('span')
        .at(0)
        .prop('style'),
    ).toHaveProperty('visibility', 'hidden');
    expect(
      wrapper
        .find('span')
        .at(1)
        .prop('style'),
    ).toHaveProperty('visibility', 'hidden');
  });
});
