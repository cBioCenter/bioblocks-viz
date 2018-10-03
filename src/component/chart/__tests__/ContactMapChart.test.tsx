import { shallow } from 'enzyme';
import * as React from 'react';

import {
  Chell1DSection,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_CODES,
  SECONDARY_STRUCTURE_KEYS,
} from '../../../data';
import ContactMapChart, { IContactMapChartState } from '../ContactMapChart';

describe('ContactMapChart', () => {
  const genSeqEntry = (
    structId: keyof typeof SECONDARY_STRUCTURE_CODES,
    resno: number,
    length: number = 1,
  ): SECONDARY_STRUCTURE => [new Chell1DSection<SECONDARY_STRUCTURE_KEYS>(structId, resno, resno + length - 1)];

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
        secondaryStructures={[[...genSeqEntry('H', 0, 3), ...genSeqEntry('E', 3, 1)]]}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given data with multiple secondary structures.', () => {
    const wrapper = shallow(
      <ContactMapChart
        contactData={emptyData}
        secondaryStructures={[
          [...genSeqEntry('H', 0, 3), ...genSeqEntry('E', 3, 1)],
          [...genSeqEntry('C', 0, 3), ...genSeqEntry('H', 11, 4)],
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
