import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { VizPanelContainer } from '../VizPanelContainer';

describe('VizPanelContainer', () => {
  test('Should match existing snapshot when given a single visualization panel to render.', () => {
    expect(toJson(shallow(<VizPanelContainer initialVisualizations={[]} numPanels={1} />))).toMatchSnapshot();
  });
});
