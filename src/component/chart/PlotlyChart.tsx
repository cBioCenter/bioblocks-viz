import * as Immutable from 'immutable';
import { isEqual } from 'lodash';
import * as plotly from 'plotly.js-gl2d-dist';
import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import { CHELL_CHART_EVENT_TYPE, CHELL_CHART_PIECE } from '../../data/ChellData';
import ChellChartEvent from '../../data/event/ChellChartEvent';

export enum PLOTLY_CHART_TYPE {
  /** [Plotly Bar Chart](https://plot.ly/javascript/bar-charts/) */
  'bar' = 'bar',
  /** [Plotly Point Cloud](https://plot.ly/javascript/pointcloud/) */
  'pointcloud' = 'pointcloud',
  /** [Plotly Line/Scatter Chart](https://plot.ly/javascript/line-and-scatter/) */
  'scatter' = 'scatter',
  /** [Plotly Line/Scatter Chart in WebGL](https://plot.ly/javascript/line-and-scatter/) */
  'scattergl' = 'scattergl',
  /** [Plotly 3D Scatter Plot](https://plot.ly/javascript/3d-scatter-plots/) */
  'scatter3d' = 'scatter3d',
}

export interface IPlotlyData extends plotly.ScatterData {
  // TODO Open PR to add these missing Plotly types. - https://plot.ly/javascript/reference/#box
  /** [Plotly Box Plots](https://plot.ly/javascript/box-plots/) */
  // 'box' = 'box',
  boxpoints: 'all' | 'outliers' | 'suspectedoutliers' | false;
  name: string;
  notched: boolean;
  orientation: 'h' | 'v';
  showlegend: boolean;
  // TODO Open PR to add these missing Plotly types. - https://plot.ly/javascript/reference/#box

  textfont: Partial<plotly.Font>;
  type: PLOTLY_CHART_TYPE | 'bar' | 'pointcloud' | 'scatter' | 'scattergl' | 'scatter3d';
}

export interface IPlotlyLayout extends Plotly.Layout {
  // TODO Open PR to add these missing Plotly types. - https://plot.ly/javascript/reference/#box
  xaxis2: Partial<Plotly.LayoutAxis>;
  // TODO Open PR to add these missing Plotly types. - https://plot.ly/javascript/reference/#box
}

export interface IPlotlyChartProps {
  config?: Partial<Plotly.Config>;
  data: Array<Partial<IPlotlyData>>;
  layout?: Partial<IPlotlyLayout>;
  onAfterPlotCallback?: ((event: ChellChartEvent) => void);
  onClickCallback?: ((event: ChellChartEvent) => void);
  onDoubleClickCallback?: ((event: ChellChartEvent) => void);
  onHoverCallback?: ((event: ChellChartEvent) => void);
  onSelectedCallback?: ((event: ChellChartEvent) => void);
  onUnHoverCallback?: ((event: ChellChartEvent) => void);
  onRelayoutCallback?: ((event: ChellChartEvent) => void);
  showLoader?: boolean;
}

export const defaultPlotlyConfig: Partial<Plotly.Config> = {
  displayModeBar: false,
  doubleClick: 'reset',
  scrollZoom: true,
  showAxisDragHandles: false,
  staticPlot: false,
  // modeBarButtons: [['zoomOut2d', 'zoomIn2d'], ['resetScale2d', 'autoScale2d'], ['select2d', 'pan2d']],
};

export const defaultPlotlyLayout: Partial<IPlotlyLayout> = {
  autosize: true,
  dragmode: 'zoom',
  height: 400,
  hovermode: 'closest',
  legend: {},
  margin: {
    b: 10,
    l: 40,
    r: 10,
    t: 10,
  },
  showlegend: false,
  title: '',
  width: 400,
};

/**
 * React wrapper for a Plotly Chart.
 *
 * @description
 * Based upon: https://github.com/davidctj/react-plotlyjs-ts
 *
 * @export
 * @extends {React.Component<IPlotlyChartProps, any>}
 */
export class PlotlyChart extends React.Component<IPlotlyChartProps, any> {
  public static defaultProps = {
    config: {},
    data: [],
    layout: {},
    showLoader: true,
  };

  public plotlyCanvas: plotly.PlotlyHTMLElement | null = null;
  protected isDoubleClickInProgress = false; // Makes sure single click isn't fired when double click is in flight. Required due to https://github.com/plotly/plotly.js/issues/1546
  protected canvasRef: HTMLDivElement | null = null;
  protected plotlyFormattedData: Array<Partial<IPlotlyData>> = [];
  protected savedAxisZoom?: { xaxis: plotly.PlotAxis; yaxis: plotly.PlotAxis };

  /**
   * Setup all the event listeners for the plotly canvas.
   */
  public attachListeners() {
    if (this.plotlyCanvas) {
      this.plotlyCanvas.on('plotly_afterplot', this.onAfterPlot);
      this.plotlyCanvas.on('plotly_click', this.onClick);
      this.plotlyCanvas.on('plotly_doubleclick', this.onDoubleClick);
      this.plotlyCanvas.on('plotly_hover', this.onHover);
      this.plotlyCanvas.on('plotly_relayout', this.onRelayout as any);
      this.plotlyCanvas.on('plotly_selected', this.onSelect);
      this.plotlyCanvas.on('plotly_unhover', this.onUnHover);
    }
    window.removeEventListener('resize', this.resize);
    window.addEventListener('resize', this.resize);
  }

  /**
   * Resizes the inner Plotly canvas.
   */
  public resize = () => {
    if (this.plotlyCanvas) {
      plotly.Plots.resize(this.plotlyCanvas);
    }
  };

  /**
   * Sends a draw call to Plotly since it is using canvas/WebGL which is outside of the locus of control for React.
   */
  public draw = async () => {
    const { config, layout } = this.props;
    if (this.plotlyCanvas && this.canvasRef) {
      const mergedLayout = this.getMergedLayout(layout, this.plotlyFormattedData);
      const mergedConfig = this.getMergedConfig(config);
      this.plotlyCanvas = await plotly.react(this.canvasRef, this.plotlyFormattedData, mergedLayout, mergedConfig);
    }
  };

  /**
   * Determines if we should send a draw call to Plotly based on if data has actually changed.
   *
   * @param prevProps The previous props for the PlotlyChart.
   */
  public componentDidUpdate(prevProps: IPlotlyChartProps) {
    const { data, layout, config } = this.props;
    if (!isEqual(data, prevProps.data) || !isEqual(layout, prevProps.layout) || !isEqual(config, prevProps.config)) {
      this.plotlyFormattedData = isEqual(data, prevProps.data)
        ? this.plotlyFormattedData
        : Immutable.fromJS(data).toJS();
      this.draw();
    }
  }

  public async componentDidMount() {
    if (this.canvasRef && !this.plotlyCanvas) {
      const { data } = this.props;
      // !Important! This is to make a DEEP COPY of the data because Plotly will modify it, thus causing false positive data updates.
      this.plotlyFormattedData = Immutable.fromJS(data).toJS();

      this.plotlyCanvas = await plotly.react(this.canvasRef, this.plotlyFormattedData);

      this.attachListeners();
      this.draw();
    }
  }

  public componentWillUnmount() {
    if (this.plotlyCanvas) {
      plotly.purge(this.plotlyCanvas);
      this.plotlyCanvas = null;
      this.canvasRef = null;
    }
    window.removeEventListener('resize', this.resize);
  }

  public render() {
    const { showLoader } = this.props;
    return (
      <div>
        {showLoader && (
          <Dimmer active={!this.isDataLoaded()}>
            <Loader />
          </Dimmer>
        )}
        <div
          className={'plotly-chart'}
          ref={node => (this.canvasRef = node ? node : null)}
          style={{ marginBottom: 5 }}
        />
      </div>
    );
  }

  /**
   * Create [0-n] plotly axes given some plotly data.
   *
   * @param allData The already formatted Plotly data - meaning each data should have the proper axis already assigned.
   * @returns A object containing xaxis and yaxis fields, as well as xaxis# and yaxis# fields where # is derived from the given data.
   */
  protected deriveAxisParams(allData: Array<Partial<IPlotlyData>>) {
    const uniqueXAxisIds = new Set<string>();
    const uniqueYAxisIds = new Set<string>();

    for (const data of allData) {
      const { xaxis, yaxis } = data;
      if (xaxis) {
        uniqueXAxisIds.add(xaxis);
      }
      if (yaxis) {
        uniqueYAxisIds.add(yaxis);
      }
    }

    // TODO Have the spacing number - 0.05 - be configurable. Requires some design work to look good for various numbers of total axes.
    const result: Partial<IPlotlyLayout> = {
      ...this.generateExtraPlotlyAxis(uniqueXAxisIds),
      ...this.generateExtraPlotlyAxis(uniqueYAxisIds),
      xaxis: {
        domain: [0, 1 - 0.05 * uniqueXAxisIds.size],
        range: [30],
        zeroline: false,
      },
      yaxis: {
        domain: [0, 1 - 0.05 * uniqueXAxisIds.size],
        range: [30],
        zeroline: false,
      },
    };

    return result;
  }

  protected deriveChartPiece = (x: number, y: number, data?: plotly.ScatterData) => {
    if (data) {
      const isExtraXAxis = data.xaxis && data.xaxis !== 'x';
      const isExtraYAxis = data.yaxis && data.yaxis !== 'y';
      if (isExtraXAxis || isExtraYAxis) {
        return {
          chartPiece: CHELL_CHART_PIECE.AXIS,
          selectedPoints: isExtraXAxis ? [y] : [x],
        };
      }
    }
    return {
      chartPiece: CHELL_CHART_PIECE.POINT,
      selectedPoints: [x, y],
    };
  };

  /**
   * Generate axis data for those beyond the original x/yaxis.
   *
   * @param ids All of the axis ids associated with plotly data.
   */
  protected generateExtraPlotlyAxis = (ids: Set<string>): Partial<IPlotlyLayout> => {
    return Array.from(ids.values())
      .filter(id => id.length >= 2) // Ignores { xaxis: x } and { yaxis: y }.
      .map(id => {
        const axisId = id.substr(0, 1);
        const axisNum = Number.parseInt(id.substr(1), 10);
        const result: Partial<Plotly.LayoutAxis> = {
          [`${axisId}axis${axisNum}`]: {
            // TODO Have this number - 0.05 - be configurable. Requires some design work to look good for various numbers of total axes.
            autosize: false,
            domain: [1 - 0.05 * (axisNum - 1), 1 - 0.05 * (axisNum - 2)],
            dragmode: 'select',
            fixedrange: true,
            margin: {
              autoexpand: false,
            },
            visible: false,
          },
        };
        return result;
      })
      .reduce((prev, curr) => {
        return { ...prev, ...curr };
      }, {});
  };

  protected getMergedConfig = (config: Partial<Plotly.Config> = {}): Plotly.Config => {
    return {
      ...Immutable.fromJS({ ...defaultPlotlyConfig })
        .mergeDeep(Immutable.fromJS({ ...config }))
        .toJS(),
    };
  };

  protected getMergedLayout = (
    layout: Partial<Plotly.Layout> = {},
    plotlyFormattedData: Array<Partial<IPlotlyData>> = [],
  ): Partial<Plotly.Layout> => {
    const result = {
      ...Immutable.fromJS({ ...defaultPlotlyLayout, ...this.deriveAxisParams(plotlyFormattedData) })
        .mergeDeep(Immutable.fromJS({ ...layout }))
        .toJS(),
    };

    if (this.savedAxisZoom && result.xaxis && result.yaxis) {
      result.xaxis.range = this.savedAxisZoom.xaxis.range;
      result.yaxis.range = this.savedAxisZoom.yaxis.range;
    }

    return result;
  };

  protected onAfterPlot = () => {
    const { onAfterPlotCallback } = this.props;
    if (onAfterPlotCallback) {
      onAfterPlotCallback(new ChellChartEvent(CHELL_CHART_EVENT_TYPE.AFTER_PLOT));
    }
  };

  protected onClick = (event: plotly.PlotMouseEvent) => {
    if (!this.isDoubleClickInProgress) {
      const { onClickCallback } = this.props;
      if (event.points && event.points.length > 0 && onClickCallback) {
        const x = event.points[0].x ? event.points[0].x : (event.points[0].data.x[0] as number);
        const y = event.points[0].y ? event.points[0].y : (event.points[0].data.y[0] as number);
        const { chartPiece, selectedPoints } = this.deriveChartPiece(x, y, event.points[0].data);
        onClickCallback(new ChellChartEvent(CHELL_CHART_EVENT_TYPE.CLICK, chartPiece, selectedPoints));
      }
    }
  };

  protected onDoubleClick = () => {
    this.isDoubleClickInProgress = true;
    const { onDoubleClickCallback } = this.props;
    if (onDoubleClickCallback) {
      onDoubleClickCallback(new ChellChartEvent(CHELL_CHART_EVENT_TYPE.DOUBLE_CLICK));
    }
  };

  protected onHover = (event: plotly.PlotMouseEvent) => {
    const { onHoverCallback } = this.props;
    if (event.points && event.points[0] && onHoverCallback) {
      const x = event.points[0].x ? event.points[0].x : (event.points[0].data.x[0] as number);
      const y = event.points[0].y ? event.points[0].y : (event.points[0].data.y[0] as number);
      const { chartPiece, selectedPoints } = this.deriveChartPiece(x, y, event.points[0].data);

      onHoverCallback(new ChellChartEvent(CHELL_CHART_EVENT_TYPE.HOVER, chartPiece, selectedPoints));
    }
  };

  protected onRelayout = (event: plotly.PlotRelayoutEvent & { [key: string]: number }) => {
    this.isDoubleClickInProgress = false;
    // !IMPORTANT! Yes, these numbers have to be accessed like this, see:
    // https://plot.ly/javascript/plotlyjs-function-reference/#plotlyrestyle
    // https://github.com/plotly/plotly.js/issues/2843
    const axisKeys = ['xaxis.range[0]', 'xaxis.range[1]', 'yaxis.range[0]', 'yaxis.range[1]'];
    const isEventFormattedCorrect =
      event !== undefined && axisKeys.reduce((prev, cur) => prev && event[cur] !== undefined, true) === true;
    this.savedAxisZoom = isEventFormattedCorrect
      ? {
          xaxis: {
            autorange: false,
            range: [event[axisKeys[0]], event[axisKeys[1]]],
          },
          yaxis: {
            autorange: false,
            range: [event[axisKeys[2]], event[axisKeys[3]]],
          },
        }
      : undefined;
    const { onRelayoutCallback } = this.props;
    if (onRelayoutCallback) {
      onRelayoutCallback(new ChellChartEvent(CHELL_CHART_EVENT_TYPE.RELAYOUT));
    }
  };

  protected onSelect = async (event: plotly.PlotSelectionEvent) => {
    const { onSelectedCallback } = this.props;
    if (event && onSelectedCallback) {
      let allPoints = new Array<number>();
      if (event.points.length >= 1) {
        allPoints = event.points.reduce((prev, cur) => {
          prev.push(...[cur.x, cur.y]);
          return prev;
        }, allPoints);
      } else if (event.range) {
        // If it is a range, it is a box and so the coordinates can be directly accessed like so.
        allPoints.push(event.range.x[0], event.range.y[0], event.range.x[1], event.range.y[1]);
      }
      const { chartPiece } =
        allPoints.length > 0
          ? this.deriveChartPiece(allPoints[0], allPoints[1])
          : { chartPiece: CHELL_CHART_PIECE.POINT };
      onSelectedCallback(new ChellChartEvent(CHELL_CHART_EVENT_TYPE.SELECTION, chartPiece, allPoints));
    }
    await this.draw();
  };

  protected onUnHover = (event: plotly.PlotMouseEvent) => {
    const { onUnHoverCallback } = this.props;
    if (event && onUnHoverCallback) {
      const { data, x, y } = event.points[0];
      const { chartPiece, selectedPoints } = this.deriveChartPiece(x, y, data);
      onUnHoverCallback(new ChellChartEvent(CHELL_CHART_EVENT_TYPE.UNHOVER, chartPiece, selectedPoints));
    }
  };

  /**
   * Is the data ready to be plotted?
   */
  private isDataLoaded() {
    return (
      this.props.data.length > 0 ||
      this.plotlyFormattedData.filter(dataPoint => dataPoint.x && dataPoint.x.length >= 1).length > 0
    );
  }
}

export default PlotlyChart;
