import * as d3 from 'd3';
import * as React from 'react';

import { ChellSlider } from '../component/ChellSlider';
import { TComponent } from '../component/TComponent';

export interface ITContainerProps {
  dataDir: string;
}

export interface ITContainerState {
  coordinates: number[][];
  dim: number; // dimensionality of the embedding (2 = default)
  epsilon: number; // epsilon is learning rate (10 = default)
  perplexity: number; // roughly how many neighbors each point influences (30 = default)
}

export class TContainer extends React.Component<ITContainerProps, ITContainerState> {
  public static defaultState: ITContainerState = {
    coordinates: [],
    dim: 2,
    epsilon: 5,
    perplexity: 10,
  };

  public constructor(props: ITContainerProps) {
    super(props);

    this.state = {
      ...TContainer.defaultState,
    };
  }

  public async componentDidMount() {
    const coordinates = await this.fetchCoordinateData(`assets/${this.props.dataDir}/tsne_output.csv`);
    this.setState({
      coordinates,
    });
  }

  public async componentDidUpdate(prevProps: ITContainerProps, prevState: ITContainerState) {
    const { dataDir } = this.props;
    if (dataDir && dataDir !== prevProps.dataDir) {
      const coordinates = await this.fetchCoordinateData(`assets/${dataDir}/tsne_output.csv`);
      this.setState({
        coordinates,
      });
    }
  }

  public render() {
    return (
      <div id="TContainer">
        <TComponent data={this.state.coordinates} />
        <ChellSlider label={'epsilon'} defaultValue={5} max={10} min={1} onAfterChange={this.updateEpsilon()} />
        <ChellSlider label={'perplexity'} defaultValue={10} max={30} min={1} onAfterChange={this.updatePerplexity()} />
      </div>
    );
  }

  protected async fetchCoordinateData(file: string) {
    const colorText: string = await d3.text(file);
    const result: number[][] = [];
    colorText.split('\n').forEach((entry, index, array) => {
      if (entry.length > 0) {
        const items = entry.split(',');
        const coordinates = [parseFloat(items[0]), parseFloat(items[1])];
        result.push(coordinates);
      }
    });
    return result;
  }

  protected updateEpsilon = () => (epsilon: number) => {
    this.setState({
      epsilon,
    });
  };

  protected updatePerplexity = () => (perplexity: number) => {
    this.setState({
      perplexity,
    });
  };
}
