import { Set } from 'immutable';
import * as React from 'react';
import { isArray } from 'util';

import { Dataset } from '~chell-viz~/data';
import {
  createContainerReducer,
  createDataReducer,
  createObjectReducer,
  createValueReducer,
} from '~chell-viz~/reducer';

export const enum CHELL_LOADING_STATUS {
  'ERROR',
  'LOADING',
  'NOT_STARTED',
  'READY',
}

export type ChellHookCallback<T> = () => T;

export interface IChellHookDict {
  [key: string]: ChellHookCallback<any>;
}

export abstract class ChellVisualization<P = any, S = any, SS = any> extends React.Component<P, S, SS> {
  public static getActiveChellVisualizations = () => {
    return ChellVisualization.activeChellVisualizations;
  };

  public static getActiveChellHooks = () => {
    let allHooks: IChellHookDict = {};

    ChellVisualization.activeChellVisualizations.forEach(viz => {
      if (viz) {
        allHooks = {
          ...allHooks,
          ...viz.chellHooks,
        };
      }
    });

    return allHooks;
  };

  public static getActiveDatasets = () => {
    let allDatasets = Set<Dataset>();

    ChellVisualization.activeChellVisualizations.forEach(viz => {
      if (viz) {
        allDatasets = allDatasets.merge(viz.datasets);
      }
    });

    return allDatasets;
  };

  private static activeChellVisualizations = Set<ChellVisualization>();

  protected chellHooks: IChellHookDict = {};
  protected datasets = Set<Dataset>();

  private loadingStatus = CHELL_LOADING_STATUS.NOT_STARTED;

  constructor(props: P) {
    super(props);
    ChellVisualization.activeChellVisualizations = ChellVisualization.activeChellVisualizations.add(this);
    this.setupDataServices();
  }

  public abstract setupDataServices(): void;

  public componentWillUnmount() {
    this.teardown();
  }

  public addChellHook<T>(name: string, cb: () => T) {
    this.chellHooks[name] = cb;
  }

  public registerDataset<T>(name: string, defaultValue?: T, namespace = 'chell') {
    this.datasets = this.datasets.add(new Dataset(name, namespace));
    this.createReducer(name, defaultValue, namespace);
  }

  public finishLoading() {
    this.loadingStatus = CHELL_LOADING_STATUS.READY;
  }

  public getDatasets() {
    return this.datasets;
  }

  public getComponentChellHooks() {
    return this.chellHooks;
  }

  public getLoadingStatus() {
    return this.loadingStatus;
  }

  public teardown() {
    // TODO Can it be enforced that this method is always called?
    ChellVisualization.activeChellVisualizations = ChellVisualization.activeChellVisualizations.remove(this);
  }

  protected createReducer<T>(datasetName: string, defaultValue?: T, namespace = 'chell') {
    if (isArray(defaultValue)) {
      createContainerReducer<T>(datasetName, namespace);
    } else if (typeof defaultValue === 'object') {
      createObjectReducer<T>(datasetName, namespace);
    } else if (defaultValue === undefined) {
      createDataReducer<T>(datasetName, namespace);
    } else {
      createValueReducer<T>(datasetName, namespace);
    }
  }
}
