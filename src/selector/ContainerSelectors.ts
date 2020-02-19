// ~bb-viz~
// Container Selector
// Selector for getting the state from a container.
// ~bb-viz~

import { Set } from 'immutable';

import { IContainerReducerState, RootState } from '~bioblocks-viz~/reducer';

// tslint:disable-next-line:export-name
export const selectCurrentItems = <T>(state: RootState, dataset: string, namespace = 'bioblocks') =>
  state && state[`${namespace}/${dataset}`]
    ? (state[`${namespace}/${dataset}`] as IContainerReducerState<T>)
    : Set<T>();
