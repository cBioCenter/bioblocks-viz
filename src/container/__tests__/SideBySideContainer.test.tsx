import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { SideBySideContainer } from '../SideBySideContainer';

describe('SideBySideContainer', () => {
  test('Should match existing snapshot when given no data.', () => {
    expect(toJson(shallow(<SideBySideContainer />))).toMatchSnapshot();
  });
});
