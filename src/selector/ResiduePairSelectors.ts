import { Map, Set } from 'immutable';
import { RESIDUE_TYPE } from '~chell-viz~/data';
import { IResiduePairReducerState, RootState } from '~chell-viz~/reducer';

// tslint:disable-next-line:export-name
export const getResiduePairs = (state: RootState, namespace = 'chell') => {
  return (state === undefined || !state[`${namespace}/residuePair`]
    ? {
        candidates: Set<RESIDUE_TYPE>(),
        hovered: Set<RESIDUE_TYPE>(),
        locked: Map<string, RESIDUE_TYPE[]>(),
      }
    : state[`${namespace}/residuePair`]) as IResiduePairReducerState;
};

export const getCandidates = (state: RootState, namespace = 'chell') => getResiduePairs(state, namespace).candidates;
export const getHovered = (state: RootState, namespace = 'chell') => getResiduePairs(state, namespace).hovered;
export const getLocked = (state: RootState, namespace = 'chell') => getResiduePairs(state, namespace).locked;
