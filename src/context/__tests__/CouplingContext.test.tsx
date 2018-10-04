import { shallow } from 'enzyme';
import * as React from 'react';

import { CouplingContextProvider } from '~chell-viz~/context';

describe('CouplingContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = shallow(<CouplingContextProvider />);
    expect(wrapper).toMatchSnapshot();
  });
});
