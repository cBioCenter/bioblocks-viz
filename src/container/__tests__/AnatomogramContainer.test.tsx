import { shallow } from 'enzyme';
import * as React from 'react';

import { AnatomogramContainer } from '~chell-viz~/container';

describe('AnatomogramContainer', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<AnatomogramContainer />).update();
    expect(wrapper).toMatchSnapshot();
  });
});
