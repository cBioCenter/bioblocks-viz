import { shallow } from 'enzyme';
import * as React from 'react';

import { VisualizationsPage } from '~bioblocks-viz~/page';

describe('AppsPage', () => {
  it('Should match existing snapshot.', () => {
    const wrapper = shallow(<VisualizationsPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
