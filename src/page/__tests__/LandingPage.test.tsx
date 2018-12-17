import { shallow } from 'enzyme';
import * as React from 'react';

import { LandingPage } from '~chell-viz~/page';

describe('LandingPage', () => {
  it('Should match existing snapshot when no props are provided.', () => {
    const wrapper = shallow(<LandingPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
