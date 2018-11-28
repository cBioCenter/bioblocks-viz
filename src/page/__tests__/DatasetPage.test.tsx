import { shallow } from 'enzyme';
import * as React from 'react';

import { DatasetPage } from '~chell-viz~/page';

describe('DatasetPage', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<DatasetPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
