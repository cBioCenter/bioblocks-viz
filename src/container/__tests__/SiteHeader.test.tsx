import { shallow } from 'enzyme';
import * as React from 'react';

import { SiteHeader } from '~chell-viz~/container';

describe('SiteHeader', () => {
  it('Should match existing snapshot for no visualizations.', () => {
    const wrapper = shallow(<SiteHeader numVisualizations={0} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot for some visualizations.', () => {
    const wrapper = shallow(<SiteHeader numVisualizations={2} />);
    expect(wrapper).toMatchSnapshot();
  });
});
