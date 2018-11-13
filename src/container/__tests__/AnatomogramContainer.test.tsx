import { shallow } from 'enzyme';
import * as React from 'react';

import { AnatomogramContainerClass } from '~chell-viz~/container';

describe('AnatomogramContainer', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<AnatomogramContainerClass />).update();
    expect(wrapper).toMatchSnapshot();
  });

  it('Should update when the context changes.', () => {
    const wrapper = shallow(<AnatomogramContainerClass />).update();
    wrapper.setProps({
      springContext: {
        selectedCategories: ['P9A'],
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
