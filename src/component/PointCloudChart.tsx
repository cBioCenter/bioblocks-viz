import * as React from 'react';

import { RESIDUE_TYPE } from '../data/chell-data';

import PlotlyChart, { defaultConfig, defaultLayout, generatePointCloudData } from '../helper/PlotlyHelper';
import { withDefaultProps } from '../helper/ReactHelper';

export const defaultPointCloudProps = {
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

export type PointCloudChartProps = {
  data: Array<{
    color: string;
    points: Array<{ i: number; j: number }>;
  }>;
  nodeSize: number;
} & typeof defaultPointCloudProps;

class PointCloudChartClass extends React.Component<PointCloudChartProps, any> {
  constructor(props: PointCloudChartProps) {
    super(props);
  }

  public render() {
    const { candidateResidues, height, hoveredResidues, data, nodeSize, width, ...props } = this.props;

    const pointCloudData = data.map(entry =>
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

export const PointCloudChart = withDefaultProps(defaultPointCloudProps, PointCloudChartClass);

export default PointCloudChart;