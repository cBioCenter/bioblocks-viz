import { shallow } from 'enzyme';
import * as React from 'react';

import { InfoPanelContainerClass } from '~chell-viz~/container';
import { ChellPDB, CouplingContainer, IContactMapData, SECONDARY_STRUCTURE } from '~chell-viz~/data';

describe('InfoPanelContainer', () => {
  let pdbData: ChellPDB;
  let sampleData: IContactMapData;

  beforeEach(async () => {
    pdbData = await ChellPDB.createPDB('../../../test/data/protein.pdb');

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
    const wrapper = shallow(<InfoPanelContainerClass data={{ ...sampleData, pdbData: { known: pdbData } }} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data and a predicted PDB.', () => {
    const wrapper = shallow(<InfoPanelContainerClass data={{ ...sampleData, pdbData: { predicted: pdbData } }} />);
    expect(wrapper).toMatchSnapshot();
  });
});
