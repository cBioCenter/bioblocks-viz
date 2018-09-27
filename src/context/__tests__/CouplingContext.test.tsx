import { shallow } from 'enzyme';
import * as React from 'react';

import { CouplingContextClass } from '../CouplingContext';

describe('CouplingContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = shallow(<CouplingContextClass />);
    expect(wrapper).toMatchSnapshot();
  });
});
