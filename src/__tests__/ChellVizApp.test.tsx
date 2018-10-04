import { shallow } from 'enzyme';
import * as React from 'react';

import { ChellVizApp } from '~chell-viz~';

describe('ChellVizApp', () => {
  it('Should match existing snapshot when given no props.', () => {
    expect(shallow(<ChellVizApp />)).toMatchSnapshot();
  });
});
