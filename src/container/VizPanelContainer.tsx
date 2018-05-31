import * as React from 'react';
import { Dropdown, Grid, GridColumn, GridRow } from 'semantic-ui-react';
import { CHELL_DATA_TYPE, VIZ_TYPE } from '../data/chell-data';

import VizSelectorPanel from '../component/VizSelectorPanel';
import ChellContext from '../context/ChellContext';
import { fetchAppropriateData } from '../helper/DataHelper';
import { withDefaultProps } from '../helper/ReactHelper';

export const defaultVizPanelProps = {
  initialVisualizations: [] as VIZ_TYPE[],
  /** Number of panels to be controlled by this container. Currently limited to 4. */
  numPanels: 1 as 1 | 2 | 3 | 4,
};

export const initialVizPanelState = {
  currentDataDir: '',
  data: {} as Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }>,
};

export type VizPanelContainerProps = {
  dataDirs: string[];
  supportedVisualizations: VIZ_TYPE[];
} & typeof defaultVizPanelProps;
export type VizPanelContainerState = Readonly<typeof initialVizPanelState>;

export class VizPanelContainerClass extends React.Component<VizPanelContainerProps, VizPanelContainerState> {
  public readonly state: VizPanelContainerState = initialVizPanelState;

  constructor(props: VizPanelContainerProps) {
    super(props);
    this.state = {
      ...this.state,
      currentDataDir: props.dataDirs[0],
    };
  }

  public async componentDidMount() {
    const results: Partial<{ [K in VIZ_TYPE]: any }> = {};
    for (const viz of this.props.supportedVisualizations) {
      results[viz] = await fetchAppropriateData(viz, this.state.currentDataDir);
    }
    await this.setState({
      data: {
        ...results,
      },
    });
  }

  public async componentDidUpdate(prevProps: VizPanelContainerProps, prevState: VizPanelContainerState) {
    if (prevState.currentDataDir !== this.state.currentDataDir) {
      const results: Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }> = {};
      for (const viz of this.props.supportedVisualizations) {
        results[viz] = await fetchAppropriateData(viz, this.state.currentDataDir);
      }

      await this.setState({
        data: {
          ...results,
        },
      });
    }
  }

  public render() {
    return (
      <Grid className={'VizPanelContainer'} columns={this.props.numPanels} centered={true} relaxed={true}>
        <GridRow columns={1} centered={true}>
          <Dropdown
            className={'viz-panel-container-dropdown'}
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
        <ChellContext>
          {this.renderPanels(this.props.numPanels, this.state.data, this.props.initialVisualizations).map(
            (panel, index) => <GridColumn key={index}>{panel}</GridColumn>,
          )}
        </ChellContext>
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
          supportedVisualizations={this.props.supportedVisualizations}
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
}

const VizPanelContainer = withDefaultProps(defaultVizPanelProps, VizPanelContainerClass);

export default VizPanelContainer;
export { VizPanelContainer };
