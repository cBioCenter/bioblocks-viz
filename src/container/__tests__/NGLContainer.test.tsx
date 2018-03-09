import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { NGLContainer } from '../NGLContainer';

describe('NGLContainer', () => {
  test('Should match existing snapshot when given no props.', () => {
    expect(renderer.create(<NGLContainer />)).toMatchSnapshot();
  });
});
