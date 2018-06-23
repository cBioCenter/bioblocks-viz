import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { ISpringGraphData } from 'spring';
import SpringComponent from '../SpringComponent';

describe('SpringComponent', () => {
  it('Should match existing snapshot when given simple data.', () => {
    const data: ISpringGraphData = { nodes: [], links: [] };
    expect(toJson(shallow(<SpringComponent data={data} />))).toMatchSnapshot();
  });
});
