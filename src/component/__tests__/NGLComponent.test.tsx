import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { NGLComponent } from '../NGLComponent';

describe('NGLComponent', () => {
  test("Should match existing snapshot when canvas isn't available.", () => {
    expect(toJson(shallow(<NGLComponent />))).toMatchSnapshot();
  });

  test('Should match existing snapshot when canvas is available', () => {
    expect(toJson(mount(<NGLComponent />))).toMatchSnapshot();
  });

  /* TO-DO: How to mock WebGL? React Error boundaries? https://reactjs.org/docs/error-boundaries.html
  test('Should update when given new data.', () => {
    const component = mount(<NGLComponent />);
    component.setProps({ data: [1, 2, 3] });
    expect(toJson(component)).toMatchSnapshot();
  });
  */
});
