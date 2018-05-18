import * as React from 'react';

import { RESIDUE_TYPE } from '../data/chell-data';

import PlotlyChart, { defaultConfig, defaultLayout, generateScatterGLData } from '../helper/PlotlyHelper';
import { withDefaultProps } from '../helper/ReactHelper';

export interface IScatterChartProps {
  candidateResidues: RESIDUE_TYPE[];
  data: IScatterChartData[];
  nodeSize: number;
  height: number;
  hoveredResidues: RESIDUE_TYPE[];
  onClickCallback: (...args: any[]) => void;
  onHoverCallback: (...args: any[]) => void;
  onSelectedCallback: (...args: any[]) => void;
  onUnHoverCallback: (...args: any[]) => void;
  range: number[];
  width: number;
}

const defaultScatterChartProps: Partial<IScatterChartProps> = {
  candidateResidues: new Array<RESIDUE_TYPE>(),
  height: 400,
  hoveredResidues: new Array<RESIDUE_TYPE>(),
  onClickCallback: (...args: any[]) => {
    return;
  },
  onHoverCallback: (...args: any[]) => {
    return;
  },
  onSelectedCallback: (...args: any[]) => {
    return;
  },
  onUnHoverCallback: (...args: any[]) => {
    return;
  },
  range: [],
  width: 400,
};

export interface IScatterChartData {
  color: string;
  name: string;
  points: IScatterChartDataPoint[];
}

export interface IScatterChartDataPoint {
  i: number;
  j: number;
}

class ScatterChartClass extends React.Component<IScatterChartProps, any> {
  constructor(props: any) {
    super(props);
  }
  public render() {
    const { candidateResidues, data, height, hoveredResidues, nodeSize, range, width, ...props } = this.props;

    const scatterGLData = data.map(entry => generateScatterGLData(entry, nodeSize, true));

    return (
      <PlotlyChart
        config={{
          ...defaultConfig,
        }}
        data={scatterGLData}
        layout={{
          ...defaultLayout,
          height,
          legend: {
            orientation: 'h',
          },
          showlegend: true,
          width,
          xaxis: {
            ...defaultLayout.xaxis,
            autorange: false,
            range,
          },
          yaxis: {
            ...defaultLayout.yaxis,
            autorange: false,
            range: range.slice().reverse(),
          },
        }}
        {...props}
      />
    );
  }
}

export const ScatterChart = withDefaultProps(defaultScatterChartProps, ScatterChartClass);

export default ScatterChart;
