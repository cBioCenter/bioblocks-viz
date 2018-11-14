import { shallow } from 'enzyme';
import * as React from 'react';
import { Button } from 'semantic-ui-react';

import { SpringContainerClass } from '~chell-viz~/container';

describe('SpringContainer', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<SpringContainerClass />).update();
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle enabling fullscreen.', () => {
    const wrapper = shallow(<SpringContainerClass />).update();
    expect(wrapper.state('isFullscreen')).toBe(false);
    wrapper.find(Button).simulate('click');
    expect(wrapper.state('isFullscreen')).toBe(true);
  });

  it('Should handle receiving messages.', () => {
    const wrapper = shallow(<SpringContainerClass />).update();
    wrapper.find(Button).simulate('click');
    expect(wrapper.state('isFullscreen')).toBe(true);
  });
});
