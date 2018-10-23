import * as plotly from 'plotly.js-gl2d-dist';
import * as React from 'react';

import { Button, Icon } from 'semantic-ui-react';
import { AuxiliaryAxis, PlotlyChart, SecondaryStructureAxis, SettingsPanel } from '~chell-viz~/component';
import { ChellWidgetConfig, IPlotlyData, RESIDUE_TYPE, SECONDARY_STRUCTURE } from '~chell-viz~/data';
import { generateScatterGLData } from '~chell-viz~/helper';

export interface IContactMapChartProps {
  candidateResidues: RESIDUE_TYPE[];
  configurations: ChellWidgetConfig[];
  contactData: IContactMapChartData[];
  height: number | string;
  legendModifiers: {
    y: number;
  };
  marginModifiers: {
    b: number;
    l: number;
  };
  range: number;
  secondaryStructures: SECONDARY_STRUCTURE[];
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
          colorscale: [
            [0, 'rgb(12,50,102)'],
            [0.1, 'rgb(17,83,150)'],
            [0.2, 'rgb(40,114,175)'],
            [0.3, 'rgb(71,147,193)'],
            [0.4, 'rgb(111,175,209)'],
            [0.5, 'rgb(160,202,222)'],
            [0.6, 'rgb(200,219,237)'],
            [0.7, 'rgb(224,235,246)'],
            [0.8, 'rgb(247,251,255)'],
            [0.9, 'rgb(249,253,255)'],
            [1, 'rgb(255,255,255)'],
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
  dist?: number;
  i: number;
  j: number;
}

/**
 * Intermediary between a ContactMap and a PlotlyChart.
 *
 * Will transform data and setup layout from science/chell data type into the Plotly type.
 * @extends {React.Component<IContactMapChartProps, any>}
 */
export class ContactMapChart extends React.Component<IContactMapChartProps, IContactMapChartState> {
  public static defaultProps = {
    candidateResidues: new Array<RESIDUE_TYPE>(),
    configurations: new Array<ChellWidgetConfig>(),
    dataTransformFn: generateScatterGLData,
    height: '100%',
    legendModifiers: {
      y: -0.4,
    },
    marginModifiers: {
      b: 65,
      l: 65,
    },
    range: 100,
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
      legendModifiers,
      marginModifiers,
      range,
      showConfigurations,
      ...passThroughProps
    } = this.props;
    const { plotlyData, showlegend } = this.state;

    return (
      <SettingsPanel configurations={configurations} showConfigurations={showConfigurations}>
        <Button
          basic={true}
          floated={'left'}
          icon={<Icon name={'question circle outline'} size={'large'} />}
          onClick={this.toggleLegendVisibility}
          style={{ float: 'left', margin: '0 0 0 15px', position: 'relative', top: '500px', zIndex: 999 }}
        />
        <PlotlyChart
          data={plotlyData}
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
          {...passThroughProps}
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
      const axis = new SecondaryStructureAxis(secondaryStructure, 1, index + 2);
      plotlyData.push(...axis.xAxes, ...axis.yAxes);
    });

    const highlightedAxes = new Array<Partial<IPlotlyData>>();
    selectedSecondaryStructures.forEach((selectedStructure, index) => {
      const axis = new AuxiliaryAxis(selectedStructure, index + 2, 'orange');
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
