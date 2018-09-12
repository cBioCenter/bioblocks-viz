import { shallow } from 'enzyme';
import * as React from 'react';

import CouplingContext from '../CouplingContext';

describe('CouplingContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = shallow(<CouplingContext />);
    expect(wrapper).toMatchSnapshot();
  });
});
