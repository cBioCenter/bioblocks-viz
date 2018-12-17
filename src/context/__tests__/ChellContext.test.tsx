import { shallow } from 'enzyme';
import * as React from 'react';

import { ChellContextProvider } from '~chell-viz~/context';

describe('ChellContext', () => {
  it('Should match the default snapshot when no props are provided.', () => {
    const wrapper = shallow(<ChellContextProvider />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match the default snapshot when a dataset location is provided.', () => {
    const wrapper = shallow(
      <ChellContextProvider location={{ hash: '', pathname: '', search: '?name=over-there', state: '' }} />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
