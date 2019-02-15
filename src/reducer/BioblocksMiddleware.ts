import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
// tslint:disable-next-line:no-submodule-imports
import { PayloadMetaAction } from 'typesafe-actions/dist/types';

import { RootState } from '~bioblocks-viz~/reducer';

export interface IBioblocksStateTransformState {
  namespace?: string;
  stateName: string;
}

export interface IBioblocksStateTransform {
  fromState: string | IBioblocksStateTransformState;
  toState: string | IBioblocksStateTransformState;
  fn(state: RootState): any;
}

export const BioblocksMiddleware: Middleware = (store: MiddlewareAPI<Dispatch, RootState>) => next => (
  action: PayloadMetaAction<string, any, string>,
) => {
  const dispatchResult = next(action);
  for (const key of BioblocksMiddlewareTransformer.transforms.keys()) {
    const splitKey = key.split('-');
    if (splitKey[0].includes(action.meta)) {
      const transformFn = BioblocksMiddlewareTransformer.transforms.get(key);
      if (transformFn) {
        const state: RootState = store.getState();
        const payload = transformFn(state);
        store.dispatch({
          payload,
          type: `${splitKey[splitKey.length - 1]}_SET`.toUpperCase(),
        });
      }
    }
  }

  return dispatchResult;
};

export class BioblocksMiddlewareTransformer {
  public static transforms = new Map<string, <T>(state: RootState) => T>();

  public static addTransform(transform: IBioblocksStateTransform) {
    const DEFAULT_NAMESPACE = 'bioblocks';
    const { fromState, toState } = transform;

    const fromKey =
      typeof fromState === 'string'
        ? fromState
        : `${fromState.namespace ? fromState.namespace : DEFAULT_NAMESPACE}/${fromState.stateName}`;
    const toKey =
      typeof toState === 'string'
        ? toState
        : `${toState.namespace ? toState.namespace : DEFAULT_NAMESPACE}/${toState.stateName}`;
    this.transforms.set(`${fromKey}-${toKey}`, transform.fn);
  }

  constructor(readonly requiredDataSubs: string[] = []) {}
}
