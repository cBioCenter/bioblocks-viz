// tslint:disable-next-line: no-submodule-imports
import * as plotly from 'plotly.js/lib/index-gl2d';

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
  boxpoints: 'all' | 'outliers' | 'suspectedoutliers' | false;
  name: string;
  notched: boolean;
  orientation: 'h' | 'v';
  showlegend: boolean;
  textfont: Partial<plotly.Font>;
  // tslint:disable-next-line:no-reserved-keywords
  type: PLOTLY_CHART_TYPE | 'bar' | 'pointcloud' | 'scatter' | 'scattergl' | 'scatter3d';
}

export interface IPlotlyLegend extends Omit<Plotly.Legend, 'traceorder'> {
  itemclick: 'toggle' | 'toggleothers' | false;
  itemdoubleclick: 'toggle' | 'toggleothers' | boolean;
  traceorder: 'grouped' | 'normal' | 'reversed' | 'grouped+reversed' | 'reversed+grouped';
}

export interface IPlotlyLayout extends Omit<Plotly.Layout, 'legend'> {
  legend: Partial<IPlotlyLegend>;
}

export type REQUIRED_BIOBLOCKS_PLOTLY_DATA = Required<
  Pick<
    IPlotlyData,
    'connectgaps' | 'hoverinfo' | 'line' | 'marker' | 'mode' | 'name' | 'showlegend' | 'type' | 'x' | 'y'
  >
>;

export type BIOBLOCKS_PLOTLY_DATA = REQUIRED_BIOBLOCKS_PLOTLY_DATA & Partial<IPlotlyData>;
