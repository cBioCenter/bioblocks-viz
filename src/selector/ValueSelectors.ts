import { RootState } from '~chell-viz~/reducer';

// tslint:disable-next-line:export-name
export const selectCurrentItem = <T>(state: RootState, dataset: string, namespace = 'chell') =>
  state && state[`${namespace}/${dataset}`] ? (state[`${namespace}/${dataset}`] as T) : null;
