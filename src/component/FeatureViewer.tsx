import * as React from 'react';

import { IProtein } from '../data/Protein';
import { PlotlyChart } from './chart/PlotlyChart';

export interface IFeatureViewerProps {
  height: number;
  proteinId: string;
  width: number;
}

export interface IFeatureViewerState {
  data: any;
  layout: Partial<Plotly.Layout>;
}

class FeatureViewer extends React.Component<IFeatureViewerProps, IFeatureViewerState> {
  public static defaultProps: Partial<IFeatureViewerProps> = {
    height: 200,
    width: 400,
  };

  constructor(props: IFeatureViewerProps) {
    super(props);
    this.state = {
      data: [],
      layout: {},
    };
  }

  public async componentDidMount() {
    const result = await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${this.props.proteinId}`);
    const protein = (await result.json()) as IProtein;
    const domains = protein.features.filter(feature => feature.type === 'DOMAIN');

    const domainData = domains.map(domain => {
      const { begin, description = '', end } = domain;
      return { begin: begin ? Number.parseInt(begin, 10) : -1, description, end: end ? Number.parseInt(end, 10) : -1 };
    });

    const { height, width } = this.props;

    this.setState({
      data: domainData.map(data => ({
        hoverinfo: 'name',
        line: {
          width: 0,
        },
        name: data.description,
        orientation: 'h',
        showLegend: true,
        type: 'box',
        x: [data.begin, data.end],
        y: [1, 1],
      })),
      layout: {
        boxmode: 'overlay',
        height,
        margin: {
          b: 20,
          t: 70,
        },
        title: protein.id,
        width,
        xaxis: {
          dtick: 100,
          range: [0, 552],
          showgrid: false,
          tick0: 0,
          tickmode: 'linear',
          ticks: 'outside',
        },
        yaxis: {
          visible: false,
        },
      },
    });
  }

  public render() {
    const { width, height } = this.props;
    return (
      <div style={{ height, width }}>
        {this.state.data.length >= 1 ? <PlotlyChart data={this.state.data} layout={this.state.layout} /> : null}
      </div>
    );
  }
}

export { FeatureViewer };
export default FeatureViewer;
