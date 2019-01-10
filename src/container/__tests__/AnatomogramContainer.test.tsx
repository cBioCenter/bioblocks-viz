import { shallow } from 'enzyme';
import * as React from 'react';

import { AnatomogramContainer } from '~chell-viz~/container';

describe('AnatomogramContainer', () => {
  it('Should match existing snapshot when the species is a human.', () => {
    const wrapper = shallow(<AnatomogramContainer species={'homo_sapiens'} />).update();
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when the species is a mouse.', () => {
    const wrapper = shallow(<AnatomogramContainer species={'mus_musculus'} />).update();
    expect(wrapper).toMatchSnapshot();
  });
});
