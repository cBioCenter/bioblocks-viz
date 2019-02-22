import { shallow } from 'enzyme';
import * as React from 'react';

import { ContactMapChart, IContactMapChartState } from '~bioblocks-viz~/component';
import { genSecondaryStructureSection } from '~bioblocks-viz~/test';

describe('ContactMapChart', () => {
  const emptyData = [
    {
      color: '',
      name: '',
      nodeSize: 0,
      points: [],
    },
  ];

  it('Should match existing snapshot when given simple data.', () => {
    const wrapper = shallow(<ContactMapChart contactData={emptyData} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given data with extra axes.', () => {
    const wrapper = shallow(
      <ContactMapChart
        contactData={emptyData}
        secondaryStructures={[[...genSecondaryStructureSection('H', 0, 4), ...genSecondaryStructureSection('E', 3, 4)]]}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given data with multiple secondary structures.', () => {
    const wrapper = shallow(
      <ContactMapChart
        contactData={emptyData}
        secondaryStructures={[
          [...genSecondaryStructureSection('H', 0, 3), ...genSecondaryStructureSection('E', 3, 4)],
          [...genSecondaryStructureSection('C', 0, 3), ...genSecondaryStructureSection('H', 11, 4)],
        ]}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('Should be able to determine the number of legend entries that will be created..', () => {
    const wrapper = shallow(
      <ContactMapChart
        contactData={[
          { name: 'first', nodeSize: 10, points: [] },
          { name: 'second', nodeSize: 10, points: [] },
          { name: 'first', nodeSize: 10, points: [] },
        ]}
      />,
    );
    const state = wrapper.state() as IContactMapChartState;
    expect(state.numLegends).toEqual(2);
  });
});
