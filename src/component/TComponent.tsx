import * as React from 'react';
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';

export interface ITComponentProps {
  data: number[][];
}

export type rechartScatterDataFormat = Array<{ x: number; y: number }>;

export class TComponent extends React.Component<ITComponentProps, {}> {
  public render() {
    const data: rechartScatterDataFormat = this.props.data.map(ele => {
      return { x: ele[0], y: ele[1] };
    });
    return (
      <ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type="number" dataKey={'x'} />
        <YAxis type="number" dataKey={'y'} />
        <CartesianGrid />
        <Scatter data={data} />
      </ScatterChart>
    );
  }
}
