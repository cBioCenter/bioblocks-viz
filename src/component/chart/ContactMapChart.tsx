// tslint:disable-next-line: no-submodule-imports
import * as plotly from 'plotly.js/lib/index-gl2d';
import * as React from 'react';

import { AuxiliaryAxis, PlotlyChart, SecondaryStructureAxis } from '~bioblocks-viz~/component';
import {
  BioblocksWidgetConfig,
  IPlotlyData,
  RESIDUE_TYPE,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_KEYS,
} from '~bioblocks-viz~/data';
import { ColorMapper, generateScatterGLData } from '~bioblocks-viz~/helper';

export interface IContactMapChartProps {
  configurations: BioblocksWidgetConfig[];
  contactData: IContactMapChartData[];
  height: number | string;
  isDataLoading: boolean;
  legendModifiers: {
    y: number;
  };
  marginModifiers: {
    b: number;
    l: number;
  };
  range: number;
  secondaryStructures: SECONDARY_STRUCTURE[];
  secondaryStructureColors?: ColorMapper<SECONDARY_STRUCTURE_KEYS>;
  selectedSecondaryStructures: SECONDARY_STRUCTURE[];
  selectedSecondaryStructuresColor: string;
  showConfigurations: boolean;
  width: number | string;
  dataTransformFn(entry: IContactMapChartData, mirrorPoints: boolean): Partial<IPlotlyData>;
  onClickCallback?(...args: any[]): void;
  onHoverCallback?(...args: any[]): void;
  onSelectedCallback?(...args: any[]): void;
  onUnHoverCallback?(...args: any[]): void;
}

export interface IContactMapChartState {
  numLegends: number;
  plotlyData: Array<Partial<IPlotlyData>>;
  showlegend: boolean;
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
          colorscale: [[0, color.start], [1, color.end]],
        },
  mode: 'lines+markers',
  name,
  nodeSize,
  points,
  subtitle,
  ...extra,
});

export interface IContactMapChartPoint {
  dist?: number;
  i: number;
  j: number;
}

/**
 * Intermediary between a ContactMap and a PlotlyChart.
 *
 * Will transform data and setup layout from science/bioblocks into a format suitable for Plotly consumption.
 * @extends {React.Component<IContactMapChartProps, any>}
 */
export class ContactMapChart extends React.Component<IContactMapChartProps, IContactMapChartState> {
  public static defaultProps = {
    configurations: new Array<BioblocksWidgetConfig>(),
    dataTransformFn: generateScatterGLData,
    height: '100%',
    isDataLoading: false,
    legendModifiers: {
      y: -0.4,
    },
    marginModifiers: {
      b: 67,
      l: 67,
    },
    range: 33000,
    secondaryStructures: [],
    selectedSecondaryStructures: [],
    selectedSecondaryStructuresColor: '#feb83f',
    showConfigurations: true,
    width: '100%',
  };

  constructor(props: IContactMapChartProps) {
    super(props);
    this.state = {
      numLegends: 0,
      plotlyData: [],
      showlegend: false,
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
      isDataLoading,
      legendModifiers,
      marginModifiers,
      range,
      showConfigurations,
      ...passThroughProps
    } = this.props;
    const { plotlyData, showlegend } = this.state;

    return (
      <PlotlyChart
        data={plotlyData}
        showLoader={isDataLoading}
        layout={{
          legend: {
            orientation: 'h',
            y: legendModifiers.y,
            yanchor: 'bottom',
          },
          margin: {
            b: marginModifiers.b,
            l: marginModifiers.l,
          },
          showlegend,
          xaxis: {
            fixedrange: true,
            nticks: 10,
            range: [0, range],
            rangemode: 'nonnegative',
            showline: true,
            tickmode: 'auto',
            title: 'Residue #',
          },
          yaxis: {
            fixedrange: true,
            nticks: 10,
            range: [range, 0],
            rangemode: 'nonnegative',
            showline: true,
            tickmode: 'auto',
            title: 'Residue #',
          },
        }}
        {...passThroughProps}
      />
    );
  }

  /**
   * Sets up the chart and axis data for the ContactMap.
   *
   * Transforms all data from bioblocks terminology to data properly formatted for Plotly consumption.
   */
  protected setupData() {
    const {
      contactData,
      dataTransformFn,
      secondaryStructures,
      secondaryStructureColors,
      selectedSecondaryStructures,
    } = this.props;
    const plotlyData = [...contactData.map(entry => dataTransformFn(entry, true))];
    secondaryStructures.forEach((secondaryStructure, index) => {
      const axis = new SecondaryStructureAxis(secondaryStructure, 3, index + 2, secondaryStructureColors);
      plotlyData.push(...axis.xAxes, ...axis.yAxes);
    });

    const highlightedAxes = new Array<Partial<IPlotlyData>>();
    selectedSecondaryStructures.forEach((selectedStructure, index) => {
      const axis = new AuxiliaryAxis(selectedStructure, index + 2, new ColorMapper(new Map(), 'orange'));
      highlightedAxes.push(...axis.highlightedXAxes, ...axis.highlightedYAxes);
    });

    this.setState({
      numLegends: new Set(
        plotlyData.filter(datum => datum.showlegend !== false && datum.name !== undefined).map(legend => legend.name),
      ).size,
      // Makes sure that highlighted axis is behind the axis.
      plotlyData: [...highlightedAxes, ...plotlyData],
    });
  }

  protected toggleLegendVisibility = () => {
    this.setState({
      showlegend: !this.state.showlegend,
    });
  };
}
