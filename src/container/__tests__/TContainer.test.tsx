import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { TContainer } from '../TContainer';

describe('TContainer', () => {
  test('Should match existing snapshot when given no data.', () => {
    expect(toJson(shallow(<TContainer dataDir={'./'} />))).toMatchSnapshot();
  });

  test('Should update when given a new data directory.', () => {
    const wrapper = shallow(<TContainer dataDir={'./'} />);
    wrapper.setProps({
      dataDir: './somewhere-new',
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
