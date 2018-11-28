import { shallow } from 'enzyme';
import * as React from 'react';

import { VizOverviewPage } from '~chell-viz~/page';

describe('VizOverviewPage', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<VizOverviewPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
