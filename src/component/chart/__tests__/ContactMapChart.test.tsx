import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import ContactMapChart from '../ContactMapChart';

describe('ContactMapChart', () => {
  const emptyData = [
    {
      color: '',
      name: '',
      nodeSize: 0,
      points: [],
    },
  ];

  it('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(<ContactMapChart contactData={emptyData} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
