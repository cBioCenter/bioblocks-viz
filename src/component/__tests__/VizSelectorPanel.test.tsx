import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import { VIZ_TYPE } from '../../data/chell-data';

import { Dropdown } from 'semantic-ui-react';
import VizSelectorPanel from '../VizSelectorPanel';

describe('VizSelectorPanel', () => {
  const emptyData = {};

  test('Should match existing snapshot when given no initial visualization.', () => {
    expect(toJson(shallow(<VizSelectorPanel data={emptyData} />))).toMatchSnapshot();
  });

  Object.keys(VIZ_TYPE).forEach(vizKey => {
    const viz = VIZ_TYPE[vizKey as keyof typeof VIZ_TYPE];
    test(`Should match existing snapshot when given initial viz of ${viz}.`, () => {
      expect(toJson(shallow(<VizSelectorPanel data={emptyData} initialViz={viz} />))).toMatchSnapshot();
    });
  });

  test('Should throw an error when given an invalid visualization option.', () => {
    // Testing a render error is slightly different - here we are checking "if I were to render this, would it throw an error?".
    expect(() =>
      shallow(<VizSelectorPanel initialViz={'Through the Looking Glass' as VIZ_TYPE} data={emptyData} />),
    ).toThrow();
  });

  test('Should handle viz selection events.', () => {
    const wrapper = shallow(
      <VizSelectorPanel data={emptyData} supportedVisualizations={[VIZ_TYPE.NGL, VIZ_TYPE.CONTACT_MAP]} />,
    );
    const expected = VIZ_TYPE.CONTACT_MAP;
    expect(wrapper.state().selectedViz).not.toBe(expected);
    wrapper.find(Dropdown).simulate('change', {}, { value: expected });
    expect(wrapper.state().selectedViz).toBe(expected);
  });
});
