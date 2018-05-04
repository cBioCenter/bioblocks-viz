import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import { VIZ_TYPE } from '../../../types/chell';

import VizSelectorPanel from '../VizSelectorPanel';

describe('VizSelectorPanel', () => {
  const testData = {};

  test('Should match existing snapshot when given no initial visualization.', () => {
    expect(toJson(shallow(<VizSelectorPanel data={testData} />))).toMatchSnapshot();
  });

  Object.keys(VIZ_TYPE).forEach(vizKey => {
    const viz = VIZ_TYPE[vizKey as keyof typeof VIZ_TYPE];
    test(`Should match existing snapshot when given initial viz of ${viz}.`, () => {
      expect(toJson(shallow(<VizSelectorPanel data={testData} initialViz={viz} />))).toMatchSnapshot();
    });
  });

  test('Should throw an error when given an invalid visualization option.', () => {
    // Testing a render error is slightly different - here we are checking "if I were to render this, would it throw an error?".
    expect(() =>
      shallow(<VizSelectorPanel initialViz={'Through the Looking Glass' as VIZ_TYPE} data={testData} />),
    ).toThrow();
  });
});
