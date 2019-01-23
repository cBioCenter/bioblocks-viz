import { Middleware } from 'redux';

// tslint:disable-next-line:no-submodule-imports
import { PayloadMetaAction } from 'typesafe-actions/dist/types';

export const ChellMiddleware: Middleware = store => next => (action: PayloadMetaAction<string, any, string>) => {
  const dispatchResult = next(action);
  for (const key of ChellMiddlewareTransformer.transforms.keys()) {
    if (key.split('-')[0].localeCompare(action.meta) === 0) {
      const transformFn = ChellMiddlewareTransformer.transforms.get(key);
      if (transformFn) {
        console.log(transformFn(store.getState()));
      }
    }
  }

  return dispatchResult;
};

export class ChellMiddlewareTransformer {
  public static transforms = new Map<string, ((...args: any[]) => any)>();

  public static addTransform(fromState: string, toState: string, fn: (...args: any[]) => any) {
    const key = `${fromState}-${toState}`;
    this.transforms.set(key, fn);
  }

  constructor(readonly requiredDataSubs: string[] = []) {}
}
