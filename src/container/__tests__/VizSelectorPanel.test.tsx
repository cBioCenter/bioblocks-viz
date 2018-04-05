import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { VIZ_TYPE, VizSelectorPanel } from '../VizSelectorPanel';

describe('VizSelectorPanel', () => {
  test('Should match existing snapshot when given no initial visualization.', () => {
    expect(toJson(shallow(<VizSelectorPanel />))).toMatchSnapshot();
  });

  Object.keys(VIZ_TYPE).forEach(viz => {
    test(`Should match existing snapshot when given initial viz of ${viz}`, () => {
      expect(toJson(shallow(<VizSelectorPanel initialViz={viz as VIZ_TYPE} />))).toMatchSnapshot();
    });
  });
});
