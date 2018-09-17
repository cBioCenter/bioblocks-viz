import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Grid, GridColumn, GridRow, Header, Label, Segment } from 'semantic-ui-react';

import { NGLComponent } from '../src/component/NGLComponent';
import { PredictedContactMap } from '../src/component/PredictedContactMap';
import { ProteinFeatureViewer } from '../src/container/ProteinFeatureViewer';
import { CouplingContext } from '../src/context/CouplingContext';
import { CONTACT_MAP_DATA_TYPE, NGL_DATA_TYPE, VIZ_TYPE } from '../src/data/chell-data';
import { ChellPDB } from '../src/data/ChellPDB';
import { CouplingContainer } from '../src/data/CouplingContainer';
import { getCouplingScoresData } from '../src/helper/DataHelper';
import { readFileAsText } from '../src/helper/FetchHelper';
import { generateResidueMapping, IResidueMapping } from '../src/helper/ResidueMapper';

export interface IExampleAppState {
  [VIZ_TYPE.CONTACT_MAP]: CONTACT_MAP_DATA_TYPE;
  [VIZ_TYPE.NGL]?: NGL_DATA_TYPE;
  couplingScores: string;
  errorMsg: string;
  pdbData?: ChellPDB;
  residueMapping: IResidueMapping[];
}

class ExampleApp extends React.Component<any, IExampleAppState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      [VIZ_TYPE.CONTACT_MAP]: {
        couplingScores: new CouplingContainer(),
      },
      couplingScores: '',
      errorMsg: '',
      residueMapping: [],
    };
  }

  public render() {
    return (
      <div id="ChellVizApp" style={{ backgroundColor: '#dddddd', height: '1000px' }}>
        {this.renderFeatureViewer()}
        {this.renderCouplingComponents()}
      </div>
    );
  }

  protected renderCouplingComponents = () => {
    return (
      <div>
        <Header as={'h1'} attached={'top'}>
          Chell - ContactMap.IO
        </Header>
        <Segment attached={true} raised={true}>
          <CouplingContext>
            <Grid>
              <GridRow columns={2} centered={true}>
                <GridColumn>
                  <NGLComponent data={this.state[VIZ_TYPE.NGL]} showConfiguration={false} />
                </GridColumn>
                <GridColumn>
                  <PredictedContactMap data={this.state[VIZ_TYPE.CONTACT_MAP]} enableSliders={false} />
                </GridColumn>
              </GridRow>
              <GridRow columns={4}>
                <GridColumn>{this.renderPDBUploadForm()}</GridColumn>
                <GridColumn>{this.renderCouplingScoresUploadForm()}</GridColumn>
                <GridColumn>{this.renderResidueMappingUploadForm()}</GridColumn>
                <GridColumn>{this.renderMultiFileUploadForm()}</GridColumn>
              </GridRow>
            </Grid>
          </CouplingContext>
        </Segment>
        {this.renderErrorMessage()}
      </div>
    );
  };

  protected renderFeatureViewer = () => {
    return (
      <div>
        <Header as={'h2'} attached={'top'}>
          Feature Viewer
        </Header>
        <Segment attached={true} raised={true}>
          <Grid>
            <GridRow centered={true}>
              <GridColumn>
                <ProteinFeatureViewer />
              </GridColumn>
            </GridRow>
          </Grid>
        </Segment>
      </div>
    );
  };

  protected renderErrorMessage = () =>
    this.state.errorMsg.length === 0 ? null : (
      <div>
        <Header as={'h2'} attached={'top'} color={'red'}>
          Error!
        </Header>
        <Segment attached={true}>{this.state.errorMsg}</Segment>
      </div>
    );

  protected renderUploadForm = (
    onChange: (e: React.ChangeEvent<Element>) => void,
    id: string,
    content: string,
    isMulti = false,
  ) => (
    <Label as="label" basic={true} htmlFor={id}>
      <Button
        icon={'upload'}
        label={{
          basic: true,
          content,
        }}
        labelPosition={'right'}
      />
      <input id={id} onChange={onChange} hidden={true} type={'file'} required={true} multiple={isMulti} />
    </Label>
  );

  protected renderCouplingScoresUploadForm = () =>
    this.renderUploadForm(this.onCouplingScoreUpload, 'coupling-score', 'Coupling Scores');

  protected renderMultiFileUploadForm = () =>
    this.renderUploadForm(this.onMultiFileUpload, 'multi-upload', 'Upload Multiple Files', true);

  protected renderPDBUploadForm = () => this.renderUploadForm(this.onPDBUpload, 'pdb', 'PDB');

  protected renderResidueMappingUploadForm = () =>
    this.renderUploadForm(this.onResidueMappingUpload, 'residue-mapping', 'Residue Mapping');

  protected onCouplingScoreUpload = async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      try {
        const parsedFile = await readFileAsText(file);
        const couplingScores = getCouplingScoresData(parsedFile, this.state.residueMapping);
        this.setState({
          [VIZ_TYPE.CONTACT_MAP]: {
            couplingScores,
            pdbData: this.state.pdbData,
          },
          couplingScores: parsedFile,
          errorMsg: '',
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  protected onMultiFileUpload = async (e: React.ChangeEvent) => {
    const fileList = (e.target as HTMLInputElement).files;
    let pdbData = this.state.pdbData;
    let residueMapping = this.state.residueMapping;
    let couplingScores = this.state.couplingScores;

    if (fileList && fileList.length <= 3) {
      for (const file of Array.from(fileList)) {
        if (file.name.endsWith('.pdb')) {
          pdbData = await ChellPDB.createPDBFromFile(file);
        } else if (
          file.name.endsWith('.csv') ||
          file.name.endsWith('.indextable') ||
          file.name.endsWith('.indextableplus')
        ) {
          const parsedFile = await readFileAsText(file);
          const generatedMapping = generateResidueMapping(parsedFile);
          if (generatedMapping.length !== 0) {
            residueMapping = generatedMapping;
          } else if (file.name.endsWith('.csv')) {
            couplingScores = parsedFile;
          }
        } else {
          alert(`Unable to parse file '${file.name}'!`);
        }
      }
    } else {
      alert(
        'Incorrect files uploaded! Please upload a file named residue_mapping.csv as well as a .pdb and .csv file!',
      );
    }

    this.setState({
      couplingScores,
      pdbData,
      residueMapping,
      [VIZ_TYPE.CONTACT_MAP]: {
        couplingScores: getCouplingScoresData(couplingScores, residueMapping),
        errorMsg: '',
        pdbData,
      },
      [VIZ_TYPE.NGL]: pdbData ? pdbData.nglStructure : undefined,
    });
  };

  protected onPDBUpload = async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      if (file.name.endsWith('.pdb')) {
        const pdbData = await ChellPDB.createPDBFromFile(file);
        this.setState({
          [VIZ_TYPE.NGL]: pdbData.nglStructure,
          errorMsg: '',
          pdbData,
        });
      } else {
        this.setState({
          errorMsg: `Unable to load PDB file '${file.name}' - Make sure the file ends in '.pdb'!`,
        });
      }
    }
  };

  protected onResidueMappingUpload = async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      try {
        const parsedFile = await readFileAsText(file);
        const residueMapping = generateResidueMapping(parsedFile);
        this.setState({
          [VIZ_TYPE.CONTACT_MAP]: {
            couplingScores: getCouplingScoresData(this.state.couplingScores, residueMapping),
            errorMsg: '',
            pdbData: this.state.pdbData,
          },
          residueMapping,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
}

ReactDOM.render(<ExampleApp />, document.getElementById('example-root'));

if (module.hot) {
  module.hot.accept();
}
