import { shallow } from 'enzyme';
import * as React from 'react';

import { CONTACT_DISTANCE_PROXIMITY, ICouplingScore, SECONDARY_STRUCTURE_CODES } from '../../data/chell-data';
import { ChellPDB } from '../../data/ChellPDB';
import { CouplingContainer } from '../../data/CouplingContainer';
import { PredictedContactMap } from '../PredictedContactMap';

describe('PredictedContactMap', () => {
  const emptyData = {
    couplingScores: new CouplingContainer(),
    secondaryStructures: [],
  };

  const generateCouplingScore = (
    i: number,
    j: number,
    dist: number,
    extra?: Partial<ICouplingScore>,
  ): ICouplingScore => ({
    dist,
    i,
    j,
    ...extra,
  });

  // Translated from example1/coupling_scores.csv
  const sampleCorrectPredictedContacts = [generateCouplingScore(56, 50, 2.4)];
  const sampleIncorrectPredictedContacts = [generateCouplingScore(42, 50, 20.4)];
  const sampleOutOfLinearDistContacts = [
    generateCouplingScore(45, 46, 1.3),
    generateCouplingScore(44, 45, 1.3),
    generateCouplingScore(56, 57, 1.3),
  ];
  const sampleObservedContacts = [...sampleCorrectPredictedContacts, generateCouplingScore(41, 52, 1.3)];

  const uniqueScores = new Set(
    Array.from([
      ...sampleCorrectPredictedContacts,
      ...sampleIncorrectPredictedContacts,
      ...sampleObservedContacts,
      ...sampleOutOfLinearDistContacts,
    ]),
  );

  const sampleData = {
    couplingScores: new CouplingContainer(Array.from(uniqueScores)),
    secondaryStructures: [
      { resno: 30, structId: 'C' as keyof typeof SECONDARY_STRUCTURE_CODES },
      { resno: 31, structId: 'C' as keyof typeof SECONDARY_STRUCTURE_CODES },
    ],
  };

  const sampleDataWithPDB = async () => ({
    couplingScores: new CouplingContainer(Array.from(uniqueScores)),
    pdbData: await ChellPDB.createPDB('sample/protein.pdb'),
    secondaryStructures: [
      { resno: 30, structId: 'C' as keyof typeof SECONDARY_STRUCTURE_CODES },
      { resno: 31, structId: 'C' as keyof typeof SECONDARY_STRUCTURE_CODES },
    ],
  });

  describe('Snapshots', () => {
    it('Should match existing snapshot when given no data.', () => {
      expect(shallow(<PredictedContactMap />)).toMatchSnapshot();
    });

    it('Should match existing snapshot when given empty data.', () => {
      expect(shallow(<PredictedContactMap data={emptyData} />)).toMatchSnapshot();
    });

    it('Should match snapshot when locked residues are added.', async () => {
      const wrapper = await shallow(<PredictedContactMap />);
      const expectedSelectedPoints = {
        '37,46': [37, 46],
        '8': [8],
      };
      wrapper.setProps({
        lockedResiduePairs: expectedSelectedPoints,
      });
      await wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Sliders', () => {
    it('Should update linear distance filter when appropriate slider is updated.', () => {
      const wrapper = shallow(<PredictedContactMap data={sampleData} />);
      const instance = wrapper.instance() as PredictedContactMap;
      const expected = 10;
      expect(instance.state.linearDistFilter).not.toBe(expected);
      instance.onLinearDistFilterChange()(expected);
      instance.forceUpdate();
      expect(instance.state.linearDistFilter).toBe(expected);
    });

    it('Should update number of predicted contacts to show when appropriate slider is updated.', () => {
      const wrapper = shallow(<PredictedContactMap data={sampleData} />);
      const instance = wrapper.instance() as PredictedContactMap;
      const expectedCount = 50;
      expect(instance.state.numPredictionsToShow).not.toBe(expectedCount);
      instance.onNumPredictionsToShowChange()(expectedCount);
      wrapper.update();
      expect(instance.state.numPredictionsToShow).toBe(expectedCount);
    });

    it('Should update # of predicted contacts to show when appropriate slider is updated.', () => {
      const wrapper = shallow(<PredictedContactMap data={sampleData} />);
      const instance = wrapper.instance() as PredictedContactMap;
      const expected = 20;
      expect(instance.state.numPredictionsToShow).not.toBe(expected);
      instance.onNumPredictionsToShowChange()(expected);
      wrapper.update();
      expect(instance.state.numPredictionsToShow).toBe(expected);
    });

    it('Should update how Measured Proximity is determined.', () => {
      const wrapper = shallow(<PredictedContactMap data={sampleData} />);
      const instance = wrapper.instance() as PredictedContactMap;
      const expected = CONTACT_DISTANCE_PROXIMITY.C_ALPHA;
      expect(instance.state.measuredProximity).not.toBe(expected);
      instance.onMeasuredProximityChange()(Object.values(CONTACT_DISTANCE_PROXIMITY).indexOf(expected));
      wrapper.update();
      expect(instance.state.measuredProximity).toBe(expected);
    });
  });

  it('Should update chain length when new non-pdb data is provided.', () => {
    const expected = 56;
    const wrapper = shallow(<PredictedContactMap data={emptyData} />);
    expect(wrapper.state('numPredictionsToShow')).not.toBe(expected);
    wrapper.setProps({
      data: sampleData,
    });
    expect(wrapper.state('chainLength')).toBe(expected);
  });

  it('Should update chain length when new pdb data is provided.', async () => {
    const expected = 56;
    const wrapper = shallow(<PredictedContactMap data={emptyData} />);
    expect(wrapper.state('numPredictionsToShow')).not.toBe(expected);
    wrapper.setProps({
      data: await sampleDataWithPDB(),
    });
    expect(wrapper.state('chainLength')).toBe(expected);
  });

  it('Should update number of predictions to show when new data is provided.', () => {
    const expected = 28;
    const wrapper = shallow(<PredictedContactMap data={emptyData} />);
    expect(wrapper.state('numPredictionsToShow')).not.toBe(expected);
    wrapper.setProps({
      data: sampleData,
    });
    expect(wrapper.state('numPredictionsToShow')).toBe(expected);
  });

  it('Should update number of predictions to show when new value is received.', () => {
    const expected = 28;
    const wrapper = shallow(<PredictedContactMap data={emptyData} />);
    expect(wrapper.state('numPredictionsToShow')).not.toBe(expected);
    wrapper.setState({
      numPredictionsToShow: expected,
    });
    expect(wrapper.state('numPredictionsToShow')).toBe(expected);
  });

  it('Should update points to plot when new data is provided.', () => {
    const wrapper = shallow(<PredictedContactMap data={emptyData} />);
    wrapper.setProps({
      data: sampleData,
    });
    expect(wrapper.state('pointsToPlot')).not.toEqual([]);
    expect(wrapper.state('pointsToPlot')).toMatchSnapshot();
  });

  it('Should update points to plot using closest atom for distance determination.', async () => {
    const wrapper = shallow(<PredictedContactMap data={emptyData} />);
    wrapper.setProps({
      data: await sampleDataWithPDB(),
    });
    wrapper.setState({
      measuredProximity: CONTACT_DISTANCE_PROXIMITY.CLOSEST,
    });
    expect(wrapper.state('pointsToPlot')).not.toEqual([]);
    expect(wrapper.state('pointsToPlot')).toMatchSnapshot();
  });

  it('Should update points to plot using C-Alpha for distance determination.', async () => {
    const wrapper = shallow(<PredictedContactMap data={emptyData} />);
    wrapper.setProps({
      data: await sampleDataWithPDB(),
    });
    wrapper.setState({
      measuredProximity: CONTACT_DISTANCE_PROXIMITY.C_ALPHA,
    });
    expect(wrapper.state('pointsToPlot')).not.toEqual([]);
    expect(wrapper.state('pointsToPlot')).toMatchSnapshot();
  });
});
