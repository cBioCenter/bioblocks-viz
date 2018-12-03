import { shallow } from 'enzyme';
import * as React from 'react';

import { AnatomogramContainerClass } from '~chell-viz~/container';

describe('AnatomogramContainer', () => {
  it('Should match existing snapshot when the species is a human.', () => {
    const wrapper = shallow(<AnatomogramContainerClass species={'homo_sapiens'} />).update();
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when the species is a mouse.', () => {
    const wrapper = shallow(<AnatomogramContainerClass species={'mus_musculus'} />).update();
    expect(wrapper).toMatchSnapshot();
  });
});
