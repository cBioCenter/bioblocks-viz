import * as React from 'react';

import { ChellChartEvent } from '../data/event/ChellChartEvent';
import { TintedChell1DSection } from '../data/TintedChell1DSection';
import { IPlotlyData, PlotlyChart } from './chart/PlotlyChart';

export interface IFeatureViewerProps {
  data: Array<TintedChell1DSection<string>>;
  height: number;
  showGrouped: boolean;
  title: string;
  width: number;
}

export interface IFeatureViewerState {
  hoveredFeatureIndex: number;
  layout: Partial<Plotly.Layout>;
  plotlyData: Array<Partial<IPlotlyData>>;
  selectedFeatureIndices: Set<number>;
}

class FeatureViewer extends React.Component<IFeatureViewerProps, IFeatureViewerState> {
  public static defaultProps: Partial<IFeatureViewerProps> = {
    height: 200,
    title: '',
    width: 600,
  };

  public static getDerivedStateFromProps(
    nextProps: IFeatureViewerProps,
    nextState: IFeatureViewerState,
  ): Partial<IFeatureViewerState> {
    const { data, height, showGrouped, title, width } = nextProps;
    const { hoveredFeatureIndex, selectedFeatureIndices } = nextState;

    let minRange = 0;
    let maxRange = 100;

    const plotlyData = data.map((datum, index) => {
      minRange = Math.min(minRange, datum.start, datum.end);
      maxRange = Math.max(maxRange, datum.start, datum.end);
      const plotlyDatum: Partial<IPlotlyData> = {
        fill: 'toself',
        fillcolor: datum.color.toString(),
        hoverinfo: 'none',
        hoveron: 'fills',
        line: selectedFeatureIndices.has(index)
          ? {
              color: 'orange',
              width: 3,
            }
          : {
              width: 0,
            },
        mode: 'text+lines',
        name: `${datum.label}`,
        text: [datum.label],
        textfont: { color: ['#FFFFFF'] },
        type: 'scatter',
        // Creates a 'box' so we can fill it and hover over it and add a point to the middle for the label.
        x: [
          datum.end - (datum.end - datum.start) / 2,
          null,
          datum.start,
          datum.start,
          datum.end,
          datum.end,
          datum.start,
        ],
        y: showGrouped
          ? [0.5, null, 0, 1, 1, 0, 0]
          : [index + 0.5, null, index + 1, index, index, index + 1, index + 1],
      };
      return plotlyDatum;
    });

    const hoveredDatum = plotlyData[hoveredFeatureIndex];

    return {
      layout: {
        annotations:
          hoveredFeatureIndex >= 0
            ? [
                {
                  arrowhead: 0,
                  arrowsize: 1,
                  arrowwidth: 1,
                  ax: 0,
                  ay: -25,
                  bgcolor: '#ffffff',
                  bordercolor: '#000000',
                  showarrow: true,
                  text: '<a href="http://pfam.xfam.org/family/PF03165">PFAM</a>',
                  x: hoveredDatum.x ? (hoveredDatum.x[0] as number) : 0,
                  xref: 'x',
                  y: hoveredDatum.y ? (hoveredDatum.y[hoveredDatum.y.length - 2] as number) : hoveredFeatureIndex,
                  yref: 'y',
                },
              ]
            : [],
        dragmode: 'select',
        height,
        margin: {
          b: 30,
          t: 60,
        },
        showlegend: false,
        title,
        width,
        xaxis:
          data.length > 0
            ? {
                range: [minRange, maxRange],
                showgrid: false,
                tick0: 0,
                tickmode: 'auto',
                ticks: 'outside',
              }
            : { visible: false },
        yaxis: {
          range: [0, showGrouped ? 2 : data.length],
          visible: false,
        },
      },
      plotlyData,
    };
  }

  constructor(props: IFeatureViewerProps) {
    super(props);
    this.state = {
      hoveredFeatureIndex: -1,
      layout: {},
      plotlyData: [],
      selectedFeatureIndices: new Set<number>(),
    };
  }

  public render() {
    const { width, height } = this.props;
    return (
      <div style={{ height, width }}>
        <PlotlyChart
          data={this.state.plotlyData}
          layout={this.state.layout}
          onClickCallback={this.onFeatureClick}
          onHoverCallback={this.onFeatureHover}
          onSelectedCallback={this.onFeatureSelect}
          showLoader={false}
        />
      </div>
    );
  }

  protected onFeatureHover = (event: ChellChartEvent) => {
    const { data } = this.props;
    let hoveredFeatureIndex = -1;
    // TODO Handle vertical viewer, better selection logic.
    const xCoords = [event.selectedPoints[0], event.selectedPoints[2]];
    for (let i = 0; i < data.length; ++i) {
      for (const xCoord of xCoords) {
        if (data[i].contains(xCoord)) {
          hoveredFeatureIndex = i;
        }
      }
    }

    this.setState({
      hoveredFeatureIndex,
    });
  };

  protected onFeatureSelect = (event: ChellChartEvent) => {
    const { data } = this.props;
    const selectedFeatureIndices = new Set<number>();
    // TODO Handle vertical viewer, better selection logic.
    const xCoords = [event.selectedPoints[0], event.selectedPoints[2]];
    for (let i = 0; i < data.length; ++i) {
      for (const xCoord of xCoords) {
        if (data[i].contains(xCoord)) {
          selectedFeatureIndices.add(i);
        }
      }
    }

    this.setState({
      selectedFeatureIndices,
    });
  };

  protected onFeatureClick = (event: ChellChartEvent) => {
    const { data } = this.props;
    const selectedFeatureIndices = new Set<number>();
    // TODO Handle vertical viewer, better selection logic.
    const xCoord = event.selectedPoints[0];
    for (let i = 0; i < data.length; ++i) {
      if (data[i].contains(xCoord)) {
        selectedFeatureIndices.add(i);
      }
    }

    this.setState({
      selectedFeatureIndices,
    });
  };
}

export { FeatureViewer };
export default FeatureViewer;
