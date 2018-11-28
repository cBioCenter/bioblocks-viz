import { shallow } from 'enzyme';
import * as React from 'react';

import { AppsPage } from '~chell-viz~/page';

describe('AppsPage', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<AppsPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
