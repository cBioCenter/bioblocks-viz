import * as React from 'react';

import { Set } from 'immutable';
import { PlotlyChart } from '~chell-viz~/component';
import { Chell1DSection, ChellChartEvent, IPlotlyData, TintedChell1DSection } from '~chell-viz~/data';

export interface IFeatureRangeSelection {
  end: number;
  length: number;
  start: number;
  featuresSelected: Array<Chell1DSection<string>>;
}

export interface IFeatureViewerProps {
  data: Array<TintedChell1DSection<string>>;
  height: number;
  maxLength?: number;
  showGrouped: boolean;
  title: string;
  width: number;
  getTextForHover?(label: string, index: number): string;
  onClickCallback?(section: Array<Chell1DSection<string>>): void;
  onSelectCallback?(selection: IFeatureRangeSelection): void;
}

export interface IFeatureViewerState {
  hoveredFeatureIndex: number;
  hoverAnnotationText: string;
  plotlyLayout: Partial<Plotly.Layout>;
  plotlyConfig: Partial<Plotly.Config>;
  plotlyData: Array<Partial<IPlotlyData>>;
  selectedFeatureIndices: Set<number>;
  selectedRange: Chell1DSection<string>;
}

export class FeatureViewer extends React.Component<IFeatureViewerProps, IFeatureViewerState> {
  public static defaultProps = {
    data: [],
    height: 200,
    showGrouped: false,
    title: '',
    width: 600,
  };

  public static getDerivedStateFromProps(
    nextProps: IFeatureViewerProps,
    nextState: IFeatureViewerState,
  ): Partial<IFeatureViewerState> {
    const { data, height, maxLength, showGrouped, title, width } = nextProps;
    const { hoverAnnotationText, hoveredFeatureIndex, selectedRange } = nextState;

    const plotlyData = data.map(
      (datum, index): Partial<IPlotlyData> => {
        const yIndex = showGrouped
          ? index
          : data.findIndex(candidateDatum => datum.label.localeCompare(candidateDatum.label) === 0);

        return FeatureViewer.getPlotlyDataObject(datum, showGrouped, yIndex);
      },
    );

    plotlyData.push({
      hoverinfo: 'none',
      line: {
        color: 'orange',
        width: 10,
      },
      mode: 'lines',
      showlegend: false,
      x: [selectedRange.start, selectedRange.end],
      y: [-0.25, -0.25],
    });
    const hoveredDatum = plotlyData[hoveredFeatureIndex];

    return {
      plotlyData,
      plotlyLayout: {
        annotations:
          hoveredFeatureIndex >= 0 && hoveredDatum.x && hoveredDatum.y
            ? [
                {
                  align: 'left',
                  arrowhead: 0,
                  arrowsize: 1,
                  arrowwidth: 1,
                  ax: 0,
                  ay: -25,
                  bgcolor: '#ffffff',
                  bordercolor: '#000000',
                  borderpad: 5,
                  showarrow: true,
                  text: hoverAnnotationText,
                  x: hoveredDatum.x[0] as number,
                  xref: 'x',
                  y: hoveredDatum.y[hoveredDatum.y.length - 3] as number,
                  yref: 'y',
                },
              ]
            : [],
        dragmode: 'select',
        height,
        hovermode: 'closest',
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
                autorange: false,
                fixedrange: true,
                range: [0, maxLength ? maxLength : data.reduce((prev, cur) => Math.max(prev, cur.end), -1) + 200],
                showgrid: false,
                tick0: 0,
                tickmode: 'auto',
                ticks: 'outside',
              }
            : { visible: false },
        yaxis: {
          autorange: false,
          fixedrange: true,
          range: [-0.25, showGrouped ? 2 : data.length],
          visible: false,
        },
      },
    };
  }

  protected static getBoxForChellSection(datum: TintedChell1DSection<any>) {
    return [
      datum.end - (datum.end - datum.start) / 2,
      null,
      datum.start,
      datum.start,
      datum.end,
      datum.end,
      datum.start,
    ];
  }

  protected static getPlotlyDataObject = (
    datum: TintedChell1DSection<string>,
    showGrouped: boolean,
    yIndex: number,
  ): Partial<IPlotlyData> => ({
    fill: 'toself',
    fillcolor: datum.color.toString(),
    hoverinfo: 'none',
    hoveron: 'fills',
    line: {
      width: 0,
    },
    mode: 'text+lines',
    name: `${datum.label}`,
    text: [datum.label],
    textfont: { color: ['#FFFFFF'] },
    type: 'scatter',
    // Creates a 'box' so we can fill it and hover over it and add a point to the middle for the label.
    x: FeatureViewer.getBoxForChellSection(datum),
    y: showGrouped
      ? [0.5, null, 0, 1, 1, 0, 0]
      : [yIndex + 0.5, null, yIndex + 1, yIndex, yIndex, yIndex + 1, yIndex + 1],
  });

  constructor(props: IFeatureViewerProps) {
    super(props);
    this.state = {
      hoverAnnotationText: '',
      hoveredFeatureIndex: -1,
      plotlyConfig: {
        showAxisDragHandles: false,
        showAxisRangeEntryBoxes: false,
      },
      plotlyData: [],
      plotlyLayout: {},
      selectedFeatureIndices: Set<number>(),
      selectedRange: new Chell1DSection('selection', -1, -1),
    };
  }

  public render() {
    const { width, height } = this.props;
    const { plotlyConfig, plotlyData, plotlyLayout } = this.state;

    return (
      <div style={{ height, width }}>
        <PlotlyChart
          config={plotlyConfig}
          data={plotlyData}
          layout={plotlyLayout}
          onClickCallback={this.onFeatureClick}
          onHoverCallback={this.onFeatureHover}
          onSelectedCallback={this.onFeatureSelect}
          showLoader={false}
        />
      </div>
    );
  }

  protected onFeatureHover = (event: ChellChartEvent) => {
    const { data, getTextForHover } = this.props;
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
      hoverAnnotationText:
        getTextForHover && hoveredFeatureIndex >= 0
          ? getTextForHover(data[hoveredFeatureIndex].label, hoveredFeatureIndex)
          : '',
      hoveredFeatureIndex,
    });
  };

  protected onFeatureClick = (event: ChellChartEvent) => {
    const { data, onClickCallback } = this.props;
    const selectedFeatureIndices = this.deriveFeatureIndices(data, event.selectedPoints);

    if (onClickCallback) {
      onClickCallback(this.deriveSelectedFeatures(data, selectedFeatureIndices.toArray()));
    }

    this.setState({
      selectedFeatureIndices,
      selectedRange: new Chell1DSection('selection', -1, -1),
    });
  };

  protected onFeatureSelect = (event: ChellChartEvent) => {
    const { data, onSelectCallback } = this.props;
    const selectedFeatureIndices = this.deriveFeatureIndices(data, event.selectedPoints);

    const plotlyEvent = event.plotlyEvent as Plotly.PlotSelectionEvent;
    let { selectedRange } = this.state;
    if (plotlyEvent.range) {
      selectedRange = new Chell1DSection(
        'selection',
        Math.floor(plotlyEvent.range.x[0]),
        Math.ceil(plotlyEvent.range.x[1]),
      );

      const selection: IFeatureRangeSelection = {
        end: selectedRange.end,
        featuresSelected: this.deriveSelectedFeatures(data, selectedFeatureIndices.toArray()),
        length: selectedRange.length,
        start: selectedRange.start,
      };

      if (onSelectCallback) {
        onSelectCallback(selection);
      }
    }

    this.setState({
      selectedFeatureIndices,
      selectedRange,
    });
  };

  /**
   * Derive the indices of the Features from the points the user selected.
   */
  protected deriveFeatureIndices = (data: Array<TintedChell1DSection<string>>, userSelectedPoints: number[]) => {
    let featureIndices = Set<number>();

    // Points come to us as [x0, y0, x1, y1, ..., xn, yn], so we skip every other point.
    for (let i = 0; i < userSelectedPoints.length; i += 2) {
      const xCoord = userSelectedPoints[i];
      data
        .reduce((result, datum, index) => (datum.contains(xCoord) ? [...result, index] : result), new Array<number>())
        .forEach(indexToAdd => {
          featureIndices = featureIndices.add(indexToAdd);
        });
    }

    return featureIndices;
  };

  /**
   * Shorthand to get the raw section data for a set of Features given some indices.
   */
  protected deriveSelectedFeatures = (data: Array<TintedChell1DSection<string>>, selectedFeatureIndices: number[]) => {
    return selectedFeatureIndices.map(
      index => new Chell1DSection(data[index].label, data[index].start, data[index].end),
    );
  };
}
