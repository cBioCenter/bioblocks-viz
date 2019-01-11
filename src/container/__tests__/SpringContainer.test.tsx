import { shallow } from 'enzyme';
import * as React from 'react';

import { SpringContainer } from '~chell-viz~/container';

describe('SpringContainer', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<SpringContainer />).update();
    expect(wrapper).toMatchSnapshot();
  });
});
