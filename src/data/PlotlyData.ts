import * as plotly from 'plotly.js-gl2d-dist';

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
