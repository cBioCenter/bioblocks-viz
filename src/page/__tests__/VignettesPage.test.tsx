import { shallow } from 'enzyme';
import * as React from 'react';

import { StoriesPage } from '~chell-viz~/page';

describe('VignettesPage', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<StoriesPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
