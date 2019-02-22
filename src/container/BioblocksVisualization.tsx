import { Set } from 'immutable';
import * as React from 'react';
import { isArray } from 'util';

import { Dataset } from '~bioblocks-viz~/data';
import {
  createContainerReducer,
  createDataReducer,
  createObjectReducer,
  createValueReducer,
} from '~bioblocks-viz~/reducer';

export const enum BIOBLOCKS_LOADING_STATUS {
  'ERROR',
  'LOADING',
  'NOT_STARTED',
  'READY',
}

export type BioblocksHookCallback<T> = () => T;

export interface IBioblocksHookDict {
  [key: string]: BioblocksHookCallback<any>;
}

export abstract class BioblocksVisualization<P = any, S = any, SS = any> extends React.Component<P, S, SS> {
  public static getActiveBioblocksVisualizations = () => {
    return BioblocksVisualization.activeBioblocksVisualizations;
  };

  public static getActiveBioblocksHooks = () => {
    let allHooks: IBioblocksHookDict = {};

    BioblocksVisualization.activeBioblocksVisualizations.forEach(viz => {
      if (viz) {
        allHooks = {
          ...allHooks,
          ...viz.bioblocksHooks,
        };
      }
    });

    return allHooks;
  };

  public static getActiveDatasets = () => {
    let allDatasets = Set<Dataset>();

    BioblocksVisualization.activeBioblocksVisualizations.forEach(viz => {
      if (viz) {
        allDatasets = allDatasets.merge(viz.datasets);
      }
    });

    return allDatasets;
  };

  private static activeBioblocksVisualizations = Set<BioblocksVisualization>();

  protected bioblocksHooks: IBioblocksHookDict = {};
  protected datasets = Set<Dataset>();

  private loadingStatus = BIOBLOCKS_LOADING_STATUS.NOT_STARTED;

  constructor(props: P) {
    super(props);
    BioblocksVisualization.activeBioblocksVisualizations = BioblocksVisualization.activeBioblocksVisualizations.add(
      this,
    );
    this.setupDataServices();
  }

  public abstract setupDataServices(): void;

  public componentWillUnmount() {
    this.teardown();
  }

  public addBioblocksHook<T>(name: string, cb: () => T) {
    this.bioblocksHooks[name] = cb;
  }

  public registerDataset<T>(name: string, defaultValue?: T, namespace = 'bioblocks') {
    this.datasets = this.datasets.add(new Dataset(name, namespace));
    this.createReducer(name, defaultValue, namespace);
  }

  public finishLoading() {
    this.loadingStatus = BIOBLOCKS_LOADING_STATUS.READY;
  }

  public getDatasets() {
    return this.datasets;
  }

  public getComponentBioblocksHooks() {
    return this.bioblocksHooks;
  }

  public getLoadingStatus() {
    return this.loadingStatus;
  }

  public teardown() {
    // TODO Can it be enforced that this method is always called?
    BioblocksVisualization.activeBioblocksVisualizations = BioblocksVisualization.activeBioblocksVisualizations.remove(
      this,
    );
  }

  protected createReducer<T>(datasetName: string, defaultValue?: T, namespace = 'bioblocks') {
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
