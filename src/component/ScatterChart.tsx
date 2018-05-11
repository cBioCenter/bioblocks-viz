import * as React from 'react';

import { RESIDUE_TYPE } from '../data/chell-data';

import PlotlyChart, { defaultConfig, defaultLayout, generateScatterGLData } from '../helper/PlotlyHelper';

export interface IScatterChartProps {
  candidateResidues: RESIDUE_TYPE[];
  inputData: Array<{
    color: string;
    points: Array<{ i: number; j: number }>;
  }>;
  height: number;
  hoveredResidues: RESIDUE_TYPE[];
  nodeSize: number;
  width: number;
  onClickCallback?: (...args: any[]) => void;
  onHoverCallback?: (...args: any[]) => void;
  onSelectedCallback?: (...args: any[]) => void;
  onUnHoverCallback?: (...args: any[]) => void;
}

class ScatterChart extends React.Component<IScatterChartProps, any> {
  constructor(props: any) {
    super(props);
  }
  public render() {
    const { candidateResidues, height, hoveredResidues, inputData, nodeSize, width, ...props } = this.props;

    const scatterGLData = inputData.map(entry => generateScatterGLData(entry.points, entry.color, nodeSize));

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

export default ScatterChart;
export { ScatterChart };
