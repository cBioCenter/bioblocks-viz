import * as React from 'react';
import { createContainerReducer } from '~chell-viz~/reducer';

export type CHELL_LOADING_STATUS = 'ERROR' | 'LOADING' | 'NOT_STARTED' | 'READY';

export abstract class ChellVisualization<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  protected datasets: string[] = [];

  private loadingStatus: CHELL_LOADING_STATUS = 'NOT_STARTED';

  constructor(props: P) {
    super(props);
    this.setupDataServices();
  }

  public abstract setupDataServices(): void;

  public addDatasets(datasets: string[], namespace = 'chell') {
    this.datasets = datasets;
    for (const dataset of datasets) {
      createContainerReducer(dataset, namespace);
    }
  }

  public getDatasets() {
    return this.datasets;
  }

  public finishLoading() {
    this.loadingStatus = 'READY';
  }

  public getLoadingStatus() {
    return this.loadingStatus;
  }

  public shouldComponentUpdate() {
    return true;
  }
}
