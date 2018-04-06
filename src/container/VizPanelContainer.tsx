import * as d3 from 'd3';
import * as React from 'react';
import { Dropdown, Grid, GridColumn, GridRow } from 'semantic-ui-react';

import { VizSelectorPanel } from '../component/VizSelectorPanel';

export interface IVizPanelContainerProps {
  /** Number of panels to be controlled by this container. Currently limited to 4. */
  numPanels: 1 | 2 | 3 | 4;
}

export interface IVizPanelContainerState {
  coordinates: number[][];
  currentDataDir: string;
  dataDirs: string[];
}

export class VizPanelContainer extends React.Component<IVizPanelContainerProps, IVizPanelContainerState> {
  constructor(props: IVizPanelContainerProps) {
    super(props);

    this.state = {
      coordinates: [],
      currentDataDir: 'centroids_subset',
      dataDirs: ['centroids', 'centroids_subset', 'spring2/full'],
    };
  }

  public async componentDidMount() {
    const coordinates = await this.fetchCoordinateData(`assets/${this.state.currentDataDir}/tsne_output.csv`);
    this.setState({
      coordinates,
    });
  }

  public async componentDidUpdate(prevProps: IVizPanelContainerProps, prevState: IVizPanelContainerState) {
    if (prevState.currentDataDir !== this.state.currentDataDir) {
      const coordinates = await this.fetchCoordinateData(`assets/${this.state.currentDataDir}/tsne_output.csv`);
      this.setState({
        coordinates,
      });
    }
  }

  public render() {
    return (
      <Grid className={'VizPanelContainer'} columns={this.props.numPanels} centered={true} relaxed={true}>
        <GridRow columns={1} centered={true}>
          <Dropdown
            onChange={this.onDataDirChange}
            options={[
              ...this.state.dataDirs.map(dir => {
                return { key: dir, text: dir, value: dir };
              }),
            ]}
            placeholder={'Select Data Directory'}
            search={true}
          />
        </GridRow>
        {this.renderPanels(this.props.numPanels, this.state.currentDataDir, this.state.coordinates).map(
          (panel, index) => <GridColumn key={index}>{panel}</GridColumn>,
        )}
      </Grid>
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

  protected renderPanels(numPanels: number, dataDir: string, data: any) {
    const result = [];
    for (let i = 0; i < numPanels; ++i) {
      result.push(<VizSelectorPanel dataDir={dataDir} data={data} />);
    }
    return result;
  }

  protected onDataDirChange = (event: React.SyntheticEvent<any>, data: any) => {
    this.setState({
      currentDataDir: data.value,
    });
  };
}
