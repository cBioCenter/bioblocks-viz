import { shallow } from 'enzyme';

import * as React from 'react';

import { SpringContainerClass } from '~chell-viz~/container';

describe('SpringContainer', () => {
  it('Should match existing snapshot.', async () => {
    const wrapper = await shallow(<SpringContainerClass />).update();
    expect(wrapper).toMatchSnapshot();
  });
});
