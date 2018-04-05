import * as React from 'react';
import { Dropdown, Grid, GridColumn, GridRow } from 'semantic-ui-react';

import { SpringContainer } from './SpringContainer';
import { TContainer } from './TContainer';

export interface ISideBySideContainerState {
  currentDataDir: string;
  dataDirs: string[];
}

export class SideBySideContainer extends React.Component<any, ISideBySideContainerState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      currentDataDir: 'centroids_subset',
      dataDirs: ['centroids', 'centroids_subset', 'spring2/full'],
    };
  }

  public render() {
    return (
      <Grid>
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
        <GridRow columns={2}>
          <GridColumn>
            <TContainer dataDir={this.state.currentDataDir} />
          </GridColumn>
          <GridColumn>
            <SpringContainer dataDir={this.state.currentDataDir} />
          </GridColumn>
        </GridRow>
      </Grid>
    );
  }

  protected onDataDirChange = (event: React.SyntheticEvent<any>, data: any) => {
    this.setState({
      currentDataDir: data.value,
    });
  };
}
