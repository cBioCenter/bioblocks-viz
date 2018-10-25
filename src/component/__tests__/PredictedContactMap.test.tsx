import { shallow } from 'enzyme';
import * as React from 'react';

import { PredictedContactMap, PredictedContactMapState } from '~chell-viz~/component';
import {
  Chell1DSection,
  CouplingContainer,
  IContactMapData,
  ICouplingScore,
  SECONDARY_STRUCTURE_KEYS,
} from '~chell-viz~/data';
import { getAsyncShallowComponent } from '~chell-viz~/test';

describe('PredictedContactMap', () => {
  let emptyData: IContactMapData;
  let sampleCorrectPredictedContacts: ICouplingScore[];
  let sampleData: IContactMapData;
  let sampleIncorrectPredictedContacts: ICouplingScore[];
  let sampleObservedContacts: ICouplingScore[];
  let sampleOutOfLinearDistContacts: ICouplingScore[];
  let uniqueScores: Set<ICouplingScore>;

  beforeEach(() => {
    emptyData = {
      couplingScores: new CouplingContainer(),
      secondaryStructures: [],
    };

    // Translated from example1/coupling_scores.csv
    sampleCorrectPredictedContacts = [generateCouplingScore(56, 50, 2.4)];
    sampleIncorrectPredictedContacts = [generateCouplingScore(42, 50, 20.4)];
    sampleObservedContacts = [...sampleCorrectPredictedContacts, generateCouplingScore(41, 52, 1.3)];
    sampleOutOfLinearDistContacts = [
      generateCouplingScore(45, 46, 1.3),
      generateCouplingScore(44, 45, 1.3),
      generateCouplingScore(56, 57, 1.3),
    ];

    uniqueScores = new Set(
      Array.from([
        ...sampleCorrectPredictedContacts,
        ...sampleIncorrectPredictedContacts,
        ...sampleObservedContacts,
        ...sampleOutOfLinearDistContacts,
      ]),
    );

    sampleData = {
      couplingScores: new CouplingContainer(Array.from(uniqueScores)),
      secondaryStructures: [[new Chell1DSection<SECONDARY_STRUCTURE_KEYS>('C', 30, 31)]],
    };
  });

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

  describe('Snapshots', () => {
    it('Should match existing snapshot when given no data.', () => {
      expect(shallow(<PredictedContactMap />)).toMatchSnapshot();
    });

    it('Should match existing snapshot when given empty data.', () => {
      expect(shallow(<PredictedContactMap data={emptyData} />)).toMatchSnapshot();
    });

    it('Should match snapshot when locked residues are added.', async () => {
      const wrapper = await getAsyncShallowComponent(<PredictedContactMap />);
      const expectedSelectedPoints = {
        '37,46': [37, 46],
        8: [8],
      };
      wrapper.setProps({
        lockedResiduePairs: expectedSelectedPoints,
      });
      wrapper.update();
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
    const state = wrapper.instance().state as PredictedContactMapState;
    expect(state.pointsToPlot).not.toEqual([]);
    expect(state.pointsToPlot).toMatchSnapshot();
  });
});
