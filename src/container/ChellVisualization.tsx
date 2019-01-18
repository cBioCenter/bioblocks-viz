import * as React from 'react';
import { createContainerReducer } from '~chell-viz~/reducer';

export type CHELL_LOADING_STATUS = 'ERROR' | 'LOADING' | 'NOT_STARTED' | 'READY';

export abstract class ChellVisualization<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  protected dataSubscriptions: string[] = [];

  private loadingStatus: CHELL_LOADING_STATUS = 'NOT_STARTED';

  constructor(props: P) {
    super(props);
    this.setupDataServices();
  }

  public abstract setupDataServices(): void;

  public addDataSubscriptions(dataSubscriptions: string[], namespace = 'chell') {
    this.dataSubscriptions = dataSubscriptions;
    for (const dataSubscription of dataSubscriptions) {
      createContainerReducer(dataSubscription, namespace);
    }
  }

  public getDataSubscriptions() {
    return this.dataSubscriptions;
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
