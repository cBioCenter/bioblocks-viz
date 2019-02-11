import { Map, Set } from 'immutable';
import { combineReducers } from 'redux';

import { RESIDUE_TYPE } from '~chell-viz~/data';
import { ContainerReducer, ObjectReducer, ReducerRegistry } from '~chell-viz~/reducer';

export interface ILockedResiduePair {
  [key: string]: RESIDUE_TYPE[];
}

export interface IResiduePairReducerState {
  candidates: Set<RESIDUE_TYPE>;
  hovered: Set<RESIDUE_TYPE>;
  locked: Map<string, Set<RESIDUE_TYPE>>;
}

export const RESIDUE_PAIR_DATASET_NAME = 'residuePair';

export const ResiduePairReducer = (namespace = 'chell') => {
  return combineReducers({
    candidates: ContainerReducer<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/candidates`, namespace),
    hovered: ContainerReducer<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/hovered`, namespace),
    locked: ObjectReducer<Map<string, RESIDUE_TYPE[]>>(`${RESIDUE_PAIR_DATASET_NAME}/locked`, namespace),
  });
};

export const createResiduePairReducer = (namespace = 'chell') => {
  const reducer = ResiduePairReducer(namespace);

  const reducerName = `${namespace}/${RESIDUE_PAIR_DATASET_NAME}`;
  ReducerRegistry.register(reducerName, reducer);
};
