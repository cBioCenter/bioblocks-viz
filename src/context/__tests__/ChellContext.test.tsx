import { shallow } from 'enzyme';
import * as React from 'react';

import { ChellContextProvider } from '~chell-viz~/context';

describe('ChellContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = shallow(<ChellContextProvider />);
    expect(wrapper).toMatchSnapshot();
  });
});
