import { shallow } from 'enzyme';
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';

import { VIZ_TYPE } from '../../data/chell-data';
import VizSelectorPanel from '../VizSelectorPanel';

describe('VizSelectorPanel', () => {
  const emptyData = {};

  it('Should match existing snapshot when given no initial visualization.', () => {
    expect(shallow(<VizSelectorPanel data={emptyData} />)).toMatchSnapshot();
  });

  Object.keys(VIZ_TYPE).forEach(vizKey => {
    const viz = VIZ_TYPE[vizKey as keyof typeof VIZ_TYPE];
    it(`Should match existing snapshot when given initial viz of ${viz}.`, () => {
      expect(shallow(<VizSelectorPanel data={emptyData} initialViz={viz} />)).toMatchSnapshot();
    });
  });

  it('Should throw an error when given an invalid visualization option.', () => {
    // Testing a render error is slightly different - here we are checking "if I were to render this, would it throw an error?".
    expect(() =>
      shallow(<VizSelectorPanel initialViz={'Through the Looking Glass' as VIZ_TYPE} data={emptyData} />),
    ).toThrow();
  });

  it('Should handle viz selection events.', () => {
    const wrapper = shallow(
      <VizSelectorPanel data={emptyData} supportedVisualizations={[VIZ_TYPE.NGL, VIZ_TYPE.CONTACT_MAP]} />,
    );
    const expected = VIZ_TYPE.CONTACT_MAP;
    expect(wrapper.state('selectedViz')).not.toBe(expected);
    wrapper.find(Dropdown).simulate('change', {}, { value: expected });
    expect(wrapper.state('selectedViz')).toBe(expected);
  });
});
