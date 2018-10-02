import * as plotly from 'plotly.js-gl2d-dist';
import * as React from 'react';

import { RESIDUE_TYPE, SECONDARY_STRUCTURE } from '../../data/chell-data';

import { ChellWidgetConfig } from '../../data/ChellConfig';
import { generateScatterGLData } from '../../helper/PlotlyHelper';
import { SettingsPanel } from '../widget/SettingsPanel';
import { AuxiliaryAxis } from './AuxiliaryAxis';
import { defaultPlotlyLayout, IPlotlyData, PlotlyChart } from './PlotlyChart';
import { SecondaryStructureAxis } from './SecondaryStructureAxis';

export interface IContactMapChartProps {
  candidateResidues: RESIDUE_TYPE[];
  configurations: ChellWidgetConfig[];
  contactData: IContactMapChartData[];
  dataTransformFn: (entry: IContactMapChartData, mirrorPoints: boolean) => Partial<IPlotlyData>;
  heightModifier: number;
  legendModifiers: {
    y: number;
  };
  marginModifiers: {
    b: number;
    l: number;
  };
  onClickCallback?: (...args: any[]) => void;
  onHoverCallback?: (...args: any[]) => void;
  onSelectedCallback?: (...args: any[]) => void;
  onUnHoverCallback?: (...args: any[]) => void;
  range: number;
  secondaryStructures: SECONDARY_STRUCTURE[];
  selectedSecondaryStructures: SECONDARY_STRUCTURE[];
}

export interface IContactMapChartState {
  plotlyData: Array<Partial<IPlotlyData>>;
}

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
      ? { color: new Array(points.length * 2).fill(color) }
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
  mode: 'lines+markers',
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
class ContactMapChart extends React.Component<IContactMapChartProps, IContactMapChartState> {
  public static defaultProps = {
    candidateResidues: new Array<RESIDUE_TYPE>(),
    configurations: new Array<ChellWidgetConfig>(),
    dataTransformFn: generateScatterGLData,
    heightModifier: 0.3,
    legendModifiers: {
      y: -0.4,
    },
    marginModifiers: {
      b: 75,
      l: 75,
    },
    range: 100,
    secondaryStructures: [],
    selectedSecondaryStructures: [],
  };

  constructor(props: IContactMapChartProps) {
    super(props);
    this.state = {
      plotlyData: [],
    };
  }

  public componentDidMount() {
    this.setupData();
  }

  public componentDidUpdate(prevProps: IContactMapChartProps) {
    const { contactData, secondaryStructures, selectedSecondaryStructures } = this.props;
    if (
      prevProps.contactData !== contactData ||
      prevProps.secondaryStructures !== secondaryStructures ||
      prevProps.selectedSecondaryStructures !== selectedSecondaryStructures
    ) {
      this.setupData();
    }
  }

  public render() {
    const {
      configurations,
      contactData,
      heightModifier,
      legendModifiers,
      marginModifiers,
      range,
      ...props
    } = this.props;
    const { plotlyData } = this.state;

    return (
      <SettingsPanel configurations={configurations}>
        <PlotlyChart
          data={plotlyData}
          layout={{
            height: defaultPlotlyLayout.height! + defaultPlotlyLayout.height! * heightModifier,
            legend: {
              orientation: 'h',
              y: legendModifiers.y,
              yanchor: 'bottom',
            },
            margin: {
              b: marginModifiers.b,
              l: marginModifiers.l,
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
      </SettingsPanel>
    );
  }

  /**
   * Sets up the chart and axis data for the ContactMap.
   *
   * Transforms all data from chell terminology to data properly formatted for Plotly consumption.
   */
  protected setupData() {
    const { contactData, dataTransformFn, secondaryStructures, selectedSecondaryStructures } = this.props;
    const plotlyData = [...contactData.map(entry => dataTransformFn(entry, true))];
    secondaryStructures.forEach((secondaryStructure, index) => {
      const axis = new SecondaryStructureAxis(secondaryStructure, 5, index + 2);
      plotlyData.push(...axis.xAxes, ...axis.yAxes);
    });

    selectedSecondaryStructures.forEach((selectedStructure, index) => {
      const axis = new AuxiliaryAxis(selectedStructure, index + 2, 'orange');
      plotlyData.push(...axis.xAxes, ...axis.yAxes);
    });

    this.setState({
      plotlyData,
    });
  }
}

export default ContactMapChart;
