import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { NGLComponent } from '../NGLComponent';

describe('NGLComponent', () => {
  test('Should match existing snapshot when given no data.', () => {
    expect(toJson(shallow(<NGLComponent />))).toMatchSnapshot();
  });
});
