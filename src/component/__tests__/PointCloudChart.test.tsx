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

  test('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(<PointCloudChart data={emptyData} nodeSize={4} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
