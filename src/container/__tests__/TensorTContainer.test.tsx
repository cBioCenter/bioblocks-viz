import { shallow } from 'enzyme';
import * as React from 'react';

import { TensorTContainer } from '~chell-viz~/container';
import { genTensorTsneData } from '~chell-viz~/test';

describe('TensorTContainer', () => {
  it('Should match existing snapshot when given no props.', () => {
    const wrapper = shallow(<TensorTContainer />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data.', () => {
    const wrapper = shallow(<TensorTContainer data={genTensorTsneData()} />);
    expect(wrapper).toMatchSnapshot();
  });
});
