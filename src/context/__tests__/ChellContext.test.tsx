import { shallow } from 'enzyme';
import * as React from 'react';

import ChellContext from '../ChellContext';

describe('ChellContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = shallow(<ChellContext />);
    expect(wrapper).toMatchSnapshot();
  });
});
