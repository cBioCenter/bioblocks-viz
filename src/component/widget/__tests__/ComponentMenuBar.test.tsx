import { shallow } from 'enzyme';
import * as React from 'react';

import { ComponentMenuBar, IComponentMenuBarItem } from '~bioblocks-viz~/component';
import {
  ButtonGroupWidgetConfig,
  ButtonWidgetConfig,
  CheckboxWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  LabelWidgetConfig,
  RadioWidgetConfig,
  RangeSliderWidgetConfig,
  SliderWidgetConfig,
} from '~bioblocks-viz~/data';
import { EMPTY_FUNCTION } from '~bioblocks-viz~/helper';

describe('ComponentMenuBar', () => {
  it('Should match existing snapshot when given default props.', () => {
    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when expanded', () => {
    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} isExpanded={true} />);
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

  it('Should determine the visibility of menu items via mouse hover.', () => {
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

    wrapper.simulate('mouseenter');
    expect(instance.state.isHovered).toBe(true);
    expect(
      wrapper
        .find('span')
        .at(0)
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
  });

  it('Should render a Button menu item.', () => {
    const config: ButtonWidgetConfig = {
      name: 'Rye',
      onClick: EMPTY_FUNCTION,
      type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
    };

    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          configs: {
            Catcher: [config],
          },
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render a Button menu item with an icon.', () => {
    const config: ButtonWidgetConfig = {
      icon: 'coffee',
      name: 'Rye',
      onClick: EMPTY_FUNCTION,
      type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
    };

    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          configs: {
            Catcher: [config],
          },
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render a Button Group menu item.', () => {
    const config: ButtonGroupWidgetConfig = {
      name: 'Rye',
      options: [<div key={1}>Howdy</div>, <div key={2}>Ho</div>],
      type: CONFIGURATION_COMPONENT_TYPE.BUTTON_GROUP,
    };

    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          configs: {
            Catcher: [config],
          },
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render a Checkbox menu item.', () => {
    const config: CheckboxWidgetConfig = {
      checked: false,
      name: 'Rye',
      type: CONFIGURATION_COMPONENT_TYPE.CHECKBOX,
    };

    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          configs: {
            Catcher: [config],
          },
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render a Label menu item.', () => {
    const config: LabelWidgetConfig = {
      name: 'Rye',
      type: CONFIGURATION_COMPONENT_TYPE.LABEL,
    };

    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          configs: {
            Catcher: [config],
          },
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render a Radio menu item.', () => {
    const config: RadioWidgetConfig = {
      current: 'Ludo',
      name: 'Rye',
      options: ['Ludo', 'Queen'],
      type: CONFIGURATION_COMPONENT_TYPE.RADIO,
    };

    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          configs: {
            Catcher: [config],
          },
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render a Range Slider menu item.', () => {
    const config: RangeSliderWidgetConfig = {
      name: 'Rye',
      range: {
        current: [1, 3],
        defaultRange: [1, 3],
        max: 4,
        min: 0,
      },
      type: CONFIGURATION_COMPONENT_TYPE.RANGE_SLIDER,
    };

    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          configs: {
            Catcher: [config],
          },
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render a Slider menu item.', () => {
    const config: SliderWidgetConfig = {
      name: 'Rye',
      type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
      values: {
        current: 2,
        defaultValue: 2,
        max: 4,
        min: 0,
      },
    };

    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          configs: {
            Catcher: [config],
          },
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle an unknown menu item.', () => {
    const config = {
      type: 'apocalypse',
    };

    const menuItems: IComponentMenuBarItem[] = [
      {
        component: {
          configs: {
            Catcher: [config],
          } as any,
          name: 'POPUP',
          props: {},
        },
        description: 'A Popup',
      },
    ];

    const wrapper = shallow(<ComponentMenuBar componentName={'The Boxer'} menuItems={menuItems} />);
    expect(wrapper).toMatchSnapshot();
  });
});
