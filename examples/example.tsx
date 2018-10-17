import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Accordion,
  Button,
  Card,
  Grid,
  GridColumn,
  GridRow,
  Header,
  Label,
  Message,
  Segment,
  TextArea,
} from 'semantic-ui-react';

import {
  ChellPDB,
  CONTACT_DISTANCE_PROXIMITY,
  CONTACT_MAP_DATA_TYPE,
  ContactMap,
  CouplingContainer,
  CouplingContextProvider,
  generateResidueMapping,
  getCouplingScoresData,
  IResidueContext,
  IResidueMapping,
  ISecondaryStructureContext,
  NGL_DATA_TYPE,
  NGLComponent,
  PredictedContactMap,
  readFileAsText,
  ResidueContextConsumer,
  SecondaryStructureContextConsumer,
  VIZ_TYPE,
} from '~chell-viz~';

export interface IExampleAppProps {
  style: React.CSSProperties;
}

export interface IExampleAppState {
  [VIZ_TYPE.CONTACT_MAP]: CONTACT_MAP_DATA_TYPE & { isLoading: boolean };
  [VIZ_TYPE.NGL]: {
    isLoading: boolean;
    pdbData?: NGL_DATA_TYPE;
  };
  arePredictionsAvailable: boolean;
  couplingScores: string;
  errorMsg: string;
  filenames: Partial<{
    couplings: string;
    pdb: string;
    residue_mapper: string;
  }>;
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
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
      isLoading: false,
      pdbData: undefined,
      secondaryStructures: [],
    },
    [VIZ_TYPE.NGL]: {
      isLoading: false,
      pdbData: undefined,
    },
    arePredictionsAvailable: false,
    couplingScores: '',
    errorMsg: '',
    filenames: {},
    isResidueMappingNeeded: false,
    measuredProximity: CONTACT_DISTANCE_PROXIMITY.CLOSEST,
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
          errorMsg: `${mismatches.length} mismatches detected between coupling scores and PDB!`,
          isResidueMappingNeeded: true,
        });
      }
    }
  }

  public render({ style } = this.props) {
    return (
      <div id="ChellVizApp" style={{ ...style, height: '1000px' }}>
        {this.renderCouplingComponents()}
      </div>
    );
  }

  protected renderCouplingComponents = (
    { style } = this.props,
    { arePredictionsAvailable, couplingScores, errorMsg, isResidueMappingNeeded, pdbData } = this.state,
  ) => {
    return (
      <div>
        <Header as={'h1'} attached={'top'}>
          ContactMap.org: 2D and 3D Visualization
        </Header>
        {errorMsg.length > 1 && this.renderErrorMessage()}
        {!pdbData && couplingScores.length === 0 && this.renderStartMessage()}

        <Segment attached={true} raised={true}>
          <CouplingContextProvider>
            <SecondaryStructureContextConsumer>
              {secondaryStructureContext => (
                <ResidueContextConsumer>
                  {residueContext => (
                    <Grid centered={true}>
                      {this.renderUploadButtonsRow(isResidueMappingNeeded, residueContext, secondaryStructureContext)}
                      {this.renderChellComponents(style, arePredictionsAvailable, pdbData)}
                    </Grid>
                  )}
                </ResidueContextConsumer>
              )}
            </SecondaryStructureContextConsumer>
          </CouplingContextProvider>
        </Segment>
        <footer>Powered by {<a href="https://github.com/cBioCenter/chell-viz">Chell</a>}</footer>
      </div>
    );
  };

  protected renderErrorMessage = ({ errorMsg, isResidueMappingNeeded, pdbData } = this.state) => {
    return (
      <Message warning={true}>
        {isResidueMappingNeeded && pdbData ? (
          <div>
            <Message.Header>
              {`Residue numbering mismatch detected - Please upload a file to correct the position numbering differences.`}
              {<br />}
              {`This file should have been part of the an EVCouplings job run and might look like
              '${pdbData.name}.csv' or '${pdbData.name}.indextableplus'`}
            </Message.Header>
            <Message.List>{errorMsg}</Message.List>
            <Message.Content>
              <Accordion
                fluid={true}
                exclusive={false}
                defaultActiveIndex={[]}
                panels={[
                  this.renderSequenceAccordionMessage('PDB', pdbData.sequence),
                  this.renderSequenceAccordionMessage(
                    'Couplings Score',
                    this.state[VIZ_TYPE.CONTACT_MAP].couplingScores.sequence,
                  ),
                ]}
              />
            </Message.Content>
          </div>
        ) : (
          errorMsg
        )}
      </Message>
    );
  };

  protected renderSequenceAccordionMessage = (title: string, content: string) => ({
    content: {
      content: <TextArea style={{ width: '90%' }} value={content} />,
    },
    key: `panel-${title}`,
    title: {
      content: `${title} (${content.length} Amino Acids)`,
    },
  });

  protected renderStartMessage = () => (
    <Message>
      {`To get started, please upload either a PDB (.pdb) or EVCouplings score (.csv) file!`} {<br />} Check out the
      {<a href="evfold.org"> EVFold</a>}, {<a href="sanderlab.org/contact-maps/">Sander Lab</a>}, or
      {<a href="https://evcouplings.org/"> EVCouplings </a>} website to get these files.
    </Message>
  );

  protected renderUploadForm = (
    onChange: (e: React.ChangeEvent) => void,
    id: string,
    content: string,
    disabled?: boolean,
    accepts: string[] = [],
  ) => {
    return (
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
            accept={`.${accepts.join(',.')}`}
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
  };

  protected renderUploadLabel = (label: string | undefined) =>
    label ? (
      <GridColumn verticalAlign={'middle'} textAlign={'justified'}>
        <Label>{label}</Label>
      </GridColumn>
    ) : null;

  protected renderCouplingScoresUploadForm = ({ couplingScores, filenames } = this.state) => {
    return (
      <GridRow>
        {this.renderUploadLabel(filenames.couplings)}
        {this.renderUploadForm(
          this.onCouplingScoreUpload,
          'coupling-score',
          'Coupling Scores',
          couplingScores.length > 0,
          ['csv'],
        )}
      </GridRow>
    );
  };

  protected renderChellComponents = (
    style: React.CSSProperties,
    arePredictionsAvailable: boolean,
    pdbData?: ChellPDB,
  ) => (
    <GridRow verticalAlign={'middle'}>
      <GridColumn width={6}>
        <Card raised={true} style={{ padding: '10px 14px', height: '660px', width: '600px' }}>
          <NGLComponent
            data={this.state[VIZ_TYPE.NGL].pdbData}
            isDataLoading={this.state[VIZ_TYPE.NGL].isLoading}
            measuredProximity={this.state.measuredProximity}
            style={{ ...style, height: '600px', width: '600px' }}
          />
        </Card>
      </GridColumn>
      <GridColumn width={6}>
        <Card raised={true} style={{ padding: '10px 14px', height: '660px', width: '600px' }}>
          {arePredictionsAvailable ? (
            <PredictedContactMap
              data={{
                couplingScores: this.state[VIZ_TYPE.CONTACT_MAP].couplingScores,
                pdbData,
                secondaryStructures: this.state[VIZ_TYPE.CONTACT_MAP].secondaryStructures,
              }}
              height={590}
              isDataLoading={this.state[VIZ_TYPE.CONTACT_MAP].isLoading}
              style={style}
              width={580}
            />
          ) : (
            <ContactMap
              data={{
                couplingScores: this.state[VIZ_TYPE.CONTACT_MAP].couplingScores,
                pdbData,
                secondaryStructures: this.state[VIZ_TYPE.CONTACT_MAP].secondaryStructures,
              }}
              height={585}
              isDataLoading={this.state[VIZ_TYPE.CONTACT_MAP].isLoading}
              style={style}
              width={585}
            />
          )}
        </Card>
      </GridColumn>
    </GridRow>
  );

  protected renderUploadButtonsRow = (
    isResidueMappingNeeded: boolean,
    residueContext: IResidueContext,
    secondaryStructureContext: ISecondaryStructureContext,
  ) => (
    <GridRow columns={4} centered={true} textAlign={'center'} verticalAlign={'bottom'}>
      <GridColumn>{this.renderPDBUploadForm()}</GridColumn>
      <GridColumn>{this.renderCouplingScoresUploadForm()}</GridColumn>
      {isResidueMappingNeeded && <GridColumn>{this.renderResidueMappingUploadForm()}</GridColumn>}
      <GridColumn>{this.renderClearAllButton(residueContext, secondaryStructureContext)}</GridColumn>
    </GridRow>
  );

  protected renderPDBUploadForm = ({ filenames, pdbData } = this.state) => (
    <GridRow>
      {this.renderUploadLabel(filenames.pdb)}
      {this.renderUploadForm(this.onPDBUpload, 'pdb', 'PDB', pdbData !== undefined, ['pdb'])}
    </GridRow>
  );

  protected renderResidueMappingUploadForm = ({ filenames } = this.state) => (
    <GridRow verticalAlign={'middle'} columns={1} centered={true}>
      {this.renderUploadLabel(filenames.residue_mapper)}
      {this.renderUploadForm(this.onResidueMappingUpload, 'residue-mapping', 'Residue Mapping', false, [
        'csv',
        'indextable',
        'indextableplus',
      ])}
    </GridRow>
  );

  protected renderClearAllButton = (
    residueContext: IResidueContext,
    secondaryStructureContext: ISecondaryStructureContext,
  ) => (
    <GridRow verticalAlign={'middle'} columns={1} centered={true}>
      <GridColumn>
        <Label as="label" basic={true} htmlFor={'clear-data'}>
          <Button
            icon={'trash'}
            label={{
              basic: true,
              content: 'Clean View',
            }}
            labelPosition={'right'}
            onClick={this.onClearAll(residueContext, secondaryStructureContext)}
          />
        </Label>
      </GridColumn>
    </GridRow>
  );

  protected onClearAll = (
    residueContext: IResidueContext,
    secondaryStructureContext: ISecondaryStructureContext,
  ) => async () => {
    this.setState(ExampleApp.initialState);
    residueContext.clearAllResidues();
    secondaryStructureContext.clearSecondaryStructure();
    this.forceUpdate();
  };

  protected onCouplingScoreUpload = async (e: React.ChangeEvent) => {
    e.persist();
    const { measuredProximity, pdbData } = this.state;
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      if (file.name.endsWith('.csv')) {
        try {
          this.setState({
            [VIZ_TYPE.CONTACT_MAP]: {
              ...this.state[VIZ_TYPE.CONTACT_MAP],
              isLoading: true,
            },
          });
          const parsedFile = await readFileAsText(file);
          const couplingScores = getCouplingScoresData(parsedFile, this.state.residueMapping);

          const mismatches = pdbData ? pdbData.getResidueNumberingMismatches(couplingScores) : [];
          const isResidueMappingNeeded = mismatches.length > 0;

          this.setState({
            [VIZ_TYPE.CONTACT_MAP]: {
              couplingScores: pdbData
                ? pdbData.amendPDBWithCouplingScores(couplingScores.rankedContacts, measuredProximity)
                : couplingScores,
              isLoading: false,
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
    // !IMPORTANT! Allows same user to clear data and then re-upload same file!
    (e.target as HTMLInputElement).value = '';
  };

  protected onPDBUpload = async (e: React.ChangeEvent) => {
    e.persist();
    const { measuredProximity } = this.state;
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      if (file.name.endsWith('.pdb')) {
        this.setState({
          [VIZ_TYPE.CONTACT_MAP]: {
            ...this.state[VIZ_TYPE.CONTACT_MAP],
            isLoading: true,
          },
          [VIZ_TYPE.NGL]: {
            ...this.state[VIZ_TYPE.NGL],
            isLoading: true,
          },
        });
        const pdbData = await ChellPDB.createPDB(file);
        const couplingScores = pdbData.amendPDBWithCouplingScores(
          this.state[VIZ_TYPE.CONTACT_MAP].couplingScores.rankedContacts,
          measuredProximity,
        );
        this.setState({
          [VIZ_TYPE.CONTACT_MAP]: {
            couplingScores,
            isLoading: false,
            pdbData,
            secondaryStructures: pdbData.secondaryStructureSections,
          },
          [VIZ_TYPE.NGL]: {
            isLoading: false,
            pdbData: pdbData.nglStructure,
          },
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
    // !IMPORTANT! Allows same user to clear data and then re-upload same file!
    (e.target as HTMLInputElement).value = '';
  };

  protected onMeasuredProximityChange = () => (value: number) => {
    this.setState({
      measuredProximity: Object.values(CONTACT_DISTANCE_PROXIMITY)[value] as CONTACT_DISTANCE_PROXIMITY,
    });
  };

  protected onResidueMappingUpload = async (e: React.ChangeEvent) => {
    e.persist();
    const { measuredProximity, pdbData } = this.state;
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    const validFileExtensions = ['csv', 'indextable', 'indextableplus'];
    if (file !== null) {
      const isValidFile = validFileExtensions.reduce((prev, ext) => prev || file.name.endsWith(`.${ext}`), false);
      if (isValidFile) {
        try {
          this.setState({
            [VIZ_TYPE.CONTACT_MAP]: {
              ...this.state[VIZ_TYPE.CONTACT_MAP],
              isLoading: true,
            },
          });
          const parsedFile = await readFileAsText(file);
          const residueMapping = generateResidueMapping(parsedFile);
          const couplingScores = getCouplingScoresData(this.state.couplingScores, residueMapping);
          this.setState({
            [VIZ_TYPE.CONTACT_MAP]: {
              couplingScores: pdbData
                ? pdbData.amendPDBWithCouplingScores(couplingScores.rankedContacts, measuredProximity)
                : couplingScores,
              isLoading: false,
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
          }' - Make sure the file ends in one of the following: '${validFileExtensions.join("', '")}'`,
        });
      }
    }
    // !IMPORTANT! Allows same user to clear data and then re-upload same file!
    (e.target as HTMLInputElement).value = '';
  };
}

ReactDOM.render(<ExampleApp />, document.getElementById('example-root'));

if (module.hot) {
  module.hot.accept();
}
