import * as React from 'react';
import * as tsnejs from 'tsnejs';

import { ChellSlider } from '../component/ChellSlider';
import { TComponent } from '../component/TComponent';

export interface ITContainerState {
  dim: number; // dimensionality of the embedding (2 = default)
  epsilon: number; // epsilon is learning rate (10 = default)
  numPoints: number;
  perplexity: number; // roughly how many neighbors each point influences (30 = default)
  tsne: tsnejs.tSNE;
}

export class TContainer extends React.Component<any, ITContainerState> {
  public static defaultParams = {
    dim: 2,
    epsilon: 5,
    numPoints: 10,
    perplexity: 10,
  };

  public constructor(props: any) {
    super(props);

    this.state = {
      ...TContainer.defaultParams,
      tsne: new tsnejs.tSNE(TContainer.defaultParams),
    };

    this.generateData(this.state.tsne);
  }

  public render() {
    const data = this.state.tsne.getSolution();
    return data ? (
      <div id="TContainer">
        <TComponent data={data} />
        <ChellSlider label={'# of points'} defaultValue={10} max={100} min={5} onAfterChange={this.updateNumPoints()} />
        <ChellSlider label={'epsilon'} defaultValue={5} max={10} min={1} onAfterChange={this.updateEpsilon()} />
        <ChellSlider label={'perplexity'} defaultValue={10} max={30} min={1} onAfterChange={this.updatePerplexity()} />
      </div>
    ) : null;
  }

  private generateData(tsne: tsnejs.tSNE, numPoints = this.state.numPoints) {
    const distances = this.distanceMatrix(this.generateUnlinkedData(numPoints));
    tsne.initDataDist(distances);

    for (let k = 0; k < 500; k++) {
      tsne.step(); // every time you call this, solution gets better
    }
  }

  private updateEpsilon = () => (epsilon: number) => {
    const tsne = new tsnejs.tSNE({
      dim: this.state.dim,
      epsilon,
      perplexity: this.state.perplexity,
    });
    this.generateData(tsne);
    this.setState({
      epsilon,
      tsne,
    });
  };

  private updateNumPoints = () => (numPoints: number) => {
    const tsne = new tsnejs.tSNE(this.state);
    this.generateData(tsne, numPoints);
    this.setState({
      numPoints,
      tsne,
    });
  };

  private updatePerplexity = () => (perplexity: number) => {
    const tsne = new tsnejs.tSNE({
      dim: this.state.dim,
      epsilon: this.state.epsilon,
      perplexity,
    });
    this.generateData(tsne);
    this.setState({
      perplexity,
      tsne,
    });
  };

  // Points in two unlinked rings. Taken from https://distill.pub/2016/misread-tsne/
  private generateUnlinkedData(numPoints: number) {
    const points = [];
    const rotate = (x: number, y: number, z: number) => {
      const u = x;
      const cos = Math.cos(0.4);
      const sin = Math.sin(0.4);
      const v = cos * y + sin * z;
      const w = -sin * y + cos * z;
      return [u, v, w];
    };

    for (let i = 0; i < numPoints; i++) {
      const t = 2 * Math.PI * i / numPoints;
      const sin = Math.sin(t);
      const cos = Math.cos(t);
      // Ring 1.
      points.push({
        color: '#f90',
        pos: rotate(cos, sin, 0),
      });

      // Ring 2.
      points.push({
        color: '#039',
        pos: rotate(3 + cos, 0, sin),
      });
    }
    return points;
  }

  private distanceMatrix(points: Array<{ pos: number[] }>) {
    const matrix: number[][] = new Array<number[]>(points.length);
    const dist = (a: number[], b: number[]) => {
      let d = 0;
      for (let i = 0; i < a.length; i++) {
        d += (a[i] - b[i]) * (a[i] - b[i]);
      }
      return Math.sqrt(d);
    };

    for (let i = 0; i < points.length; i++) {
      matrix[i] = new Array<number>(points.length);
      for (let j = 0; j < points.length; j++) {
        matrix[i][j] = dist(points[i].pos, points[j].pos);
      }
    }
    return matrix;
  }
}
