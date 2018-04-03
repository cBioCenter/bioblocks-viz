import * as React from 'react';
import { CartesianGrid, Margin, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';

export interface ITComponentProps {
  data: number[][];
  height?: number;
  margin?: Margin;
  style?: object;
  width?: number;
}

export type rechartScatterDataFormat = Array<{ x: number; y: number }>;

export class TComponent extends React.Component<ITComponentProps, {}> {
  public static defaultProps: Partial<ITComponentProps> = {
    height: 400,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    width: 400,
  };

  public render() {
    const data: rechartScatterDataFormat = this.props.data.map(ele => {
      return { x: ele[0], y: ele[1] };
    });
    const { height, margin, style, width } = this.props;
    return (
      <ScatterChart width={height} height={width} margin={margin} style={style}>
        <XAxis type="number" dataKey={'x'} />
        <YAxis type="number" dataKey={'y'} />
        <CartesianGrid />
        <Scatter data={data} />
      </ScatterChart>
    );
  }
}
