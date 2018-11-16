import { shallow } from 'enzyme';
import * as React from 'react';
import { Icon } from 'semantic-ui-react';

import { SpringContainerClass } from '~chell-viz~/container';

describe('SpringContainer', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<SpringContainerClass />).update();
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle enabling fullscreen.', () => {
    const wrapper = shallow(<SpringContainerClass />).update();
    const instance = wrapper.instance() as SpringContainerClass;
    expect(instance.state.isFullPage).toBe(false);
    wrapper
      .find(Icon)
      .at(0)
      .simulate('click');
    expect(instance.state.isFullPage).toBe(true);
  });

  it('Should handle receiving messages.', () => {
    const wrapper = shallow(<SpringContainerClass />).update();
    wrapper
      .find(Icon)
      .at(0)
      .simulate('click');
    const instance = wrapper.instance() as SpringContainerClass;
    expect(instance.state.isFullPage).toBe(true);
  });
});
