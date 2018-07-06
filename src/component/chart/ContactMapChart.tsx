// We need to use dist/plotly to avoid forcing users to do some webpack gymnastics:
// https://github.com/plotly/plotly-webpack#the-easy-way-recommended
import * as plotly from 'plotly.js';
import * as React from 'react';

import { RESIDUE_TYPE, SECONDARY_STRUCTURE_SECTION } from '../../data/chell-data';

import SecondaryStructureAxis from '../../data/SecondaryStructureAxis';
import { generateScatterGLData } from '../../helper/PlotlyHelper';
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
  range: number;
  secondaryStructures?: SECONDARY_STRUCTURE_SECTION[];
}

export interface IContactMapChartState {
  plotlyData: Array<Partial<IPlotlyData>>;
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
  range: 100,
};

export interface IContactMapChartData extends Partial<IPlotlyData> {
  name: string;
  nodeSize: number;
  points: IContactMapChartPoint[];
  subtitle?: string;
}

export const generateChartDataEntry = (
  hoverinfo: plotly.ScatterData['hoverinfo'],
  color: string | { start: string; end: string },
  name: string,
  subtitle: string,
  nodeSize: number,
  points: IContactMapChartPoint[],
  extra: Partial<IPlotlyData> = {},
): IContactMapChartData => ({
  hoverinfo,
  marker:
    typeof color === 'string'
      ? { color }
      : {
          colorscale: [
            [0.0, 'rgb(12,50,102)'],
            [0.1, 'rgb(17,83,150)'],
            [0.2, 'rgb(40,114,175)'],
            [0.3, 'rgb(71,147,193)'],
            [0.4, 'rgb(111,175,209)'],
            [0.5, 'rgb(160,202,222)'],
            [0.6, 'rgb(200,219,237)'],
            [0.7, 'rgb(224,235,246)'],
            [0.8, 'rgb(247,251,255)'],
            [0.9, 'rgb(249,253,255)'],
            [1.0, 'rgb(255,255,255)'],
          ],
        },
  name,
  nodeSize,
  points,
  subtitle,
  ...extra,
});

export interface IContactMapChartPoint {
  dist: number;
  i: number;
  j: number;
}

/**
 * Intermediary between a ContactMap and a PlotlyChart.
 *
 * Will transform data and setup layout from science/chell data type into the Plotly type.
 * @extends {React.Component<IContactMapChartProps, any>}
 */
class ContactMapChartClass extends React.Component<IContactMapChartProps, IContactMapChartState> {
  constructor(props: IContactMapChartProps) {
    super(props);
    this.state = {
      plotlyData: [],
    };
  }

  public componentDidUpdate(prevProps: IContactMapChartProps) {
    const { contactData, dataTransformFn, secondaryStructures } = this.props;
    if (prevProps.contactData !== contactData || prevProps.secondaryStructures !== secondaryStructures) {
      let plotlyData = [...contactData.map(entry => dataTransformFn(entry, true))];

      if (secondaryStructures && secondaryStructures.length >= 1) {
        const axis = new SecondaryStructureAxis(secondaryStructures).axis;
        const axisData = Array.from(axis.values()).reduce((prev, cur) => {
          prev.push(...[cur.x, cur.y]);
          return prev;
        }, new Array());
        plotlyData = [...plotlyData, ...axisData];
      }
      this.setState({
        plotlyData,
      });
    }
  }

  public render() {
    const { contactData, heightModifier, legendModifiers, marginModifiers, range, ...props } = this.props;

    const { plotlyData } = this.state;

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
            nticks: 10,
            range: [1, range],
            showline: true,
            tickmode: 'auto',
            title: 'Residue #',
          },
          yaxis: {
            autorange: false,
            nticks: 10,
            range: [1, range].reverse(),
            showline: true,
            tickmode: 'auto',
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
