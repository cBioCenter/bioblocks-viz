import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { TComponent } from '../TComponent';

test('Should match existing snapshot when given simple data.', () => {
  const data = [[1, 2], [3, 4], [5, 6]];
  expect(toJson(shallow(<TComponent data={data} />))).toMatchSnapshot();
});
