import { RootState } from '~chell-viz~/reducer';

// tslint:disable-next-line:export-name
export const selectCurrentItem = <T>(
  state: RootState,
  dataset: string,
  defaultValue: T | null = null,
  namespace = 'chell',
) => (state && state[`${namespace}/${dataset}`] ? (state[`${namespace}/${dataset}`] as T) : defaultValue);
