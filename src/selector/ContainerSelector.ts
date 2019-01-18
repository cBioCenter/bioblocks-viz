import { Set } from 'immutable';
import { IContainerReducerState, RootState } from '~chell-viz~/reducer';

// tslint:disable-next-line:export-name
export const selectCurrentItems = <T>(state: RootState, dataSubscription: string, namespace = 'chell') =>
  state[`${namespace}/${dataSubscription}`]
    ? (state[`${namespace}/${dataSubscription}`] as IContainerReducerState<T>).items
    : Set<T>();
