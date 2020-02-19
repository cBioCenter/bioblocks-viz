// ~bb-viz~
// Residue Pair Reducer
// They are composed of the generic reducers from bioblocks-viz/reducer, serving as an example of their usage.
// ~bb-viz~

import { Map, Set } from 'immutable';
import { combineReducers } from 'redux';

import { RESIDUE_TYPE } from '~bioblocks-viz~/data';
import { ContainerReducer, ObjectReducer, ReducerRegistry } from '~bioblocks-viz~/reducer';

export type LockedResiduePair = Record<string, RESIDUE_TYPE[]>;

export interface IResiduePairReducerState {
  candidates: Set<RESIDUE_TYPE>;
  hovered: Set<RESIDUE_TYPE>;
  locked: Map<string, Set<RESIDUE_TYPE>>;
}

export const RESIDUE_PAIR_DATASET_NAME = 'residuePair';

export const ResiduePairReducer = (namespace = 'bioblocks') => {
  return combineReducers({
    candidates: ContainerReducer<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/candidates`, namespace),
    hovered: ContainerReducer<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/hovered`, namespace),
    locked: ObjectReducer<Map<string, RESIDUE_TYPE[]>>(`${RESIDUE_PAIR_DATASET_NAME}/locked`, namespace),
  });
};

export const createResiduePairReducer = (namespace = 'bioblocks') => {
  const reducer = ResiduePairReducer(namespace);

  const reducerName = `${namespace}/${RESIDUE_PAIR_DATASET_NAME}`;
  ReducerRegistry.register(reducerName, reducer);
};
