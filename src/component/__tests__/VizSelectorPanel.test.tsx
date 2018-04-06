import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { VIZ_TYPE, VizSelectorPanel } from '../VizSelectorPanel';

describe('VizSelectorPanel', () => {
  const testDataDir = 'sentence/kongsvinger';
  const testData = 'heimdalsgate';
  test('Should match existing snapshot when given no initial visualization.', () => {
    expect(toJson(shallow(<VizSelectorPanel data={testData} dataDir={testDataDir} />))).toMatchSnapshot();
  });

  Object.keys(VIZ_TYPE).forEach(viz => {
    test(`Should match existing snapshot when given initial viz of ${viz}.`, () => {
      expect(
        toJson(shallow(<VizSelectorPanel data={testData} initialViz={viz as VIZ_TYPE} dataDir={testDataDir} />)),
      ).toMatchSnapshot();
    });
  });

  test('Should throw an error when given an invalid visualization option.', () => {
    // Testing a render error is slightly different - here we are checking "if I were to render this, would it throw an error?".
    expect(() =>
      shallow(
        <VizSelectorPanel initialViz={'Through the Looking Glass' as VIZ_TYPE} data={testData} dataDir={testDataDir} />,
      ),
    ).toThrow();
  });
});
