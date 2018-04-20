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
  onSelected?: (data: any) => any;
}

class PlotlyChart extends React.Component<IPlotlyChartProps, any> {
  protected plotlyElement: plotly.PlotlyHTMLElement | null = null;

  public attachListeners() {
    if (this.props.onClick) {
      this.plotlyElement!.on('plotly_click', this.props.onClick);
    }
    if (this.props.onHover) {
      this.plotlyElement!.on('plotly_hover', this.props.onHover);
    }
    if (this.props.onUnHover) {
      this.plotlyElement!.on('plotly_unhover', this.props.onUnHover);
    }
    if (this.props.onSelected) {
      this.plotlyElement!.on('plotly_selected', this.props.onSelected);
    }
    window.addEventListener('resize', this.resize);
  }

  public resize = () => {
    if (this.plotlyElement) {
      plotly.Plots.resize(this.plotlyElement);
    }
  };

  public draw = async (props: IPlotlyChartProps) => {
    const { data, layout, config } = props;
    if (this.plotlyElement) {
      this.plotlyElement = await plotly.react(this.plotlyElement, data, Object.assign({}, layout), config);
    }
  };

  public componentWillReceiveProps(nextProps: IPlotlyChartProps) {
    this.draw(nextProps);
  }

  public componentDidMount() {
    this.draw(this.props);
  }

  public componentWillUnmount() {
    if (this.plotlyElement) {
      plotly.purge(this.plotlyElement);
    }
    window.removeEventListener('resize', this.resize);
  }

  public render() {
    const { data, layout, config, onClick, onBeforeHover, onHover, onSelected, onUnHover, ...other } = this.props;
    return (
      <div
        {...other}
        ref={async node => {
          if (node && !this.plotlyElement) {
            this.plotlyElement = await plotly.newPlot(node, data as any, Object.assign({}, layout), config);
          }
        }}
      />
    );
  }
}

export default PlotlyChart;
