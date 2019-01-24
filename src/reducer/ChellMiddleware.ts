import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
// tslint:disable-next-line:no-submodule-imports
import { PayloadMetaAction } from 'typesafe-actions/dist/types';

import { RootState } from '~chell-viz~/reducer';

export const ChellMiddleware: Middleware = (store: MiddlewareAPI<Dispatch, RootState>) => next => (
  action: PayloadMetaAction<string, any, string>,
) => {
  const dispatchResult = next(action);
  for (const key of ChellMiddlewareTransformer.transforms.keys()) {
    const splitKey = key.split('-');
    if (splitKey[0].localeCompare(action.meta) === 0) {
      const transformFn = ChellMiddlewareTransformer.transforms.get(key);
      if (transformFn) {
        const state: RootState = store.getState();
        const payload = transformFn(state);
        store.dispatch({
          payload,
          type: `CHELL/${splitKey[splitKey.length - 1]}_SET`.toUpperCase(),
        });
      }
    }
  }

  return dispatchResult;
};

export class ChellMiddlewareTransformer {
  public static transforms = new Map<string, <T>(state: RootState) => T>();

  public static addTransform(fromState: string, toState: string, fn: (state: RootState) => any) {
    const key = `${fromState}-${toState}`;
    this.transforms.set(key, fn);
  }

  constructor(readonly requiredDataSubs: string[] = []) {}
}
