import * as React from 'react';
import { Dropdown, Grid, GridColumn, GridRow } from 'semantic-ui-react';

import { CHELL_DATA_TYPE, IResiduePair, VIZ_TYPE } from 'chell';
import { VizSelectorPanel } from '../component/VizSelectorPanel';
import { ResidueContext } from '../context/ResidueContext';
import { fetchAppropriateData } from '../helper/DataHelper';
import { withDefaultProps } from '../helper/ReactHelper';

const defaultProps = {
  initialVisualizations: [] as VIZ_TYPE[],
  /** Number of panels to be controlled by this container. Currently limited to 4. */
  numPanels: 1 as 1 | 2 | 3 | 4,
};

const initialState = {
  currentDataDir: '',
  data: {} as Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }>,
  residuePairValue: {
    currentResiduePair: { i: 0, j: 0 } as IResiduePair,
    selectNewResiduePair: (residuePair: IResiduePair) => {
      return;
    },
  },
};

type Props = { dataDirs: string[]; supportedVisualizations: VIZ_TYPE[] } & typeof defaultProps;
type State = Readonly<typeof initialState>;

export const VizPanelContainer = withDefaultProps(
  defaultProps,
  class VizPanelContainerClass extends React.Component<Props, State> {
    public readonly state: State = initialState;

    constructor(props: Props) {
      super(props);
      this.state = {
        ...this.state,
        currentDataDir: props.dataDirs[0],
        residuePairValue: {
          ...this.state.residuePairValue,
          selectNewResiduePair: this.onResidueSelect,
        },
      };
    }

    public async componentDidMount() {
      const results: Partial<{ [K in VIZ_TYPE]: any }> = {};
      for (const viz of this.props.supportedVisualizations) {
        results[viz] = await fetchAppropriateData(viz, this.state.currentDataDir);
      }
      this.setState({
        data: {
          ...results,
        },
      });
    }

    public async componentDidUpdate(prevProps: Props, prevState: State) {
      if (prevState.currentDataDir !== this.state.currentDataDir) {
        const results: Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }> = {};
        for (const viz of this.props.supportedVisualizations) {
          results[viz] = await fetchAppropriateData(viz, this.state.currentDataDir);
        }

        this.setState({
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
          <ResidueContext.Provider value={this.state.residuePairValue}>
            {this.renderPanels(this.props.numPanels, this.state.data, this.props.initialVisualizations).map(
              (panel, index) => <GridColumn key={index}>{panel}</GridColumn>,
            )}
          </ResidueContext.Provider>
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

    protected onResidueSelect = (selectedResiduePair: IResiduePair) => {
      const { currentResiduePair } = this.state.residuePairValue;
      const isNewResidue =
        selectedResiduePair.i !== currentResiduePair.i || selectedResiduePair.j !== currentResiduePair.j;
      if (isNewResidue) {
        this.setState({
          residuePairValue: {
            ...this.state.residuePairValue,
            currentResiduePair: selectedResiduePair,
          },
        });
      }
    };
  },
);
