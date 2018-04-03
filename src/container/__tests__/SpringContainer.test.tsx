import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { SpringContainer } from '../SpringContainer';

describe('SpringContainer', () => {
  test('Should match existing snapshot when given no data.', () => {
    expect(toJson(shallow(<SpringContainer dataDir={'./'} />))).toMatchSnapshot();
  });

  test('Should update when given a new data directory.', () => {
    const wrapper = shallow(<SpringContainer dataDir={'./'} />);
    wrapper.setProps({
      dataDir: './somewhere-new',
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
