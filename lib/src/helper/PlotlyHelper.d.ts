/// <reference types="react" />
import * as plotly from 'plotly.js';
import * as React from 'react';
export declare enum PLOTLY_CHART_TYPES {
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
export declare class PlotlyChart extends React.Component<IPlotlyChartProps, any> {
  public container: plotly.PlotlyHTMLElement | null;
  public attachListeners(): void;
  public resize: () => void;
  public draw: (props: IPlotlyChartProps) => Promise<void>;
  public componentWillReceiveProps(nextProps: IPlotlyChartProps): void;
  public componentDidMount(): void;
  public componentWillUnmount(): void;
  public render(): JSX.Element;
  protected onClick: (event: plotly.PlotMouseEvent) => void;
  protected onHover: (event: plotly.PlotMouseEvent) => void;
  protected onSelect: (event: plotly.PlotSelectionEvent) => void;
  protected onUnHover: (event: plotly.PlotMouseEvent) => void;
}
export declare const defaultLayout: Partial<Plotly.Layout>;
export declare const defaultConfig: Partial<Plotly.Config>;
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
export declare const generatePointCloudData: (
  coords: Float32Array,
  color: string,
  nodeSize: number,
  extra?: Partial<IPlotlyData> | undefined,
) => Partial<IPlotlyData>;
