import * as React from 'react';
import { Button, Dropdown, DropdownProps, Grid, GridColumn, GridRow, Label } from 'semantic-ui-react';

import { VizSelectorPanel } from '~chell-viz~/component';
import { ChellContextProvider } from '~chell-viz~/context';
import { CHELL_DATA_TYPE, ChellPDB, IContactMapData, VIZ_TYPE } from '~chell-viz~/data';
import {
  fetchAppropriateData,
  generateResidueMapping,
  getCouplingScoresData,
  readFileAsText,
} from '~chell-viz~/helper';

export interface IVizPanelContainerProps {
  dataDirs: string[];
  initialVisualizations: VIZ_TYPE[];
  /** Number of panels to be controlled by this container. Currently limited to 4. */
  numPanels: 1 | 2 | 3 | 4;
  supportedVisualizations: VIZ_TYPE[];
}

export const initialVizPanelState = {
  currentDataDir: '',
  data: new Object() as Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }>,
};

export type VizPanelContainerState = Readonly<typeof initialVizPanelState>;

export class VizPanelContainer extends React.Component<IVizPanelContainerProps, VizPanelContainerState> {
  public static defaultProps = {
    initialVisualizations: [] as VIZ_TYPE[],
    /** Number of panels to be controlled by this container. Currently limited to 4. */
    numPanels: 1,
  };
  public readonly state: VizPanelContainerState = initialVizPanelState;

  constructor(props: IVizPanelContainerProps) {
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
    this.setState({
      data: {
        ...results,
      },
    });
  }

  public async componentDidUpdate(prevProps: IVizPanelContainerProps, prevState: VizPanelContainerState) {
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
            className={'viz-panel-container-dropdown'}
            onChange={this.onDataDirChange}
            options={[
              ...this.props.dataDirs.map(dir => {
                return { key: dir, text: dir, value: dir };
              }),
            ]}
            placeholder={this.props.dataDirs[0]}
            search={true}
          />
        </GridRow>
        <ChellContextProvider>
          {this.renderPanels(this.props.numPanels, this.state.data, this.props.initialVisualizations).map(
            (panel, index) => (
              <GridColumn key={index}>{panel}</GridColumn>
            ),
          )}
        </ChellContextProvider>

        {this.renderFileUploadForm()}
      </Grid>
    );
  }

  protected renderPanels(
    numPanels: number,
    data: Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }>,
    initialVisualizations: VIZ_TYPE[],
  ) {
    const result: JSX.Element[] = [];
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

  protected renderFileUploadForm = () => (
    <Label as="label" basic={true} htmlFor={'upload'}>
      <Button
        icon={'upload'}
        label={{
          basic: true,
          content: 'Upload',
        }}
        labelPosition={'right'}
      />
      <input id={'upload'} onChange={this.onDataUpload} hidden={true} type={'file'} multiple={true} required={true} />
    </Label>
  );

  protected onDataUpload = async (e: React.ChangeEvent) => {
    const fileList = (e.target as HTMLInputElement).files;
    if (fileList) {
      const files = Array.from(fileList);
      const pdbIndex = files.findIndex(file => file.name.endsWith('.pdb'));
      const mappingIndex = files.findIndex(file => file.name.localeCompare('residue_mapping.csv') === 0);
      const couplingIndex = files.findIndex((file, index) => file.name.endsWith('.csv') && index !== mappingIndex);
      if (pdbIndex === -1 || mappingIndex === -1 || couplingIndex === -1) {
        alert(
          'Incorrect files uploaded! Please upload a file named residue_mapping.csv as well as a .pdb and .csv file!',
        );
      } else {
        const pdbData = await ChellPDB.createPDB(files[pdbIndex]);
        const couplingResult = await readFileAsText(files[couplingIndex]);
        const mappingResult = await readFileAsText(files[mappingIndex]);

        const data: IContactMapData = {
          couplingScores: getCouplingScoresData(couplingResult, generateResidueMapping(mappingResult)),
          pdbData,
          secondaryStructures: [],
        };

        this.setState({
          data: {
            ...this.state.data,
            'Contact Map': data,
            NGL: pdbData.nglStructure,
          },
        });
      }
    }
  };

  protected onDataDirChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({
      currentDataDir: data.value as string,
    });
  };
}
