// Taken from https://github.com/kornicameister/korni
// Combines react-google-charts with google visualization types.

/// <reference types="react"/>
/// <reference types="google.visualization"/>

declare module 'react-google-charts' {
  export interface IChartEvent {
    eventName: 'select';
    callback: FunctionConstructor;
  }

  export type ChartColumn = google.visualization.DataTableColumnDescription;

  // options for different types of charts
  export type BarChartOptions = google.visualization.BarChartOptions;
  export type PieChartOptions = google.visualization.PieChartOptions;
  export type AreaChartOptions = google.visualization.AreaChartOptions;
  export type AnnotationChartOptions = google.visualization.AnnotationChartOptions;
  export type SteppedAreaChartOptions = google.visualization.SteppedAreaChartOptions;
  export type BubbleChartOptions = google.visualization.BubbleChartOptions;
  export type CandlestickChartOptions = google.visualization.CandlestickChartOptions;
  export type ComboChartOptions = google.visualization.ComboChartOptions;
  export type OrgChartOptions = google.visualization.OrgChartOptions;
  export type GeoChartOptions = google.visualization.GeoChartOptions;
  export type ScatterChartOptions = google.visualization.ScatterChartOptions;
  export type ColumnChartOptions = google.visualization.ColumnChartOptions;
  export type LineChartOptions = google.visualization.LineChartOptions;
  export type HistogramChartOptions = google.visualization.HistogramOptions;
  // options for different types of charts
  type ChartType =
    | 'PieChart'
    | 'BarChart'
    | 'Timeline'
    | 'ScatterChart'
    | 'LineChart'
    | 'AreaChart'
    | 'AnnotationChart'
    | 'SteppedChart'
    | 'BubbleChart';
  type ChartOptionsType =
    | BarChartOptions
    | PieChartOptions
    | AreaChartOptions
    | AnnotationChartOptions
    | SteppedAreaChartOptions
    | BubbleChartOptions
    | CandlestickChartOptions
    | ComboChartOptions
    | OrgChartOptions
    | GeoChartOptions
    | ScatterChartOptions
    | ColumnChartOptions
    | LineChartOptions
    | HistogramChartOptions;

  export interface IChartProps {
    chartType: ChartType;
    graph_id: string;
    width: string;
    height: string;
    rows?: any[][];
    columns?: ChartColumn[];
    data?: any[][];
    options?: ChartOptionsType;
    legend_toggle?: boolean;
    allowEmptyRows?: boolean;
    chartEvents?: IChartEvent[];
    colors?: string[];
    loadCharts?: boolean;
  }
  export class Chart extends React.Component<IChartProps> {}
}
