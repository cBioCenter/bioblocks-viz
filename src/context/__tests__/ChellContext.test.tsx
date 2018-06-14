import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';

import ChellContext from '../ChellContext';

describe('ChellContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = shallow(<ChellContext />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('Cell Context', () => {
    it('Should correctly add cells.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state;
      const expectedState = {
        ...initialState.cellContext,
        currentCells: [1, 2, 3, 4],
      };
      instance.onAddCells([1, 2, 3, 4]);
      expect(instance.state.cellContext).toEqual(expectedState);
    });

    it('Should remove old cells when new ones are added.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.cellContext;
      const expectedState = {
        ...initialState,
        currentCells: [1, 4],
      };
      instance.onAddCells([1, 2, 3, 4]);
      instance.onAddCells([1, 4]);
      expect(instance.state.cellContext).toEqual(expectedState);
    });

    it('Should allow specific cells to be removed', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.cellContext;
      const expectedState = {
        ...initialState,
        currentCells: [2],
      };
      instance.onAddCells([1, 2, 3, 4]);
      instance.onRemoveCells([1, 3, 4]);
      expect(instance.state.cellContext).toEqual(expectedState);
    });

    it('Should allow all cells to be removed', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.cellContext;
      const expectedState = {
        ...initialState,
        currentCells: [],
      };
      instance.onAddCells([1, 2, 3, 4]);
      instance.onRemoveAllCells();
      expect(instance.state.cellContext).toEqual(expectedState);
    });
  });

  describe('Residue Context', () => {
    it('Should add the candidate residue correctly.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        candidateResidues: [3],
      };
      instance.onAddCandidateResidues([3]);
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should remove the candidate residue correctly.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        candidateResidues: [],
      };
      instance.onAddCandidateResidues([3]);
      instance.onRemoveCandidateResidue();
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should add a single hovered residue.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        hoveredResidues: [7],
      };
      instance.onAddHoveredResidues([7]);
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should add multiple residues as hovered residues.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        hoveredResidues: [7, 9],
      };
      instance.onAddHoveredResidues([9, 7]);
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should remove the hovered residue correctly.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        hoveredResidues: [],
      };
      instance.onAddHoveredResidues([7]);
      instance.onRemoveHoveredResidue();
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should add a locked residue pair correctly.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        lockedResiduePairs: new Map(
          Object.entries({
            '1,2': [1, 2],
          }),
        ),
      };
      instance.onAddLockedResiduePair([1, 2]);
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should allow multiple locked residues to be added in various dimensions correctly.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        lockedResiduePairs: new Map(
          Object.entries({
            '1,2': [1, 2],
            '5': [5],
            '6,7,8,9': [6, 7, 8, 9],
          }),
        ),
      };
      instance.onAddLockedResiduePair([1, 2]);
      instance.onAddLockedResiduePair([5]);
      instance.onAddLockedResiduePair([6, 7, 8, 9]);
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should map identical residue pairs regardless of the order they are supplied.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        lockedResiduePairs: new Map(
          Object.entries({
            '1,2': [1, 2],
          }),
        ),
      };
      instance.onAddLockedResiduePair([1, 2]);
      instance.onAddLockedResiduePair([2, 1]);
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should allow locked residues to be removed while preserving the other pairs.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        lockedResiduePairs: new Map(
          Object.entries({
            '1,2': [1, 2],
            '6,7,8,9': [6, 7, 8, 9],
          }),
        ),
      };
      instance.onAddLockedResiduePair([5]);
      instance.onAddLockedResiduePair([1, 2]);
      instance.onAddLockedResiduePair([6, 7, 8, 9]);
      instance.onRemoveLockedResiduePair([5]);
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should not alter current state if non-existing residue pair is requested to be removed.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        lockedResiduePairs: new Map(
          Object.entries({
            '1,2': [1, 2],
            '5': [5],
            '6,7,8,9': [6, 7, 8, 9],
          }),
        ),
      };
      instance.onAddLockedResiduePair([5]);
      instance.onAddLockedResiduePair([1, 2]);
      instance.onAddLockedResiduePair([6, 7, 8, 9]);
      instance.onRemoveLockedResiduePair([666]);
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should allow all locked residues to be removed.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        lockedResiduePairs: new Map(),
      };
      instance.onAddLockedResiduePair([5]);
      instance.onAddLockedResiduePair([1, 2]);
      instance.onAddLockedResiduePair([9, 8, 7, 6]);
      instance.onRemoveAllLockedResiduePairs();
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should allow all residues to be removed.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        candidateResidues: [],
        hoveredResidues: [],
        lockedResiduePairs: new Map(),
      };
      instance.onAddCandidateResidues([1]);
      instance.onAddHoveredResidues([2, 3]);
      instance.onAddLockedResiduePair([4, 5]);

      expect(instance.state.residueContext).toEqual({
        ...initialState,
        candidateResidues: [1],
        hoveredResidues: [2, 3],
        lockedResiduePairs: new Map(Object.entries({ '4,5': [4, 5] })),
      });

      instance.onClearAllResidues();
      expect(instance.state.residueContext).toEqual(expectedState);
    });

    it('Should allow a locked residue pair to be toggled.', () => {
      const instance = shallow(<ChellContext />).instance() as ChellContext;
      const initialState = instance.state.residueContext;
      const expectedState = {
        ...initialState,
        lockedResiduePairs: new Map(),
      };
      instance.onToggleLockedResiduePair([5]);
      expect(instance.state.residueContext).toEqual({
        ...initialState,
        lockedResiduePairs: new Map([['5', [5]]]),
      });

      instance.onToggleLockedResiduePair([5]);
      expect(instance.state.residueContext).toEqual(expectedState);
    });
  });
});
