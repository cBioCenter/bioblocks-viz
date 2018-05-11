import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import ScatterChart from '../ScatterChart';

describe('ScatterChart', () => {
  const emptyData = [
    {
      color: '',
      points: [],
    },
  ];

  test('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(<ScatterChart data={emptyData} nodeSize={4} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
