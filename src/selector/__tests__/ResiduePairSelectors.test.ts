import { Map, Set } from 'immutable';

import { RESIDUE_TYPE } from '~bioblocks-viz~/data';
import { RootState } from '~bioblocks-viz~/reducer';
import { getCandidates, getHovered, getLocked, getResiduePairs } from '~bioblocks-viz~/selector';

describe('ResiduePairSelectors', () => {
  it('Should create a new residuePair state if one does not exist.', () => {
    const expectedState = {
      candidates: Set<RESIDUE_TYPE>(),
      hovered: Set<RESIDUE_TYPE>(),
      locked: Map<string, RESIDUE_TYPE[]>(),
    };

    const state: RootState = {};
    expect(getResiduePairs(state)).toMatchObject(expectedState);
    expect(getCandidates(state)).toMatchObject(expectedState.candidates);
    expect(getHovered(state)).toMatchObject(expectedState.hovered);
    expect(getLocked(state)).toMatchObject(expectedState.locked);
  });

  it('Should select the residuePair state if one already exist.', () => {
    const expectedState = {
      candidates: Set<RESIDUE_TYPE>([4, 2, 42]),
      hovered: Set<RESIDUE_TYPE>([7, 13]),
      locked: Map<string, RESIDUE_TYPE[]>([{ '1,3': [1, 3] }]),
    };

    const state = {
      ['bioblocks/residuePair']: {
        candidates: Set<RESIDUE_TYPE>([4, 2, 42]),
        hovered: Set<RESIDUE_TYPE>([7, 13]),
        locked: Map<string, RESIDUE_TYPE[]>([{ '1,3': [1, 3] }]),
      },
    };

    expect(getResiduePairs(state)).toMatchObject(expectedState);
    expect(getCandidates(state)).toMatchObject(expectedState.candidates);
    expect(getHovered(state)).toMatchObject(expectedState.hovered);
    expect(getLocked(state)).toMatchObject(expectedState.locked);
  });
});
