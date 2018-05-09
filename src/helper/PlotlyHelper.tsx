import * as React from 'react';

// We need to use dist/plotly to avoid forcing users to do some webpack gymnastics:
// https://github.com/plotly/plotly-webpack#the-easy-way-recommended
import * as plotly from 'plotly.js/dist/plotly';

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
  type: PLOTLY_CHART_TYPE | 'bar' | 'pointcloud' | 'scatter' | 'scattergl' | 'scatter3d';
}

export interface IPlotlyChartProps {
  config?: Partial<plotly.Config>;
  data: Array<Partial<IPlotlyData>>;
  layout?: Partial<plotly.Layout>;
  onClickCallback?: (event: plotly.PlotMouseEvent) => void;
  onHoverCallback?: (event: plotly.PlotMouseEvent) => void;
  onSelectedCallback?: (event: plotly.PlotSelectionEvent) => void;
  onUnHoverCallback?: (event: plotly.PlotMouseEvent) => void;
}

/**
 * React wrapper for a Plotly Chart.
 *
 * @description
 * Based upon: https://github.com/davidctj/react-plotlyjs-ts
 *
 * @export
 * @extends {React.Component<IPlotlyChartProps, any>}
 */
export default class PlotlyChart extends React.Component<IPlotlyChartProps, any> {
  public plotlyCanvas: plotly.PlotlyHTMLElement | null = null;
  protected canvasRef: HTMLDivElement | null = null;

  public attachListeners() {
    this.plotlyCanvas!.on('plotly_click', this.onClick);
    this.plotlyCanvas!.on('plotly_selected', this.onSelect);

    this.plotlyCanvas!.on('plotly_hover', this.onHover);
    this.plotlyCanvas!.on('plotly_unhover', this.onUnHover);

    window.addEventListener('resize', this.resize);
  }

  public resize = () => {
    plotly.Plots.resize(this.plotlyCanvas!);
  };

  public draw = async (props: IPlotlyChartProps) => {
    const { data, layout, config } = props;
    if (this.plotlyCanvas) {
      // plotly.react will not destroy the old plot: https://plot.ly/javascript/plotlyjs-function-reference/#plotlyreact
      this.plotlyCanvas = await plotly.react(this.plotlyCanvas, data, Object.assign({}, layout), config);
    }
  };

  public componentWillReceiveProps(nextProps: IPlotlyChartProps) {
    this.draw(nextProps);
  }

  public async componentDidMount() {
    if (this.canvasRef && !this.plotlyCanvas) {
      const { data, layout, config } = this.props;
      this.plotlyCanvas = await plotly.react(this.canvasRef, data, Object.assign({}, layout), config);
      this.attachListeners();
      this.draw(this.props);
    }
  }

  public componentWillUnmount() {
    if (this.plotlyCanvas) {
      plotly.purge(this.plotlyCanvas);
    }
    window.removeEventListener('resize', this.resize);
  }

  public render() {
    const {
      data,
      layout,
      config,
      onClickCallback,
      onHoverCallback,
      onSelectedCallback,
      onUnHoverCallback,
      ...other
    } = this.props;
    return <div {...other} ref={node => (this.canvasRef = node ? node : null)} />;
  }

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

export const defaultLayout: Partial<Plotly.Layout> = {
  height: 400,
  legend: {},
  showlegend: false,
  title: '',
  width: 400,
  xaxis: {},
  yaxis: {
    autorange: 'reversed',
  },
};

export const defaultConfig: Partial<Plotly.Config> = {
  displayModeBar: true,
  // modeBarButtons: [['zoomOut2d', 'zoomIn2d'], ['resetScale2d', 'autoScale2d'], ['select2d', 'pan2d']],
};

/**
 * Generate data in the expected format for a Plotly PointCloud.
 *
 * @param coords Array of (x,y) coordinates such that [i, i+1] refers to the (x,y) of object i.
 * Necessary optimization to render hundreds of thousands of points.
 * @param color What color the points should be.
 * @param nodeSize Sets min/max to nodeSize/nodeSize * 2.
 * @param [extra] Explicit extra configuration to add / replace the default data configuration with.
 * @returns Data suitable for consumption by Plotly.
 */
export const generatePointCloudData = (
  coords: Float32Array,
  color: string,
  nodeSize: number,
  extra?: Partial<IPlotlyData>,
): Partial<IPlotlyData> => ({
  marker: {
    color,
    sizemax: nodeSize * 2,
    sizemin: nodeSize,
  },
  mode: 'markers',
  type: PLOTLY_CHART_TYPE.pointcloud,
  xy: coords,
  ...extra,
});

export { PlotlyChart };
