import { shallow } from 'enzyme';
import * as React from 'react';

import { AnatomogramContainerClass } from '~bioblocks-viz~/container';

describe('AnatomogramContainer', () => {
  it('Should match existing snapshot for homo sapiens.', () => {
    const wrapper = shallow(<AnatomogramContainerClass species={'homo_sapiens'} />).update();
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot for mus musculus.', () => {
    const wrapper = shallow(<AnatomogramContainerClass species={'mus_musculus'} />).update();
    expect(wrapper).toMatchSnapshot();
  });
});
