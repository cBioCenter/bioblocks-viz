import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { TFrameComponent, TFrameComponentClass } from '~chell-viz~/component';

describe('TFrameComponent', () => {
  it('Should match the default snapshot when no props are provided.', () => {
    expect(mount(<TFrameComponent />)).toMatchSnapshot();
  });

  it('Should update when the spring context changes.', () => {
    const wrapper = shallow(<TFrameComponentClass />);
    const instance = wrapper.instance() as TFrameComponentClass;
    const initialState = instance.state;
    wrapper.setProps({
      springContext: {
        currentCells: [1, 2, 3],
      },
    });
    expect(instance.state).not.toEqual(initialState);
  });
});
