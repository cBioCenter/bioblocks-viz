import * as React from 'react';

import { RESIDUE_TYPE } from '../../data/chell-data';

import { generateScatterGLData } from '../../helper/PlotlyHelper';
import { withDefaultProps } from '../../helper/ReactHelper';
import PlotlyChart, { defaultPlotlyLayout, IPlotlyData } from './PlotlyChart';

export interface IContactMapChartProps {
  candidateResidues: RESIDUE_TYPE[];
  data: IContactMapChartData[];
  dataTransformFn: (entry: IContactMapChartData, nodeSize: number, mirrorPoints: boolean) => Partial<IPlotlyData>;
  nodeSize: number;
  heightModifier: number;
  hoveredResidues: RESIDUE_TYPE[];
  legendModifiers: {
    y: number;
  };
  marginModifiers: {
    b: number;
  };
  onClickCallback: (...args: any[]) => void;
  onHoverCallback: (...args: any[]) => void;
  onSelectedCallback: (...args: any[]) => void;
  onUnHoverCallback: (...args: any[]) => void;
  range: number[];
}

const defaultContactMapChartProps: Partial<IContactMapChartProps> = {
  candidateResidues: new Array<RESIDUE_TYPE>(),
  dataTransformFn: generateScatterGLData,
  heightModifier: 0.3,
  hoveredResidues: new Array<RESIDUE_TYPE>(),
  legendModifiers: {
    y: -0.1,
  },
  marginModifiers: {
    b: 40,
  },
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

export interface IContactMapChartData extends Partial<IPlotlyData> {
  name: string;
  points: IContactMapChartPoint[];
}

export interface IContactMapChartPoint {
  dist: number;
  i: number;
  j: number;
}

class ContactMapChartClass extends React.Component<IContactMapChartProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const {
      candidateResidues,
      data,
      dataTransformFn,
      heightModifier,
      hoveredResidues,
      legendModifiers,
      marginModifiers,
      nodeSize,
      range,
      ...props
    } = this.props;

    return (
      <PlotlyChart
        data={data.map(entry => dataTransformFn(entry, nodeSize, true))}
        layout={{
          height: defaultPlotlyLayout.height! + defaultPlotlyLayout.height! * heightModifier,
          legend: {
            orientation: 'h',
            y: legendModifiers.y * data.length,
            yanchor: 'bottom',
          },
          margin: {
            b: data.length * marginModifiers.b,
          },
          showlegend: true,
          xaxis: {
            autorange: false,
            dtick: 10,
            range,
            showline: true,
            tickmode: 'linear',
            title: 'Residue #',
          },
          yaxis: {
            autorange: false,
            dtick: 10,
            range: range.slice().reverse(),
            showline: true,
            tickmode: 'linear',
            title: 'Residue #',
          },
        }}
        {...props}
      />
    );
  }
}

export const ContactMapChart = withDefaultProps(defaultContactMapChartProps, ContactMapChartClass);

export default ContactMapChart;
