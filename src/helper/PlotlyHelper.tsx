import * as React from 'react';

// We need to use dist/plotly to avoid forcing users to do some webpack gymnastics:
// https://github.com/plotly/plotly-webpack#the-easy-way-recommended
import * as plotly from 'plotly.js/dist/plotly';
import { IContactMapChartData } from '../component/ContactMapChart';

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
      this.plotlyCanvas = await plotly.react(this.plotlyCanvas, data, Object.assign({}, layout), config);
    }
  };

  public componentDidUpdate(prevProps: IPlotlyChartProps) {
    const { data, layout, config } = this.props;
    if (data !== prevProps.data || layout !== prevProps.layout || config !== prevProps.config) {
      this.draw();
    }
  }

  public async componentDidMount() {
    if (this.canvasRef && !this.plotlyCanvas) {
      const { data, layout, config } = this.props;
      this.plotlyCanvas = await plotly.react(this.canvasRef, data, Object.assign({}, layout), config);
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
    return <div ref={node => (this.canvasRef = node ? node : null)} />;
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

/**
 * Generate data in the expected format for a WebGL Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param nodeSize How big to make the nodes on the graph?
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export const generateScatterGLData = (
  entry: IContactMapChartData,
  nodeSize: number,
  mirrorPoints: boolean = false,
): Partial<IPlotlyData> => ({
  ...generateScatterData(entry, nodeSize, mirrorPoints),
  type: PLOTLY_CHART_TYPE.scattergl,
});

/**
 * Generate data in the expected format for a Scatter plot.
 *
 * @param entry A unit of Plotly data containing points, color, name, and any extras.
 * @param nodeSize How big to make the nodes on the graph?
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @returns Data suitable for consumption by Plotly.
 */
export const generateScatterData = (
  entry: IContactMapChartData,
  nodeSize: number,
  mirrorPoints: boolean = false,
): Partial<IPlotlyData> => {
  const { points, color, name, ...extra } = entry;
  const xValues = points.map(data => data.i);
  const yValues = points.map(data => data.j);
  return {
    hoverinfo: 'none' as any,
    marker: {
      color,
      size: nodeSize * 2,
    },
    mode: 'markers',
    name,
    type: PLOTLY_CHART_TYPE.scatter,
    x: mirrorPoints ? [...xValues, ...yValues] : xValues,
    y: mirrorPoints ? [...yValues, ...xValues] : yValues,
    ...extra,
  };
};

export const generateFloat32ArrayFromContacts = (array: Array<{ i: number; j: number }>) => {
  const result = new Float32Array(array.length * 2);
  array.forEach((item, index) => {
    result[index * 2] = item.i;
    result[index * 2 + 1] = item.j;
  });
  return result;
};

/**
 * Generate data in the expected format for a Plotly PointCloud.
 *
 * @param entry A unit of Plotly data containing points, color, and any extras.
 * @param nodeSize Sets min/max to nodeSize/nodeSize * 2.
 * @param mirrorPoints Should we mirror the points on the x/y axis?
 * @param [extra] Explicit extra configuration to add / replace the default data configuration with.
 * @returns Data suitable for consumption by Plotly.
 */
export const generatePointCloudData = (
  entry: IContactMapChartData,
  nodeSize: number,
  mirrorPoints: boolean = false,
): Partial<IPlotlyData> => {
  const { color, points, ...extra } = entry;
  const coords = generateFloat32ArrayFromContacts(points);
  return {
    marker: {
      color,
      sizemax: nodeSize * 2,
      sizemin: nodeSize,
    },
    mode: 'markers',
    type: PLOTLY_CHART_TYPE.pointcloud,
    xy: mirrorPoints
      ? new Float32Array([
          ...Array.from(coords),
          ...Array.from(coords)
            .slice()
            .reverse(),
        ])
      : coords,
    ...extra,
  };
};

export { PlotlyChart };
