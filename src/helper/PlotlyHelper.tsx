import * as plotly from 'plotly.js';
import * as React from 'react';

export interface IPlotlyChartProps {
  config?: any;
  data: any[];
  layout?: any;
  onClick?: (data: { points: any; event: any }) => any;
  onBeforeHover?: (data: { points: any; event: any }) => any;
  onHover?: (data: { points: any; event: any }) => any;
  onUnHover?: (data: { points: any; event: any }) => any;
  onSelected?: (data: { points: any; event: any }) => any;
}

class PlotlyChart extends React.Component<IPlotlyChartProps, any> {
  protected container: any | null = null;
  // protected container: plotly.PlotlyHTMLElement | null = null;

  public attachListeners() {
    if (this.props.onClick) {
      this.container!.on('plotly_click', this.props.onClick);
    }
    if (this.props.onHover) {
      this.container!.on('plotly_hover', this.props.onHover);
    }
    if (this.props.onUnHover) {
      this.container!.on('plotly_unhover', this.props.onUnHover);
    }
    if (this.props.onSelected) {
      this.container!.on('plotly_selected', this.props.onSelected);
    }
    window.addEventListener('resize', this.resize);
  }

  public resize = () => {
    if (this.container) {
      plotly.Plots.resize(this.container);
    }
  };

  public draw = (props: IPlotlyChartProps) => {
    if (this.container) {
      const { data, layout, config } = props;
      // We clone the layout as plotly mutates it.
      plotly.newPlot(this.container, data, Object.assign({}, layout), config);
      this.attachListeners();
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
    const { data, layout, config, onClick, onBeforeHover, onHover, onSelected, onUnHover, ...other } = this.props;
    return <div {...other} ref={node => (this.container = node)} />;
  }
}

export default PlotlyChart;
