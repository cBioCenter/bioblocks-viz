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
  dataDirs: string[];
  /** Number of panels to be controlled by this container. Currently limited to 4. */
  numPanels: 1 | 2 | 3 | 4;
  initialVisualizations: VIZ_TYPE[];
}

export interface IVizPanelContainerState {
  currentDataDir: string;
  data: IChellDataTypes;
  selectedData?: ICouplingScore;
}

export class VizPanelContainer extends React.Component<IVizPanelContainerProps, IVizPanelContainerState> {
  constructor(props: IVizPanelContainerProps) {
    super(props);

    this.state = {
      currentDataDir: props.dataDirs[0],
      data: {},
    };
  }

  public async componentDidMount() {
    const contactMapData = await fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, this.state.currentDataDir);
    const nglData = await fetchAppropriateData(VIZ_TYPE.NGL, this.state.currentDataDir);
    // const springData = await fetchAppropriateData(VIZ_TYPE.SPRING, this.state.currentDataDir);
    // const tsneData = await fetchAppropriateData(VIZ_TYPE['T-SNE'], this.state.currentDataDir);

    this.setState({
      data: {
        contactMap: contactMapData,
        ngl: nglData as NGL_DATA_TYPE,
        // spring: springData as SPRING_DATA_TYPE,
        // tsne: tsneData as T_SNE_DATA_TYPE,
      },
    });
  }

  public async componentDidUpdate(prevProps: IVizPanelContainerProps, prevState: IVizPanelContainerState) {
    if (prevState.currentDataDir !== this.state.currentDataDir) {
      const contactMapData = await fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, this.state.currentDataDir);
      const nglData = await fetchAppropriateData(VIZ_TYPE.NGL, this.state.currentDataDir);
      // const springData = await fetchAppropriateData(VIZ_TYPE.SPRING, this.state.currentDataDir);
      // const tsneData = await fetchAppropriateData(VIZ_TYPE['T-SNE'], this.state.currentDataDir);

      this.setState({
        data: {
          contactMap: contactMapData,
          ngl: nglData as NGL_DATA_TYPE,
          // spring: springData as SPRING_DATA_TYPE,
          // tsne: tsneData as T_SNE_DATA_TYPE,
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
              ...this.props.dataDirs.map(dir => {
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
