import { Map, Set } from 'immutable';
import { RESIDUE_TYPE } from '~bioblocks-viz~/data';
import { IResiduePairReducerState, RootState } from '~bioblocks-viz~/reducer';

// tslint:disable-next-line:export-name
export const getResiduePairs = (state: RootState, namespace = 'bioblocks') => {
  return (state === undefined || !state[`${namespace}/residuePair`]
    ? {
        candidates: Set<RESIDUE_TYPE>(),
        hovered: Set<RESIDUE_TYPE>(),
        locked: Map<string, RESIDUE_TYPE[]>(),
      }
    : state[`${namespace}/residuePair`]) as IResiduePairReducerState;
};

export const getCandidates = (state: RootState, namespace = 'bioblocks') =>
  getResiduePairs(state, namespace).candidates;
export const getHovered = (state: RootState, namespace = 'bioblocks') => getResiduePairs(state, namespace).hovered;
export const getLocked = (state: RootState, namespace = 'bioblocks') => getResiduePairs(state, namespace).locked;
