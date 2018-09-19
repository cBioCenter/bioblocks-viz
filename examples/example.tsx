import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Grid, GridColumn, GridRow, Header, Label, Segment } from 'semantic-ui-react';

import { ContactMap } from '../src/component/ContactMap';
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
  arePredictionsAvailable: boolean;
  couplingScores: string;
  errorMsg: string;
  filenames?: Partial<{
    couplings: string;
    pdb: string;
    residue_mapper: string;
  }>;
  pdbData?: ChellPDB;
  residueMapping: IResidueMapping[];
}

class ExampleApp extends React.Component<any, IExampleAppState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      [VIZ_TYPE.CONTACT_MAP]: {
        couplingScores: new CouplingContainer(),
        secondaryStructures: [],
      },
      arePredictionsAvailable: false,
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

  protected renderCouplingComponents = ({ arePredictionsAvailable } = this.state) => {
    return (
      <div>
        <Header as={'h1'} attached={'top'}>
          Chell - ContactMap.IO
        </Header>
        <Segment attached={true} raised={true}>
          <CouplingContext>
            <Grid>
              <GridRow centered={true} verticalAlign={'middle'}>
                <GridColumn width={6}>
                  <NGLComponent backgroundColor={'black'} data={this.state[VIZ_TYPE.NGL]} showConfiguration={false} />
                </GridColumn>
                <GridColumn width={6}>
                  {arePredictionsAvailable ? (
                    <PredictedContactMap
                      data={{
                        couplingScores: this.state[VIZ_TYPE.CONTACT_MAP].couplingScores,
                        secondaryStructures: this.state[VIZ_TYPE.CONTACT_MAP].secondaryStructures,
                      }}
                      enableSliders={false}
                    />
                  ) : (
                    <ContactMap
                      data={{
                        couplingScores: this.state[VIZ_TYPE.CONTACT_MAP].couplingScores,
                        secondaryStructures: this.state[VIZ_TYPE.CONTACT_MAP].secondaryStructures,
                      }}
                      enableSliders={false}
                    />
                  )}
                </GridColumn>
              </GridRow>
              <GridRow centered={true} verticalAlign={'bottom'}>
                <GridColumn width={3}>{this.renderPDBUploadForm()}</GridColumn>
                <GridColumn width={3}>{this.renderCouplingScoresUploadForm()}</GridColumn>
                <GridColumn width={3}>{this.renderResidueMappingUploadForm()}</GridColumn>
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
          <ProteinFeatureViewer />
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

  protected renderCouplingScoresUploadForm = ({ filenames } = this.state) => (
    <div>
      {filenames &&
        filenames.couplings && (
          <GridRow>
            <Label>{filenames.couplings}</Label>
          </GridRow>
        )}
      <GridRow>{this.renderUploadForm(this.onCouplingScoreUpload, 'coupling-score', 'Coupling Scores')}</GridRow>
    </div>
  );

  protected renderPDBUploadForm = ({ filenames } = this.state) => (
    <div>
      {filenames &&
        filenames.pdb && (
          <GridRow>
            <Label>{filenames.pdb}</Label>
          </GridRow>
        )}
      <GridRow>{this.renderUploadForm(this.onPDBUpload, 'pdb', 'PDB')}</GridRow>
    </div>
  );

  protected renderResidueMappingUploadForm = ({ filenames } = this.state) => (
    <div>
      {filenames &&
        filenames.residue_mapper && (
          <GridRow>
            <Label>{filenames.residue_mapper}</Label>
          </GridRow>
        )}
      <GridRow>{this.renderUploadForm(this.onResidueMappingUpload, 'residue-mapping', 'Residue Mapping')}</GridRow>
    </div>
  );

  protected onCouplingScoreUpload = async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      try {
        const parsedFile = await readFileAsText(file);
        const couplingScores = getCouplingScoresData(parsedFile, this.state.residueMapping);

        if (this.state.pdbData) {
          const mismatches = this.state.pdbData.getResidueNumberingMismatches(couplingScores);
          console.log(mismatches);
        }

        this.setState({
          [VIZ_TYPE.CONTACT_MAP]: {
            couplingScores,
            pdbData: this.state.pdbData,
            secondaryStructures: [],
          },
          arePredictionsAvailable: true,
          couplingScores: parsedFile,
          errorMsg: '',
          filenames: {
            ...this.state.filenames,
            couplings: file.name,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  protected onPDBUpload = async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      if (file.name.endsWith('.pdb')) {
        const pdbData = await ChellPDB.createPDBFromFile(file);
        this.setState({
          [VIZ_TYPE.NGL]: pdbData.nglStructure,
          [VIZ_TYPE.CONTACT_MAP]:
            this.state[VIZ_TYPE.CONTACT_MAP].couplingScores.totalContacts === 0
              ? {
                  couplingScores: pdbData.contactInformation,
                  pdbData,
                  secondaryStructures: pdbData.secondaryStructureSections,
                }
              : this.state[VIZ_TYPE.CONTACT_MAP],
          errorMsg: '',
          filenames: {
            ...this.state.filenames,
            pdb: file.name,
          },
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
            pdbData: this.state.pdbData,
            secondaryStructures: [],
          },
          errorMsg: '',
          filenames: {
            ...this.state.filenames,
            residue_mapper: file.name,
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
