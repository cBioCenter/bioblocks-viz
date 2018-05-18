import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import ContactMapChart from '../ContactMapChart';

describe('ContactMapChart', () => {
  const emptyData = [
    {
      color: '',
      name: '',
      points: [],
    },
  ];

  test('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(<ContactMapChart data={emptyData} nodeSize={4} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
