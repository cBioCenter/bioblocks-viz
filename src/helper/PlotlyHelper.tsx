import * as plotly from 'plotly.js';
import * as React from 'react';

export enum PLOTLY_CHART_TYPES {
  'bar' = 'bar',
  'pointcloud' = 'pointcloud',
  'scatter' = 'scatter',
  'scattergl' = 'scattergl',
  'scatter3d' = 'scatter3d',
}

export interface IPlotlyData extends plotly.ScatterData {
  type: PLOTLY_CHART_TYPES | 'bar' | 'pointcloud' | 'scatter' | 'scattergl' | 'scatter3d';
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
export class PlotlyChart extends React.Component<IPlotlyChartProps, any> {
  public container: plotly.PlotlyHTMLElement | null = null;

  public attachListeners() {
    this.container!.on('plotly_click', this.onClick);
    this.container!.on('plotly_selected', this.onSelect);

    this.container!.on('plotly_hover', this.onHover);
    this.container!.on('plotly_unhover', this.onUnHover);

    window.addEventListener('resize', this.resize);
  }

  public resize = () => {
    plotly.Plots.resize(this.container!);
  };

  public draw = async (props: IPlotlyChartProps) => {
    const { data, layout, config } = props;
    if (this.container) {
      // plotly.react will not destroy the old plot: https://plot.ly/javascript/plotlyjs-function-reference/#plotlyreact
      this.container = await plotly.react(this.container, data, Object.assign({}, layout), config);
    }
  };

  public componentWillReceiveProps(nextProps: IPlotlyChartProps) {
    this.draw(nextProps);
  }

  public componentDidMount() {
    this.draw(this.props);
  }

  public componentWillUnmount() {
    if (this.container) {
      plotly.purge(this.container);
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
    return (
      <div
        {...other}
        ref={async node => {
          if (node && !this.container) {
            this.container = await plotly.react(node, data as any, Object.assign({}, layout), config);
            this.attachListeners();
          }
        }}
      />
    );
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
  type: PLOTLY_CHART_TYPES.pointcloud,
  xy: coords,
  ...extra,
});
