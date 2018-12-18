import * as React from 'react';

import { Set } from 'immutable';
import { PlotlyChart } from '~chell-viz~/component';
import { Chell1DSection, ChellChartEvent, IPlotlyData, TintedChell1DSection } from '~chell-viz~/data';

export interface IFeatureViewerProps {
  data: Array<TintedChell1DSection<string>>;
  height: number;
  showGrouped: boolean;
  title: string;
  width: number;
  getTextForHover?(label: string, index: number): string;
  onClickCallback?(section: Array<Chell1DSection<string>>): void;
  onSelectCallback?(sections: Array<Chell1DSection<string>>): void;
}

export interface IFeatureViewerState {
  hoveredFeatureIndex: number;
  hoverAnnotationText: string;
  plotlyLayout: Partial<Plotly.Layout>;
  plotlyConfig: Partial<Plotly.Config>;
  plotlyData: Array<Partial<IPlotlyData>>;
  selectedFeatureIndices: Set<number>;
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
    const { data, height, showGrouped, title, width } = nextProps;
    const { hoverAnnotationText, hoveredFeatureIndex, selectedFeatureIndices } = nextState;

    let minRange = 0;
    let maxRange = 100;

    const plotlyData = data.map(
      (datum, index): Partial<IPlotlyData> => {
        minRange = Math.min(minRange, datum.start, datum.end);
        maxRange = Math.max(maxRange, datum.start, datum.end);
        const yIndex = showGrouped
          ? index
          : data.findIndex(candidateDatum => datum.label.localeCompare(candidateDatum.label) === 0);

        return FeatureViewer.getPlotlyDataObject(datum, selectedFeatureIndices, index, showGrouped, yIndex);
      },
    );

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
                range: [minRange, maxRange + 200],
                showgrid: false,
                tick0: 0,
                tickmode: 'auto',
                ticks: 'outside',
              }
            : { visible: false },
        yaxis: {
          autorange: false,
          fixedrange: true,
          range: [0, showGrouped ? 2 : data.length],
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
    datum: TintedChell1DSection<any>,
    selectedFeatureIndices: Set<number>,
    index: number,
    showGrouped: boolean,
    yIndex: number,
  ): Partial<IPlotlyData> => ({
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

  protected onFeatureSelect = (event: ChellChartEvent) => {
    const { data, onSelectCallback } = this.props;
    const selectedFeatureIndices = this.deriveFeatureIndices(data, event.selectedPoints);

    console.log(
      `Calling onSelect callback with: ${JSON.stringify(
        this.deriveSelectedFeatures(data, selectedFeatureIndices.toArray()),
      )}`,
    );

    if (onSelectCallback) {
      onSelectCallback(this.deriveSelectedFeatures(data, selectedFeatureIndices.toArray()));
    }

    this.setState({
      selectedFeatureIndices,
    });
  };

  protected onFeatureClick = (event: ChellChartEvent) => {
    const { data, onClickCallback } = this.props;
    const selectedFeatureIndices = this.deriveFeatureIndices(data, event.selectedPoints);

    console.log(
      `Calling onClick callback with: ${JSON.stringify(
        this.deriveSelectedFeatures(data, selectedFeatureIndices.toArray()),
      )}`,
    );

    if (onClickCallback) {
      onClickCallback(this.deriveSelectedFeatures(data, selectedFeatureIndices.toArray()));
    }
    this.setState({
      selectedFeatureIndices,
    });
  };

  protected deriveFeatureIndices = (data: Array<TintedChell1DSection<string>>, points: number[]) => {
    let featureIndices = Set<number>();

    for (let i = 0; i < points.length; i += 2) {
      const xCoord = points[i];
      data
        .reduce((result, datum, index) => (datum.contains(xCoord) ? [...result, index] : result), new Array<number>())
        .forEach(indexToAdd => {
          featureIndices = featureIndices.add(indexToAdd);
        });
    }

    return featureIndices;
  };

  protected deriveSelectedFeatures = (data: Array<TintedChell1DSection<string>>, selectedFeatureIndices: number[]) => {
    return selectedFeatureIndices.reduce((result, featureIndex) => {
      const tintedSection = data[featureIndex];
      result.push(new Chell1DSection(tintedSection.label, tintedSection.start, tintedSection.end));

      return result;
    }, new Array());
  };
}
