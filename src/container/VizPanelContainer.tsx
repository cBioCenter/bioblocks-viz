import * as React from 'react';
import { Dropdown, Grid, GridColumn, GridRow } from 'semantic-ui-react';

import { SPRING_DATA_TYPE } from '../component/SpringComponent';
import { T_SNE_DATA_TYPE } from '../component/TComponent';
import { VIZ_TYPE, VizSelectorPanel } from '../component/VizSelectorPanel';
import { fetchAppropriateData } from '../helper/DataHelper';

export interface IChellDataTypes {
  spring?: SPRING_DATA_TYPE;
  tsne?: T_SNE_DATA_TYPE;
}

export interface IVizPanelContainerProps {
  /** Number of panels to be controlled by this container. Currently limited to 4. */
  numPanels: 1 | 2 | 3 | 4;
}

export interface IVizPanelContainerState {
  currentDataDir: string;
  data: IChellDataTypes;
  dataDirs: string[];
}

export class VizPanelContainer extends React.Component<IVizPanelContainerProps, IVizPanelContainerState> {
  constructor(props: IVizPanelContainerProps) {
    super(props);

    this.state = {
      currentDataDir: 'centroids',
      data: {},
      dataDirs: ['centroids', 'centroids_subset', 'spring2/full'],
    };
  }

  public async componentDidMount() {
    const springData = await fetchAppropriateData(VIZ_TYPE.SPRING, this.state.currentDataDir);
    const tsneData = await fetchAppropriateData(VIZ_TYPE['T-SNE'], this.state.currentDataDir);
    this.setState({
      data: {
        spring: springData as SPRING_DATA_TYPE,
        tsne: tsneData as T_SNE_DATA_TYPE,
      },
    });
  }

  public async componentDidUpdate(prevProps: IVizPanelContainerProps, prevState: IVizPanelContainerState) {
    if (prevState.currentDataDir !== this.state.currentDataDir) {
      const springData = await fetchAppropriateData(VIZ_TYPE.SPRING, this.state.currentDataDir);
      const tsneData = await fetchAppropriateData(VIZ_TYPE['T-SNE'], this.state.currentDataDir);
      this.setState({
        data: {
          spring: springData as SPRING_DATA_TYPE,
          tsne: tsneData as T_SNE_DATA_TYPE,
        },
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
        {this.renderPanels(this.props.numPanels, this.state.data).map((panel, index) => (
          <GridColumn key={index}>{panel}</GridColumn>
        ))}
      </Grid>
    );
  }

  protected renderPanels(numPanels: number, data: any) {
    const result = [];
    for (let i = 0; i < numPanels; ++i) {
      result.push(<VizSelectorPanel data={data} />);
    }
    return result;
  }

  protected onDataDirChange = (event: React.SyntheticEvent<any>, data: any) => {
    this.setState({
      currentDataDir: data.value,
    });
  };
}
