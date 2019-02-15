import { shallow } from 'enzyme';
import * as React from 'react';

import { BioblocksVizApp } from '~bioblocks-viz~';

describe('BioblocksVizApp', () => {
  it('Should match existing snapshot when given no props.', () => {
    expect(shallow(<BioblocksVizApp />)).toMatchSnapshot();
  });
});
