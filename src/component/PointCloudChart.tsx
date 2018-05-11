import * as React from 'react';

import { RESIDUE_TYPE } from '../data/chell-data';

import PlotlyChart, { defaultConfig, defaultLayout, generatePointCloudData } from '../helper/PlotlyHelper';

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
  onClickCallback?: () => void;
  onHoverCallback?: () => void;
  onSelectedCallback?: () => void;
  onUnHoverCallback?: () => void;
}

class ScatterChart extends React.Component<IScatterChartProps, any> {
  constructor(props: any) {
    super(props);
  }
  public render() {
    const { candidateResidues, height, hoveredResidues, inputData, nodeSize, width, ...props } = this.props;

    const pointCloudData = inputData.map(entry =>
      generatePointCloudData(this.generateFloat32ArrayFromContacts(entry.points), entry.color, nodeSize),
    );

    return (
      <PlotlyChart
        config={{
          ...defaultConfig,
        }}
        data={pointCloudData}
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

  protected generateFloat32ArrayFromContacts = (array: Array<{ i: number; j: number }>) => {
    const result = new Float32Array(array.length * 2);
    array.forEach((item, index) => {
      result[index * 2] = item.i;
      result[index * 2 + 1] = item.j;
    });
    return result;
  };
}

export default ScatterChart;
export { ScatterChart };
