import { combineReducers } from 'redux';

import { ISpringGraphData } from '~chell-viz~/data';
import { ContainerReducer, DataReducer, ReducerRegistry } from '~chell-viz~/reducer';

export const SpringReducer = (namespace = 'chell') => {
  return combineReducers({
    graphData: DataReducer<ISpringGraphData>('spring/graphData', namespace),
    species: ContainerReducer<string>('spring/species', namespace),
  });
};

export const createSpringReducer = (namespace = 'chell') => {
  const reducer = SpringReducer(namespace);

  const reducerName = `${namespace}/spring`;
  ReducerRegistry.register(reducerName, reducer);
};
