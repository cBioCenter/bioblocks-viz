import { shallow } from 'enzyme';
import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';

import { VizSelectorPanel } from '~chell-viz~/component';
import { VIZ_TYPE } from '~chell-viz~/data';

describe('VizSelectorPanel', () => {
  const emptyData = {};

  it('Should match existing snapshot when given no initial visualization.', () => {
    expect(shallow(<VizSelectorPanel data={emptyData} />)).toMatchSnapshot();
  });

  it('Should match existing snapshot for initial visualizations.', () => {
    Object.keys(VIZ_TYPE).forEach(vizKey => {
      describe(vizKey, () => {
        const viz = VIZ_TYPE[vizKey as keyof typeof VIZ_TYPE];
        expect(shallow(<VizSelectorPanel data={emptyData} initialViz={viz} />)).toMatchSnapshot();
      });
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
