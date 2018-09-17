import * as React from 'react';

import { ChellChartEvent } from '../data/event/ChellChartEvent';
import { TintedChell1DSection } from '../data/TintedChell1DSection';
import { PlotlyChart } from './chart/PlotlyChart';

export interface IFeatureViewerProps {
  data: Array<TintedChell1DSection<string>>;
  height: number;
  showGrouped: boolean;
  title: string;
  width: number;
}

export interface IFeatureViewerState {
  layout: Partial<Plotly.Layout>;
  plotlyData: any;
  selectedFeatureIndices: Set<number>;
}

class FeatureViewer extends React.Component<IFeatureViewerProps, IFeatureViewerState> {
  public static defaultProps: Partial<IFeatureViewerProps> = {
    height: 200,
    title: '',
    width: 600,
  };

  public static getDerivedStateFromProps(nextProps: IFeatureViewerProps, nextState: IFeatureViewerState) {
    const { data, height, showGrouped, title, width } = nextProps;
    const { selectedFeatureIndices } = nextState;

    const plotlyData = data.map((datum, index) => ({
      fillcolor: datum.color,
      hoverinfo: 'text',
      hoveron: 'boxes',
      line: selectedFeatureIndices.has(index)
        ? {
            color: 'yellow',
            width: 2,
          }
        : {
            width: 0,
          },
      mode: 'lines+text',
      name: datum.label,
      orientation: 'h',
      showLegend: true,
      text: 'Hello hello hello',
      textposition: 'bottom',
      type: 'box',
      x: [datum.start, datum.end],
      y: showGrouped ? [1, 1] : [index, index],
    }));

    let maxRange = 100;
    plotlyData.forEach(datum => {
      maxRange = Math.max(maxRange, datum.x[1]);
    });

    return {
      layout: {
        boxmode: showGrouped ? 'grouped' : 'overlay',
        dragmode: 'select',
        height,
        legend: {
          traceorder: 'reversed',
        },
        margin: {
          b: 30,
          t: 60,
        },
        showlegend: true,
        title,
        width,
        xaxis:
          data.length > 0
            ? {
                range: [0, maxRange],
                showgrid: false,
                tick0: 0,
                tickmode: 'auto',
                ticks: 'outside',
              }
            : { visible: false },
        yaxis: {
          visible: false,
        },
      },
      plotlyData,
    };
  }

  constructor(props: IFeatureViewerProps) {
    super(props);
    this.state = {
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
          onSelectedCallback={this.onFeatureSelect}
          showLoader={false}
        />
      </div>
    );
  }

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
