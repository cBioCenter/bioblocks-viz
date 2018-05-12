import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import PointCloudChart from '../PointCloudChart';

describe('PointCloudChart', () => {
  const emptyData = [
    {
      color: '',
      points: [],
    },
  ];

  const simpleData = [
    {
      color: 'magenta',
      points: [{ i: 1, j: 2 }, { i: 5, j: 6 }],
    },
    {
      color: 'chartreuse',
      points: [{ i: 8, j: 2 }, { i: 3, j: 4 }],
    },
  ];

  test('Should match existing snapshot when given empty data.', () => {
    const wrapper = shallow(<PointCloudChart data={emptyData} nodeSize={4} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(<PointCloudChart data={simpleData} nodeSize={4} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
