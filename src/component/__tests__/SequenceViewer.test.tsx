import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as NGL from 'ngl';
import * as React from 'react';

import SequenceViewer from '../SequenceViewer';

describe('SequenceViewer', () => {
  test('Should match existing snapshot when given no data.', () => {
    expect(toJson(shallow(<SequenceViewer data={undefined} />))).toMatchSnapshot();
  });

  test('Should match existing snapshot when given sample data.', () => {
    const mockData = new NGL.Structure();
    const component = shallow(<SequenceViewer data={mockData} />);
    expect(toJson(component)).toMatchSnapshot();
  });
});
