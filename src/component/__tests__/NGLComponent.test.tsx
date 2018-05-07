import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import NGLComponent from '../NGLComponent';

describe('NGLComponent', () => {
  test("Should match existing snapshot when canvas isn't available.", () => {
    expect(Renderer.create(<NGLComponent />).toJSON()).toMatchSnapshot();
  });

  /* TO-DO: How to mock WebGL? React Error boundaries? https://reactjs.org/docs/error-boundaries.html
  test('Should update when given new data.', () => {
    const component = mount(<NGLComponent />);
    component.setProps({ data: [1, 2, 3] });
    expect(toJson(component)).toMatchSnapshot();
  });
  */
});
