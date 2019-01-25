import { combineReducers } from 'redux';

import { ISpringGraphData, SPECIES_TYPE } from '~chell-viz~/data';
import { DataReducer, ReducerRegistry, ValueReducer } from '~chell-viz~/reducer';

export interface ISpringReducerState {
  category: string;
  graphData: ISpringGraphData;
  species: SPECIES_TYPE;
}

export const SpringReducer = (namespace = 'chell') => {
  return combineReducers({
    category: ValueReducer<string>('spring/category', namespace),
    graphData: DataReducer<ISpringGraphData>('spring/graphData', namespace),
    species: ValueReducer<SPECIES_TYPE>('spring/species', namespace),
  });
};

export const createSpringReducer = (namespace = 'chell') => {
  const reducer = SpringReducer(namespace);

  const reducerName = `${namespace}/spring`;
  ReducerRegistry.register(reducerName, reducer);
};
