import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Grid, GridColumn, GridRow, Header, Label, Message, Segment } from 'semantic-ui-react';

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

export interface IExampleAppProps {
  style: React.CSSProperties;
}

export interface IExampleAppState {
  [VIZ_TYPE.CONTACT_MAP]: CONTACT_MAP_DATA_TYPE;
  [VIZ_TYPE.NGL]?: NGL_DATA_TYPE;
  arePredictionsAvailable: boolean;
  couplingScores: string;
  errorMsg: string;
  filenames: Partial<{
    couplings: string;
    pdb: string;
    residue_mapper: string;
  }>;
  isResidueMappingNeeded: boolean;
  pdbData?: ChellPDB;
  residueMapping: IResidueMapping[];
}

class ExampleApp extends React.Component<IExampleAppProps, IExampleAppState> {
  public static defaultProps: IExampleAppProps = {
    style: {
      backgroundColor: '#ffffff',
    },
  };

  protected static initialState: IExampleAppState = {
    [VIZ_TYPE.CONTACT_MAP]: {
      couplingScores: new CouplingContainer(),
      pdbData: undefined,
      secondaryStructures: [],
    },
    [VIZ_TYPE.NGL]: undefined,
    arePredictionsAvailable: false,
    couplingScores: '',
    errorMsg: '',
    filenames: {},
    isResidueMappingNeeded: false,
    pdbData: undefined,
    residueMapping: [],
  };

  public constructor(props: IExampleAppProps) {
    super(props);
    this.state = ExampleApp.initialState;
  }

  public componentDidUpdate(prevProps: IExampleAppProps, prevState: IExampleAppState) {
    const { pdbData } = this.state;
    const { couplingScores } = this.state[VIZ_TYPE.CONTACT_MAP];

    if (
      pdbData &&
      (couplingScores !== prevState[VIZ_TYPE.CONTACT_MAP].couplingScores || pdbData !== prevState.pdbData)
    ) {
      const mismatches = pdbData.getResidueNumberingMismatches(couplingScores);
      if (mismatches.length >= 1) {
        this.setState({
          errorMsg: `${mismatches.length} mismatches detected between coupling scores and PDB!
              Coupling Sequence: ${couplingScores.sequence}\n\
              PDB Sequence: ${this.state.pdbData!.sequence}`,
          isResidueMappingNeeded: true,
        });
      }
    }
  }

  public render({ style } = this.props) {
    return (
      <div id="ChellVizApp" style={{ ...style, height: '1000px' }}>
        {this.renderFeatureViewer()}
        {this.renderCouplingComponents()}
      </div>
    );
  }

  protected renderCouplingComponents = (
    { style } = this.props,
    { arePredictionsAvailable, errorMsg, isResidueMappingNeeded } = this.state,
  ) => {
    return (
      <div>
        <Header as={'h1'} attached={'top'}>
          Chell - ContactMap.IO
        </Header>
        {errorMsg.length > 1 && (
          <Message warning={true}>
            {isResidueMappingNeeded && (
              <Message.Header>
                Residue numbering mismatch detected - Please upload a residue mapping file for more accurate
                interactions!
              </Message.Header>
            )}
            {errorMsg}
          </Message>
        )}
        <Segment attached={true} raised={true}>
          <CouplingContext>
            <Grid centered={true}>
              <GridRow verticalAlign={'middle'}>
                <GridColumn width={6}>
                  <NGLComponent
                    backgroundColor={'black'}
                    data={this.state[VIZ_TYPE.NGL]}
                    showConfiguration={false}
                    style={{ ...style, width: 400 }}
                  />
                </GridColumn>
                <GridColumn width={6}>
                  {arePredictionsAvailable ? (
                    <PredictedContactMap
                      data={{
                        couplingScores: this.state[VIZ_TYPE.CONTACT_MAP].couplingScores,
                        pdbData: this.state.pdbData,
                        secondaryStructures: this.state[VIZ_TYPE.CONTACT_MAP].secondaryStructures,
                      }}
                      enableSliders={false}
                      style={{ ...style, width: 400 }}
                    />
                  ) : (
                    <ContactMap
                      data={{
                        couplingScores: this.state[VIZ_TYPE.CONTACT_MAP].couplingScores,
                        pdbData: this.state.pdbData,
                        secondaryStructures: this.state[VIZ_TYPE.CONTACT_MAP].secondaryStructures,
                      }}
                      enableSliders={false}
                      style={{ ...style, width: 400 }}
                    />
                  )}
                </GridColumn>
              </GridRow>
              <GridRow columns={4} centered={true} textAlign={'center'} verticalAlign={'bottom'}>
                <GridColumn>{this.renderPDBUploadForm()}</GridColumn>
                <GridColumn>{this.renderCouplingScoresUploadForm()}</GridColumn>
                {isResidueMappingNeeded && <GridColumn>{this.renderResidueMappingUploadForm()}</GridColumn>}
                <GridColumn>{this.renderClearAllButton()}</GridColumn>
              </GridRow>
            </Grid>
          </CouplingContext>
        </Segment>
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

  protected renderUploadForm = (
    onChange: (e: React.ChangeEvent<Element>) => void,
    id: string,
    content: string,
    disabled = false,
  ) => (
    <GridColumn>
      <Label as="label" basic={true} htmlFor={id}>
        <Button
          disabled={disabled}
          icon={'upload'}
          label={{
            basic: true,
            content,
          }}
          labelPosition={'right'}
        />
        <input
          disabled={disabled}
          id={id}
          onChange={onChange}
          hidden={true}
          type={'file'}
          required={true}
          multiple={false}
        />
      </Label>
    </GridColumn>
  );

  protected renderUploadLabel = (label: string | undefined) =>
    label ? (
      <GridColumn verticalAlign={'middle'} textAlign={'justified'}>
        <Label>{label}</Label>
      </GridColumn>
    ) : null;

  protected renderCouplingScoresUploadForm = ({ couplingScores, filenames } = this.state) => (
    <div>
      {this.renderUploadLabel(filenames.couplings)}
      {this.renderUploadForm(
        this.onCouplingScoreUpload,
        'coupling-score',
        'Coupling Scores',
        couplingScores.length > 0,
      )}
    </div>
  );

  protected renderPDBUploadForm = ({ filenames, pdbData } = this.state) => (
    <GridRow>
      {this.renderUploadLabel(filenames.pdb)}
      {this.renderUploadForm(this.onPDBUpload, 'pdb', 'PDB', pdbData !== undefined)}
    </GridRow>
  );

  protected renderResidueMappingUploadForm = ({ filenames } = this.state) => (
    <GridRow verticalAlign={'middle'} columns={1} centered={true}>
      {this.renderUploadLabel(filenames.residue_mapper)}
      {this.renderUploadForm(this.onResidueMappingUpload, 'residue-mapping', 'Residue Mapping')}
    </GridRow>
  );

  protected renderClearAllButton = () => (
    <GridRow verticalAlign={'middle'} columns={1} centered={true}>
      <GridColumn>
        <Label as="label" basic={true} htmlFor={'clear-data'}>
          <Button
            icon={'trash'}
            label={{
              basic: true,
              content: 'Clear Data',
            }}
            labelPosition={'right'}
            onClick={this.onClearAll}
          />
        </Label>
      </GridColumn>
    </GridRow>
  );

  protected onClearAll = () => {
    this.setState({
      ...ExampleApp.initialState,
    });
  };

  protected onCouplingScoreUpload = async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      if (file.name.endsWith('.csv')) {
        try {
          const parsedFile = await readFileAsText(file);
          const couplingScores = getCouplingScoresData(parsedFile, this.state.residueMapping);

          const mismatches = this.state.pdbData ? this.state.pdbData.getResidueNumberingMismatches(couplingScores) : [];
          const isResidueMappingNeeded = mismatches.length > 0;

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
            isResidueMappingNeeded,
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        this.setState({
          errorMsg: `Unable to load Coupling Score file '${file.name}' - Make sure the file ends in '.csv'!`,
        });
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
    const validFileExtensions = ['csv', 'indextable', 'indextableplus'];

    if (file !== null) {
      const isValidFile = validFileExtensions.reduce((prev, ext) => prev || file.name.endsWith(`.${ext}`), false);
      if (isValidFile) {
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
      } else {
        this.setState({
          errorMsg: `Unable to load Residue Mapping file '${
            file.name
          }' - Make sure the file ends in one of the following: ${validFileExtensions.join(', ')}`,
        });
      }
    }
  };
}

ReactDOM.render(<ExampleApp />, document.getElementById('example-root'));

if (module.hot) {
  module.hot.accept();
}
