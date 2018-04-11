import * as React from 'react';
import { Dropdown, Grid, GridColumn, GridRow } from 'semantic-ui-react';

import { ICouplingScore } from 'chell';
import { NGL_DATA_TYPE } from '../component/NGLComponent';
import { SPRING_DATA_TYPE } from '../component/SpringComponent';
import { T_SNE_DATA_TYPE } from '../component/TComponent';
import { VIZ_TYPE, VizSelectorPanel } from '../component/VizSelectorPanel';
import { fetchAppropriateData } from '../helper/DataHelper';

export interface IChellDataTypes {
  contactMap?: any;
  ngl?: NGL_DATA_TYPE;
  spring?: SPRING_DATA_TYPE;
  tsne?: T_SNE_DATA_TYPE;
}

export interface IVizPanelContainerProps {
  /** Number of panels to be controlled by this container. Currently limited to 4. */
  numPanels: 1 | 2 | 3 | 4;
  initialVisualizations: VIZ_TYPE[];
}

export interface IVizPanelContainerState {
  currentDataDir: string;
  data: IChellDataTypes;
  dataDirs: string[];
  selectedData?: ICouplingScore;
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
    const contactMapPDBFiles = [
      'example1/38cab199dbf11444e52d95c83dcf083d_b0.3_34_1_hMIN',
      'example1/084998782b26d65f7065adcb3c95b143_b0.3_399_1_hMIN',
      'example3/PKM2_b0.1_significant_ECs_0.9_1_hMIN',
    ].map(loc => `assets/contact_map/${loc}.pdb`);

    const dataPromises = await Promise.all([
      fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, 'assets/contact_map/example1/'),
      fetchAppropriateData(VIZ_TYPE.NGL, contactMapPDBFiles[0]),
      fetchAppropriateData(VIZ_TYPE.SPRING, this.state.currentDataDir),
      fetchAppropriateData(VIZ_TYPE['T-SNE'], this.state.currentDataDir),
    ]);

    const contactMapData = dataPromises[0];
    const nglData = dataPromises[1];
    const springData = dataPromises[2];
    const tsneData = dataPromises[3];

    this.setState({
      data: {
        contactMap: contactMapData,
        ngl: nglData as NGL_DATA_TYPE,
        spring: springData as SPRING_DATA_TYPE,
        tsne: tsneData as T_SNE_DATA_TYPE,
      },
    });
  }

  public async componentDidUpdate(prevProps: IVizPanelContainerProps, prevState: IVizPanelContainerState) {
    if (prevState.currentDataDir !== this.state.currentDataDir) {
      const nglData = await fetchAppropriateData(
        VIZ_TYPE.NGL,
        'assets/contact_map/example1/38cab199dbf11444e52d95c83dcf083d_b0.3_34_1_hMIN.pdb',
      );
      const springData = await fetchAppropriateData(VIZ_TYPE.SPRING, this.state.currentDataDir);
      const tsneData = await fetchAppropriateData(VIZ_TYPE['T-SNE'], this.state.currentDataDir);
      this.setState({
        data: {
          ngl: nglData as NGL_DATA_TYPE,
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
        {this.renderPanels(this.props.numPanels, this.state.data, this.props.initialVisualizations).map(
          (panel, index) => <GridColumn key={index}>{panel}</GridColumn>,
        )}
      </Grid>
    );
  }

  protected renderPanels(numPanels: number, data: any, initialVisualizations: VIZ_TYPE[]) {
    const result = [];
    for (let i = 0; i < numPanels; ++i) {
      result.push(
        <VizSelectorPanel
          data={data}
          initialViz={initialVisualizations[i]}
          onDataSelect={this.onDataSelect()}
          selectedData={this.state.selectedData}
        />,
      );
    }
    return result;
  }

  protected onDataDirChange = (event: React.SyntheticEvent<any>, data: any) => {
    this.setState({
      currentDataDir: data.value,
    });
  };

  protected onDataSelect = () => (payload: any) => {
    this.setState({
      selectedData: payload as ICouplingScore,
    });
  };
}
