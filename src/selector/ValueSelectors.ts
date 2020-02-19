// ~bb-viz~
// Value Selector
// Selector for getting the state as a primitive value.
// ~bb-viz~

import { RootState } from '~bioblocks-viz~/reducer';

// tslint:disable-next-line:export-name
export const selectCurrentValue = <T>(
  state: RootState,
  dataset: string,
  defaultValue: T | null = null,
  namespace = 'bioblocks',
) => (state && state[`${namespace}/${dataset}`] ? (state[`${namespace}/${dataset}`] as T) : defaultValue);
