import { Reducer } from 'redux';
import { StateType } from 'typesafe-actions';

export interface IReducerMap {
  [key: string]: Reducer;
}
export type ReducerRegistryListener = (...args: any[]) => void;
export type RootState = StateType<{ [key: string]: Reducer }>;

/**
 *
 * Based off this post on how Twitter handles redux modules:
 * http://nicolasgallagher.com/redux-modules-and-code-splitting/
 */
class ReducerRegistryClass {
  private emitChange: null | ReducerRegistryListener;
  private reducers: IReducerMap = {};

  constructor() {
    this.emitChange = null;
  }

  public getReducers() {
    return { ...this.reducers };
  }

  public register(name: string, reducer: Reducer) {
    this.reducers = { ...this.reducers, [name]: reducer };
    if (this.emitChange) {
      this.emitChange(this.getReducers());
    }
  }

  public setChangeListener(listener: ReducerRegistryListener) {
    this.emitChange = listener;
  }
}

const configureReducerRegistry = () => new ReducerRegistryClass();

const ReducerRegistry = configureReducerRegistry();

export { ReducerRegistry };
