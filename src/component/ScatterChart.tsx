import * as React from 'react';

import { RESIDUE_TYPE } from '../data/chell-data';

import PlotlyChart, { defaultConfig, defaultLayout, generateScatterGLData } from '../helper/PlotlyHelper';
import { withDefaultProps } from '../helper/ReactHelper';

export const defaultScatterChartProps = {
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
  width: 400,
};

export type ScatterChartProps = {
  data: Array<{
    color: string;
    points: Array<{ i: number; j: number }>;
  }>;
  nodeSize: number;
} & typeof defaultScatterChartProps;

class ScatterChartClass extends React.Component<ScatterChartProps, any> {
  constructor(props: any) {
    super(props);
  }
  public render() {
    const { candidateResidues, height, hoveredResidues, data, nodeSize, width, ...props } = this.props;

    const scatterGLData = data.map(entry => generateScatterGLData(entry.points, entry.color, nodeSize, true));

    return (
      <PlotlyChart
        config={{
          ...defaultConfig,
        }}
        data={scatterGLData}
        layout={{
          ...defaultLayout,
          height,
          width,
          xaxis: {
            ...defaultLayout.xaxis,
            gridcolor: '#ff0000',
            gridwidth: nodeSize,
            showticklabels: false,
            tickvals: [...candidateResidues, ...hoveredResidues],
          },
          yaxis: {
            ...defaultLayout.yaxis,
            gridcolor: '#ff0000',
            gridwidth: nodeSize,
            showticklabels: false,
            tickvals: [...candidateResidues, ...hoveredResidues],
          },
        }}
        {...props}
      />
    );
  }
}

export const ScatterChart = withDefaultProps(defaultScatterChartProps, ScatterChartClass);

export default ScatterChart;
