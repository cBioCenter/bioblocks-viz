import { shallow } from 'enzyme';
import * as React from 'react';

import { InfoPanelContainerClass } from '~bioblocks-viz~/container';
import { BioblocksPDB, CouplingContainer, IContactMapData, SECONDARY_STRUCTURE } from '~bioblocks-viz~/data';

describe('InfoPanelContainer', () => {
  let pdbData: BioblocksPDB;
  let sampleData: IContactMapData;

  beforeEach(async () => {
    pdbData = await BioblocksPDB.createPDB('../../../test/data/protein.pdb');

    sampleData = {
      couplingScores: new CouplingContainer([{ i: 1, j: 2 }, { i: 3, j: 4 }]),
      secondaryStructures: [
        [
          {
            end: 31,
            label: 'C',
            length: 2,
            start: 30,
          },
        ],
      ] as SECONDARY_STRUCTURE[],
    };
  });

  it('Should match existing snapshot when given no props.', () => {
    const wrapper = shallow(<InfoPanelContainerClass />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data.', () => {
    const wrapper = shallow(<InfoPanelContainerClass data={sampleData} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data and a known PDB.', () => {
    const wrapper = shallow(<InfoPanelContainerClass data={{ ...sampleData, pdbData: { experimental: pdbData } }} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data and a predicted PDB.', () => {
    const wrapper = shallow(<InfoPanelContainerClass data={{ ...sampleData, pdbData: { predicted: pdbData } }} />);
    expect(wrapper).toMatchSnapshot();
  });
});
