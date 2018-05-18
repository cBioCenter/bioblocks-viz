import * as React from 'react';

import { RESIDUE_TYPE } from '../../data/chell-data';

import { generateScatterGLData } from '../../helper/PlotlyHelper';
import { withDefaultProps } from '../../helper/ReactHelper';
import PlotlyChart, { IPlotlyData } from './PlotlyChart';

export interface IContactMapChartProps {
  candidateResidues: RESIDUE_TYPE[];
  data: IContactMapChartData[];
  dataTransformFn: (entry: IContactMapChartData, nodeSize: number, mirrorPoints: boolean) => Partial<IPlotlyData>;
  nodeSize: number;
  hoveredResidues: RESIDUE_TYPE[];
  onClickCallback: (...args: any[]) => void;
  onHoverCallback: (...args: any[]) => void;
  onSelectedCallback: (...args: any[]) => void;
  onUnHoverCallback: (...args: any[]) => void;
  range: number[];
}

const defaultContactMapChartProps: Partial<IContactMapChartProps> = {
  candidateResidues: new Array<RESIDUE_TYPE>(),
  dataTransformFn: generateScatterGLData,
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
};

export interface IContactMapChartData {
  color: string;
  name: string;
  points: IContactMapChartPoint[];
}

export interface IContactMapChartPoint {
  i: number;
  j: number;
}

export const defaultPlotlyLayout: Partial<Plotly.Layout> = {
  autosize: true,
  height: 400,
  legend: {},
  margin: {
    b: 80,
    l: 40,
    r: 40,
    t: 10,
  },
  showlegend: false,
  title: '',
  width: 400,
  xaxis: {
    range: [30],
  },
  yaxis: {
    range: [30],
  },
};

export const defaultPlotlyConfig: Partial<Plotly.Config> = {
  displayModeBar: false,
  // modeBarButtons: [['zoomOut2d', 'zoomIn2d'], ['resetScale2d', 'autoScale2d'], ['select2d', 'pan2d']],
};

class ContactMapChartClass extends React.Component<IContactMapChartProps, any> {
  constructor(props: any) {
    super(props);
  }
  public render() {
    const { candidateResidues, data, dataTransformFn, hoveredResidues, nodeSize, range, ...props } = this.props;

    return (
      <PlotlyChart
        config={{
          ...defaultPlotlyConfig,
        }}
        data={data.map(entry => dataTransformFn(entry, nodeSize, true))}
        layout={{
          ...defaultPlotlyLayout,
          legend: {
            orientation: 'h',
          },
          showlegend: true,
          xaxis: {
            ...defaultPlotlyLayout.xaxis,
            autorange: false,
            range,
          },
          yaxis: {
            ...defaultPlotlyLayout.yaxis,
            autorange: false,
            range: range.slice().reverse(),
          },
        }}
        {...props}
      />
    );
  }
}

export const ContactMapChart = withDefaultProps(defaultContactMapChartProps, ContactMapChartClass);

export default ContactMapChart;
