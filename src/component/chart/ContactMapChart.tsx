// We need to use dist/plotly to avoid forcing users to do some webpack gymnastics:
// https://github.com/plotly/plotly-webpack#the-easy-way-recommended
import * as plotly from 'plotly.js/dist/plotly';
import * as React from 'react';

import { ISecondaryStructureData, RESIDUE_TYPE } from '../../data/chell-data';

import { generateScatterGLData, generateSecondaryStructureAxis } from '../../helper/PlotlyHelper';
import { withDefaultProps } from '../../helper/ReactHelper';
import PlotlyChart, { defaultPlotlyLayout, IPlotlyData } from './PlotlyChart';

export interface IContactMapChartProps {
  candidateResidues: RESIDUE_TYPE[];
  contactData: IContactMapChartData[];
  dataTransformFn: (entry: IContactMapChartData, mirrorPoints: boolean) => Partial<IPlotlyData>;
  heightModifier: number;
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
  secondaryStructures?: ISecondaryStructureData[];
}

const defaultContactMapChartProps: Partial<IContactMapChartProps> = {
  candidateResidues: new Array<RESIDUE_TYPE>(),
  dataTransformFn: generateScatterGLData,
  heightModifier: 0.3,
  legendModifiers: {
    y: -0.1,
  },
  marginModifiers: {
    b: 40,
  },
  range: [],
};

export interface IContactMapChartData extends Partial<IPlotlyData> {
  name: string;
  nodeSize: number;
  points: IContactMapChartPoint[];
}

export const generateChartDataEntry = (
  hoverinfo: plotly.ScatterData['hoverinfo'],
  color: string | { start: string; end: string },
  name: string,
  nodeSize: number,
  points: IContactMapChartPoint[],
  extra: Partial<IPlotlyData> = {},
): IContactMapChartData => ({
  hoverinfo,
  marker:
    typeof color === 'string'
      ? { color }
      : {
          colorscale: [[0, color.start], [1, color.end]],
        },
  name,
  nodeSize,
  points,
  ...extra,
});

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
      contactData,
      dataTransformFn,
      heightModifier,
      legendModifiers,
      marginModifiers,
      range,
      secondaryStructures,
      ...props
    } = this.props;

    let plotlyData = [...contactData.map(entry => dataTransformFn(entry, true))];

    if (secondaryStructures && secondaryStructures.length >= 1) {
      plotlyData = [...plotlyData, ...generateSecondaryStructureAxis(secondaryStructures)];
    }

    return (
      <PlotlyChart
        data={plotlyData}
        layout={{
          height: defaultPlotlyLayout.height! + defaultPlotlyLayout.height! * heightModifier,
          legend: {
            orientation: 'h',
            y: legendModifiers.y * contactData.length,
            yanchor: 'bottom',
          },
          margin: {
            b: contactData.length * marginModifiers.b,
          },
          showlegend: true,
          xaxis: {
            autorange: false,
            dtick: 10,
            range,
            showline: true,
            // tickfont: { size: 6 },
            tickmode: 'linear',
            // ticktext: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
            // tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
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
