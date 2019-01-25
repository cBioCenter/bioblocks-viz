import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
// tslint:disable-next-line:no-submodule-imports
import { PayloadMetaAction } from 'typesafe-actions/dist/types';

import { RootState } from '~chell-viz~/reducer';

export interface IChellStateTransform {
  fromState:
    | string
    | {
        namespace?: string;
        stateName: string;
      };
  toState:
    | string
    | {
        namespace?: string;
        stateName: string;
      };
  fn(state: RootState): any;
}

export const ChellMiddleware: Middleware = (store: MiddlewareAPI<Dispatch, RootState>) => next => (
  action: PayloadMetaAction<string, any, string>,
) => {
  const dispatchResult = next(action);
  for (const key of ChellMiddlewareTransformer.transforms.keys()) {
    const splitKey = key.split('-');
    if (splitKey[0].includes(action.meta)) {
      const transformFn = ChellMiddlewareTransformer.transforms.get(key);
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

export class ChellMiddlewareTransformer {
  public static transforms = new Map<string, <T>(state: RootState) => T>();

  public static addTransform(transform: IChellStateTransform) {
    const DEFAULT_NAMESPACE = 'chell';
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
