import * as React from 'react';
import { Button, Dropdown, Grid, GridColumn, GridRow, Label } from 'semantic-ui-react';
import { CHELL_DATA_TYPE, VIZ_TYPE } from '../data/chell-data';

import VizSelectorPanel from '../component/VizSelectorPanel';
import ChellContext from '../context/ChellContext';
import { ChellPDB } from '../data/ChellPDB';
import { fetchAppropriateData, getCouplingScoresData } from '../helper/DataHelper';
import { readUploadedFileAsText } from '../helper/FetchHelper';
import { generateResidueMapping } from '../helper/ResidueMapper';

export interface IVizPanelProps {
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

export class VizPanelContainer extends React.Component<IVizPanelProps, VizPanelContainerState> {
  public static defaultProps = {
    initialVisualizations: [] as VIZ_TYPE[],
    /** Number of panels to be controlled by this container. Currently limited to 4. */
    numPanels: 1,
  };
  public readonly state: VizPanelContainerState = initialVizPanelState;

  constructor(props: IVizPanelProps) {
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

  public async componentDidUpdate(prevProps: IVizPanelProps, prevState: VizPanelContainerState) {
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
            placeholder={this.props.dataDirs[0]}
            search={true}
          />
        </GridRow>
        <ChellContext>
          {this.renderPanels(this.props.numPanels, this.state.data, this.props.initialVisualizations).map(
            (panel, index) => (
              <GridColumn key={index}>{panel}</GridColumn>
            ),
          )}
        </ChellContext>

        {this.renderFileUploadForm()}
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

  protected renderFileUploadForm = () => (
    <Label as="label" basic={true} htmlFor="upload">
      <Button
        icon="upload"
        label={{
          basic: true,
          content: 'Upload',
        }}
        labelPosition="right"
      />
      <input id="upload" onChange={this.onDataUpload} hidden={true} type={'file'} multiple={true} required={true} />
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
        const pdbData = await ChellPDB.createPDBFromFile(files[pdbIndex]);
        const couplingResult = await readUploadedFileAsText(files[couplingIndex]);
        const mappingResult = await readUploadedFileAsText(files[mappingIndex]);

        const data = {
          couplingScores: getCouplingScoresData(couplingResult, generateResidueMapping(mappingResult)),
          pdbData,
          secondaryStructures: pdbData.rawsecondaryStructure,
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

  protected onDataDirChange = (event: React.SyntheticEvent<any>, data: any) => {
    this.setState({
      currentDataDir: data.value,
    });
  };
}

export default VizPanelContainer;
