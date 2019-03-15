import { combineReducers } from 'redux';

import { ISpringGraphData } from '~bioblocks-viz~/data';
import { DataReducer, ReducerRegistry, ValueReducer } from '~bioblocks-viz~/reducer';

export interface ISpringReducerState {
  category: string;
  graphData: ISpringGraphData;
}

export const SpringReducer = (namespace = 'bioblocks') => {
  return combineReducers({
    category: ValueReducer<string>('spring/category', '', namespace),
    graphData: DataReducer<ISpringGraphData>('spring/graphData', { nodes: [] }, namespace),
  });
};

export const createSpringReducer = (namespace = 'bioblocks') => {
  const reducer = SpringReducer(namespace);

  const reducerName = `${namespace}/spring`;
  ReducerRegistry.register(reducerName, reducer);
};
