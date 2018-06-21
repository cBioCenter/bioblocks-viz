import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { ChellVizApp } from '../ChellVizApp';

describe('ChellVizApp', () => {
  it('Should match existing snapshot when given no props.', () => {
    expect(toJson(shallow(<ChellVizApp />))).toMatchSnapshot();
  });
});
