import { shallow } from 'enzyme';
import * as React from 'react';

import { IGVContainer } from '~chell-viz~/container';

describe('IGVContainer', () => {
  it('Should match the snapshot when using default props.', () => {
    const wrapper = shallow(<IGVContainer />);
    expect(wrapper).toMatchSnapshot();
  });
});
