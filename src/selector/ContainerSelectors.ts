import { Set } from 'immutable';

import { IContainerReducerState, RootState } from '~chell-viz~/reducer';

// tslint:disable-next-line:export-name
export const selectCurrentItems = <T>(state: RootState, dataset: string, namespace = 'chell') =>
  state && state[`${namespace}/${dataset}`]
    ? (state[`${namespace}/${dataset}`] as IContainerReducerState<T>)
    : Set<T>();
