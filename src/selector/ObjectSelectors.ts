import { Map } from 'immutable';

import { IObjectReducerState, RootState } from '~chell-viz~/reducer';

// tslint:disable-next-line:export-name
export const selectObject = <T>(state: RootState, dataset: string, namespace = 'chell') =>
  state && state[`${namespace}/${dataset}`]
    ? (state[`${namespace}/${dataset}`] as IObjectReducerState<T>)
    : Map<string, T>();
