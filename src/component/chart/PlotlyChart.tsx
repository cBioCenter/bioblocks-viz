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
  type: PLOTLY_CHART_TYPE | 'bar' | 'pointcloud' | 'scatter' | 'scattergl' | 'scatter3d';
}

export const defaultPlotlyConfig: Partial<Plotly.Config> = {
  displayModeBar: false,
  scrollZoom: true,
  // modeBarButtons: [['zoomOut2d', 'zoomIn2d'], ['resetScale2d', 'autoScale2d'], ['select2d', 'pan2d']],
};

export const defaultPlotlyLayout: Partial<Plotly.Layout> = {
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
    range: [30],
  },
  yaxis: {
    range: [30],
  },
};

export const defaultPlotlyChartProps = {
  config: {} as Partial<Plotly.Config>,
  data: [] as Array<Partial<IPlotlyData>>,
  layout: {} as Partial<Plotly.Layout>,
  onClickCallback: (event: plotly.PlotMouseEvent) => {
    return;
  },
  onHoverCallback: (event: plotly.PlotMouseEvent) => {
    return;
  },
  onSelectedCallback: (event: plotly.PlotSelectionEvent) => {
    return;
  },
  onUnHoverCallback: (event: plotly.PlotMouseEvent) => {
    return;
  },
};

export type PlotlyChartProps = {
  data: Array<Partial<IPlotlyData>>;
} & Partial<typeof defaultPlotlyChartProps>;

/**
 * React wrapper for a Plotly Chart.
 *
 * @description
 * Based upon: https://github.com/davidctj/react-plotlyjs-ts
 *
 * @export
 * @extends {React.Component<IPlotlyChartProps, any>}
 */
export class PlotlyChartClass extends React.Component<PlotlyChartProps, any> {
  public plotlyCanvas: plotly.PlotlyHTMLElement | null = null;
  protected canvasRef: HTMLDivElement | null = null;

  public attachListeners() {
    this.plotlyCanvas!.on('plotly_click', this.onClick);
    this.plotlyCanvas!.on('plotly_selected', this.onSelect);

    this.plotlyCanvas!.on('plotly_hover', this.onHover);
    this.plotlyCanvas!.on('plotly_unhover', this.onUnHover);

    window.removeEventListener('resize', this.resize);
    window.addEventListener('resize', this.resize);
  }

  public resize = () => {
    plotly.Plots.resize(this.plotlyCanvas!);
  };

  public draw = async () => {
    const { data, layout, config } = this.props;
    if (this.plotlyCanvas) {
      // plotly.react will not destroy the old plot: https://plot.ly/javascript/plotlyjs-function-reference/#plotlyreact
      this.plotlyCanvas = await plotly.react(
        this.plotlyCanvas,
        data,
        this.getMergedLayout(layout),
        this.getMergedConfig(config),
      );
    }
  };

  public componentDidUpdate(prevProps: PlotlyChartProps) {
    const { data, layout, config } = this.props;
    if (data !== prevProps.data || layout !== prevProps.layout || config !== prevProps.config) {
      this.draw();
    }
  }

  public async componentDidMount() {
    if (this.canvasRef && !this.plotlyCanvas) {
      const { data, layout, config } = this.props;
      this.plotlyCanvas = await plotly.react(
        this.canvasRef,
        data,
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

  protected getMergedConfig = (config: Partial<Plotly.Config> = {}) => {
    const foo: Immutable.Map<any, any> = Immutable.fromJS(Object.assign({}, defaultPlotlyConfig));
    const bar: Immutable.Map<any, any> = Immutable.fromJS(Object.assign({}, config));
    return Object.assign({}, foo.mergeDeep(bar).toJS());
  };

  protected getMergedLayout = (layout: Partial<Plotly.Layout> = {}) => {
    const foo: Immutable.Map<any, any> = Immutable.fromJS(Object.assign({}, defaultPlotlyLayout));
    const bar: Immutable.Map<any, any> = Immutable.fromJS(Object.assign({}, layout));
    return Object.assign({}, foo.mergeDeep(bar).toJS());
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
