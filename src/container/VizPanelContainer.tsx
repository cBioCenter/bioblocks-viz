import * as React from 'react';
import { Dropdown, Grid, GridColumn, GridRow } from 'semantic-ui-react';

import { VizSelectorPanel } from '../component/VizSelectorPanel';

export interface IVizPanelContainerProps {
  /** Number of panels to be controlled by this container. Currently limited to 4. */
  numPanels: 1 | 2 | 3 | 4;
}

export interface IVizPanelContainerState {
  currentDataDir: string;
  dataDirs: string[];
}

export class VizPanelContainer extends React.Component<IVizPanelContainerProps, IVizPanelContainerState> {
  constructor(props: IVizPanelContainerProps) {
    super(props);

    this.state = {
      currentDataDir: 'centroids_subset',
      dataDirs: ['centroids', 'centroids_subset', 'spring2/full'],
    };
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
        {this.renderPanels(this.props.numPanels, this.state.currentDataDir).map((panel, index) => (
          <GridColumn key={index}>{panel}</GridColumn>
        ))}
      </Grid>
    );
  }

  protected renderPanels(numPanels: number, dataDir: string) {
    const result = [];
    for (let i = 0; i < numPanels; ++i) {
      result.push(<VizSelectorPanel dataDir={dataDir} />);
    }
    return result;
  }

  protected onDataDirChange = (event: React.SyntheticEvent<any>, data: any) => {
    this.setState({
      currentDataDir: data.value,
    });
  };
}
