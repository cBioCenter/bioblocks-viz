import * as deepEqual from 'deep-equal';
import * as Immutable from 'immutable';
import * as React from 'react';

// We need to use dist/plotly to avoid forcing users to do some webpack gymnastics:
// https://github.com/plotly/plotly-webpack#the-easy-way-recommended
import * as plotly from 'plotly.js/dist/plotly';

import { withDefaultProps } from '../../helper/ReactHelper';

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
  onClickCallback?: ((event: plotly.PlotMouseEvent) => void);
  onHoverCallback?: ((event: plotly.PlotMouseEvent) => void);
  onSelectedCallback?: ((event: plotly.PlotSelectionEvent) => void);
  onUnHoverCallback?: ((event: plotly.PlotMouseEvent) => void);
}

export const defaultPlotlyConfig: Partial<Plotly.Config> = {
  displayModeBar: false,
  scrollZoom: true,
  // modeBarButtons: [['zoomOut2d', 'zoomIn2d'], ['resetScale2d', 'autoScale2d'], ['select2d', 'pan2d']],
};

export const defaultPlotlyLayout: Partial<IPlotlyLayout> = {
  autosize: true,
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
  xaxis: {
    domain: [0, 0.95],
    range: [30],
  },
  xaxis2: {
    domain: [0.95, 1],
    visible: false,
  },
  yaxis: {
    domain: [0, 0.95],
    range: [30],
  },
  yaxis2: {
    domain: [0.95, 1],
    visible: false,
  },
};

export const defaultPlotlyChartProps: Partial<IPlotlyChartProps> = {
  config: {},
  data: [],
  layout: {},
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
export class PlotlyChartClass extends React.Component<IPlotlyChartProps, any> {
  public plotlyCanvas: plotly.PlotlyHTMLElement | null = null;
  protected plotlyFormattedData: Array<Partial<IPlotlyData>> = [];
  protected canvasRef: HTMLDivElement | null = null;

  /**
   * Setup all the event listeners for the plotly canvas.
   */
  public attachListeners() {
    if (this.plotlyCanvas) {
      this.plotlyCanvas.on('plotly_click', this.onClick);
      this.plotlyCanvas.on('plotly_selected', this.onSelect);

      this.plotlyCanvas.on('plotly_hover', this.onHover);
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
    const { layout, config } = this.props;
    this.plotlyFormattedData = [...this.plotlyFormattedData];
    if (this.plotlyCanvas) {
      // plotly.react will not destroy the old plot: https://plot.ly/javascript/plotlyjs-function-reference/#plotlyreact
      this.plotlyCanvas = await plotly.react(
        this.plotlyCanvas,
        this.plotlyFormattedData,
        this.getMergedLayout(layout),
        this.getMergedConfig(config),
      );
    }
  };

  /**
   * Determines if we should send a draw call to Plotly based on if data has actually changed.
   *
   * @param prevProps The previous props for the PlotlyChart.
   */
  public componentDidUpdate(prevProps: IPlotlyChartProps) {
    const { data, layout, config } = this.props;
    // !Important! This logic should be refactored for performance to not use JSON stringify.
    // !Important! Likely requires another crack at state/context.
    if (
      JSON.stringify(data) !== JSON.stringify(prevProps.data) ||
      !deepEqual(layout, prevProps.layout) ||
      !deepEqual(config, prevProps.config)
    ) {
      this.plotlyFormattedData = Immutable.fromJS(data).toJS();
      this.draw();
    }
  }

  public async componentDidMount() {
    if (this.canvasRef && !this.plotlyCanvas) {
      const { data, layout, config } = this.props;
      // !Important! This is to make a DEEP COPY of the data because Plotly will modify it, thus causing false positive data updates.
      this.plotlyFormattedData = Immutable.fromJS(data).toJS();

      this.plotlyCanvas = await plotly.react(
        this.canvasRef,
        this.plotlyFormattedData,
        this.getMergedLayout(layout),
        this.getMergedConfig(config),
      );

      this.attachListeners();
      this.draw();
    }
  }

  public componentWillUnmount() {
    if (this.plotlyCanvas) {
      plotly.purge(this.plotlyCanvas);
      this.plotlyCanvas = null;
    }
    window.removeEventListener('resize', this.resize);
  }

  public render() {
    return (
      <div className={'plotly-chart'} ref={node => (this.canvasRef = node ? node : null)} style={{ marginBottom: 5 }} />
    );
  }

  protected getMergedConfig = (config: Partial<Plotly.Config> = {}): Plotly.Config => {
    return Object.assign(
      {},
      Immutable.fromJS(Object.assign({}, defaultPlotlyConfig))
        .mergeDeep(Immutable.fromJS(Object.assign({}, config)))
        .toJS(),
    );
  };

  protected getMergedLayout = (layout: Partial<Plotly.Layout> = {}): Plotly.Layout => {
    return Object.assign(
      {},
      Immutable.fromJS(Object.assign({}, defaultPlotlyLayout))
        .mergeDeep(Immutable.fromJS(Object.assign({}, layout)))
        .toJS(),
    );
  };

  protected onClick = (event: plotly.PlotMouseEvent) => {
    const { onClickCallback } = this.props;
    if (onClickCallback) {
      onClickCallback(event);
    }
  };

  protected onHover = (event: plotly.PlotMouseEvent) => {
    const { onHoverCallback } = this.props;
    if (onHoverCallback) {
      onHoverCallback(event);
    }
  };

  protected onSelect = (event: plotly.PlotSelectionEvent) => {
    const { onSelectedCallback } = this.props;
    if (onSelectedCallback) {
      onSelectedCallback(event);
    }
  };

  protected onUnHover = (event: plotly.PlotMouseEvent) => {
    const { onUnHoverCallback } = this.props;
    if (onUnHoverCallback) {
      onUnHoverCallback(event);
    }
  };
}

const PlotlyChart = withDefaultProps(defaultPlotlyChartProps, PlotlyChartClass);

export default PlotlyChart;
export { PlotlyChart };
