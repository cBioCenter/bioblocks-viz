import { shallow } from 'enzyme';
import * as React from 'react';

import { TensorTComponent } from '~bioblocks-viz~/component';

describe('TensorTComponent', () => {
  it('Should match existing snapshot when given no props.', () => {
    const wrapper = shallow(<TensorTComponent />);
    expect(wrapper).toMatchSnapshot();
  });
});
