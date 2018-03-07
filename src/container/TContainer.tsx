import * as React from 'react';
import * as tsnejs from 'tsnejs';

import { TComponent } from '../component/TComponent';

export interface ITContainerState {
  tsne: tsnejs.tSNE;
}

export class TContainer extends React.Component<any, ITContainerState> {
  public constructor(props: any) {
    super(props);

    const opt = {
      dim: 2, // dimensionality of the embedding (2 = default)
      epsilon: 5, // epsilon is learning rate (10 = default)
      perplexity: 10, // roughly how many neighbors each point influences (30 = default)
    };

    this.state = { tsne: new tsnejs.tSNE(opt) }; // create a tSNE instance

    // initialize data. Here we have 3 points and some example pairwise dissimilarities
    const distances = this.distanceMatrix(this.generateUnlinkedData(10));
    this.state.tsne.initDataDist(distances);

    for (let k = 0; k < 500; k++) {
      this.state.tsne.step(); // every time you call this, solution gets better
    }
  }

  public render() {
    return <TComponent data={this.state.tsne.getSolution()} />;
  }

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
