import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Button, Grid, Header, Label, Message, Segment } from 'semantic-ui-react';

import { createContainerActions, createResiduePairActions } from '~bioblocks-viz~/action';
import { NGLContainer, PredictedContactMap, SpringContainer } from '~bioblocks-viz~/container';
import {
  Bioblocks1DSection,
  BioblocksPDB,
  CONTACT_DISTANCE_PROXIMITY,
  CONTACT_MAP_DATA_TYPE,
  CouplingContainer,
  getPDBAndCouplingMismatch,
  IResidueMismatchResult,
  SECONDARY_STRUCTURE_CODES,
  SECONDARY_STRUCTURE_SECTION,
  SeqIO,
  SeqRecord,
  SEQUENCE_FILE_TYPES,
  VIZ_TYPE,
} from '~bioblocks-viz~/data';
import {
  EMPTY_FUNCTION,
  fetchJSONFile,
  fetchMatrixData,
  generateResidueMapping,
  getCouplingScoresData,
  IResidueMapping,
  readFileAsText,
} from '~bioblocks-viz~/helper';
import { BBStore } from '~bioblocks-viz~/reducer';
import {
  ICategoricalAnnotation,
  UMAPSequenceContainer,
  UMAPTranscriptionalContainer,
} from '~bioblocks-viz~/singlepage';

export interface IExampleAppProps {
  fastaFilename: string;
  style: Exclude<React.CSSProperties, 'height' | 'width'>;
  taxonomyFilename?: string;
  removeAllHoveredSecondaryStructures(): void;
  removeAllLockedResiduePairs(): void;
  removeAllSelectedSecondaryStructures(): void;
  removeCandidateResidues(): void;
  removeHoveredResidues(): void;
  removeNonLockedResidues(): void;
}

export interface IExampleAppState {
  [VIZ_TYPE.CONTACT_MAP]: CONTACT_MAP_DATA_TYPE;
  experimentalProteins: BioblocksPDB[];
  isDragHappening: boolean;
  datasetLocation: string;
  errorMsg: string;
  isLoading: boolean;
  taxonomyText?: string;
  allSequences: SeqRecord[];
  scRNAseqMatrix: number[][];
  scRNAseqCategoricalData: ICategoricalAnnotation;
  scRNAseqCategorySelected: string;
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
  mismatches: IResidueMismatchResult[];
  predictedProteins: BioblocksPDB[];
  residueMapping: IResidueMapping[];
}

// TODO: Move to helper.
export const fetchFastaFile = async (filename: string) => {
  const response = await fetch(filename);
  if (response.ok) {
    return SeqIO.parseFile(await response.text(), SEQUENCE_FILE_TYPES.fasta);
  } else {
    throw new Error(`error ${response}`);
  }
};

class ExampleAppClass extends React.Component<IExampleAppProps, IExampleAppState> {
  public static initialState: IExampleAppState = {
    [VIZ_TYPE.CONTACT_MAP]: {
      couplingScores: new CouplingContainer(),
      pdbData: { experimental: undefined, predicted: undefined },
      secondaryStructures: [],
    },
    allSequences: new Array<SeqRecord>(),
    datasetLocation: 'hpc/full', // tabula_muris/full
    errorMsg: '',
    experimentalProteins: [],
    isDragHappening: false,
    isLoading: false,
    measuredProximity: CONTACT_DISTANCE_PROXIMITY.CLOSEST,
    mismatches: [],
    predictedProteins: [],
    residueMapping: [],
    scRNAseqCategoricalData: {},
    scRNAseqCategorySelected: 'Sample', // 'Louvain cluster',
    scRNAseqMatrix: new Array<number[]>(),
    taxonomyText: '',
  };

  public static defaultProps = {
    fastaFilename: 'datasets/betalactamase_alignment/PSE1_natural_top5K_subsample.a2m',
    removeAllHoveredSecondaryStructures: EMPTY_FUNCTION,
    removeAllLockedResiduePairs: EMPTY_FUNCTION,
    removeAllSelectedSecondaryStructures: EMPTY_FUNCTION,
    removeCandidateResidues: EMPTY_FUNCTION,
    removeHoveredResidues: EMPTY_FUNCTION,
    removeNonLockedResidues: EMPTY_FUNCTION,
    style: {
      backgroundColor: '#ffffff',
    },
    taxonomyFilename: 'datasets/betalactamase_alignment/PSE1_NATURAL_TAXONOMY.csv',
  };

  public constructor(props: IExampleAppProps) {
    super(props);
    this.state = ExampleAppClass.initialState;
  }

  public async componentDidMount() {
    await this.setupUMAPData();
  }

  public async componentDidUpdate(prevProps: IExampleAppProps, prevState: IExampleAppState) {
    const { datasetLocation, measuredProximity, predictedProteins } = this.state;
    const { couplingScores } = this.state[VIZ_TYPE.CONTACT_MAP];

    const pdbData = predictedProteins.length >= 1 ? predictedProteins[0] : undefined;

    let errorMsg = '';

    let newMismatches = this.state.mismatches;

    if (prevState.datasetLocation !== datasetLocation) {
      await this.setupUMAPData();
    } else if (
      pdbData &&
      (prevState.predictedProteins.length === 0 || prevState.predictedProteins[0] !== pdbData) &&
      couplingScores !== prevState[VIZ_TYPE.CONTACT_MAP].couplingScores
    ) {
      newMismatches = getPDBAndCouplingMismatch(pdbData, couplingScores);

      if (newMismatches.length >= 1) {
        errorMsg = `Error details: ${newMismatches.length} mismatch(es) detected between coupling scores and PDB!\
        For example, residue number ${newMismatches[0].resno} is '${newMismatches[0].pdbAminoAcid.threeLetterCode}'\
        in the PDB but '${newMismatches[0].couplingAminoAcid.threeLetterCode}' in the coupling scores file.`;
      }
    }

    if (pdbData && measuredProximity !== prevState.measuredProximity) {
      this.setState({
        [VIZ_TYPE.CONTACT_MAP]: {
          couplingScores: pdbData.amendPDBWithCouplingScores(couplingScores.rankedContacts, measuredProximity),
          pdbData: { experimental: pdbData },
          secondaryStructures: [],
        },
        errorMsg,
        mismatches: newMismatches,
      });
    } else if (errorMsg.length >= 1) {
      this.setState({
        errorMsg,
        mismatches: newMismatches,
      });
    }
  }

  public render({ style } = this.props) {
    return (
      <div id={'BioblocksVizApp'} style={{ ...style, height: '1000px' }}>
        <meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
        {this.renderUMapAndSpring()}
        {/*
        <UMAPSequenceContainer
          allSequences={this.state.allSequences}
          taxonomyText={this.state.taxonomyText}
          labelCategory={'class'}
        />*/}
        {/*</iframe>*/}
        {/*<TensorTContainer datasetLocation={'datasets/hpc/full'} />*/}
      </div>
    );
  }

  protected renderUMapAndSpring() {
    const { datasetLocation, scRNAseqCategoricalData, scRNAseqCategorySelected, scRNAseqMatrix } = this.state;

    return (
      <Grid centered={true} padded={true}>
        <Grid.Row columns={2} verticalAlign={'bottom'}>
          <Grid.Column width={7}>
            <UMAPTranscriptionalContainer
              numSamplesToShow={5000}
              numIterationsBeforeReRender={1}
              categoricalAnnotations={scRNAseqCategoricalData}
              labelCategory={scRNAseqCategorySelected}
              sampleNames={undefined}
              dataMatrix={scRNAseqMatrix}
            />
          </Grid.Column>
          <Grid.Column width={7}>
            <SpringContainer datasetsURI={'datasets'} datasetLocation={datasetLocation} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ padding: '15px 0 0 0' }} verticalAlign={'bottom'}>
          <Grid.Column width={7}>{`Currently viewing ${this.state.datasetLocation} dataset`}</Grid.Column>
          <Grid.Column width={7}>
            <Button onClick={this.onSwitchDataset}>
              {`Switch to ${this.state.datasetLocation === 'hpc/full' ? 'tabula_muris/full' : 'hpc/full'} dataset`}
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  protected async setupUMAPData() {
    const { datasetLocation } = this.state;
    let taxonomyText;
    if (this.props.taxonomyFilename) {
      taxonomyText = await (await fetch(this.props.taxonomyFilename)).text();
    }

    this.setState({
      allSequences: await fetchFastaFile(this.props.fastaFilename),
      scRNAseqCategoricalData: (await fetchJSONFile(
        `datasets/${datasetLocation}/categorical_coloring_data.json`,
      )) as ICategoricalAnnotation,
      scRNAseqMatrix: await fetchMatrixData(`datasets/${datasetLocation}/tsne_matrix.csv`),
      taxonomyText,
    });
  }

  protected onSwitchDataset = () => {
    this.setState({
      allSequences: [],
      datasetLocation: this.state.datasetLocation === 'hpc/full' ? 'tabula_muris/full' : 'hpc/full',
      scRNAseqCategoricalData: {},
      scRNAseqMatrix: new Array(new Array<number>()),
    });
  };

  protected onClearAll = () => async () => {
    const {
      removeAllHoveredSecondaryStructures,
      removeAllLockedResiduePairs,
      removeAllSelectedSecondaryStructures,
      removeCandidateResidues,
      removeHoveredResidues,
      removeNonLockedResidues,
    } = this.props;

    removeAllHoveredSecondaryStructures();
    removeAllSelectedSecondaryStructures();
    removeAllLockedResiduePairs();
    removeCandidateResidues();
    removeHoveredResidues();
    removeNonLockedResidues();
    this.setState({ ...ExampleAppClass.initialState });
    this.forceUpdate();
  };

  // tslint:disable-next-line: max-func-body-length
  protected onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const files = (e.target as HTMLInputElement).files;
    if (!files) {
      return;
    }

    await this.onClearAll()();
    const { measuredProximity } = this.state;

    this.setState({
      experimentalProteins: [],
      isDragHappening: false,
      isLoading: true,
      predictedProteins: [],
    });

    let couplingScoresCSV: string = '';
    let couplingFlag: boolean = false;
    let pdbData: BioblocksPDB | undefined;
    let residueMapping: IResidueMapping[] = [];
    let secondaryStructures: SECONDARY_STRUCTURE_SECTION[] = [];

    const experimentalProteins = new Array<BioblocksPDB>();
    const predictedProteins = new Array<BioblocksPDB>();
    for (let i = 0; i < files.length; ++i) {
      const file = files.item(i) as { path?: string } & File;

      if (file.name.endsWith('.pdb')) {
        pdbData = await BioblocksPDB.createPDB(file);
        if (file.name.includes('pred')) {
          predictedProteins.push(pdbData);
        } else if (file.name.includes('exp')) {
          experimentalProteins.push(pdbData);
        }
      } else {
        const parsedFile = await readFileAsText(file);
        if (
          file.name.endsWith('indextable') ||
          file.name.endsWith('indextableplus') ||
          file.name.startsWith('residue_mapping')
        ) {
          residueMapping = generateResidueMapping(parsedFile);
        } else if (file.name.endsWith('CouplingScoresCompared_all.csv')) {
          couplingScoresCSV = parsedFile;
          couplingFlag = true;
        } else if (file.name.endsWith('.csv') && file.name.includes('distance_map')) {
          secondaryStructures = new Array<SECONDARY_STRUCTURE_SECTION>();
          parsedFile
            .split('\n')
            .slice(1)
            .filter(row => row.split(',').length >= 3)
            .forEach(row => {
              const items = row.split(',');
              const resno = parseFloat(items[1]);
              const structId = items[2] as keyof typeof SECONDARY_STRUCTURE_CODES;
              if (
                secondaryStructures[secondaryStructures.length - 1] &&
                secondaryStructures[secondaryStructures.length - 1].label === structId
              ) {
                secondaryStructures[secondaryStructures.length - 1].updateEnd(resno);
              } else {
                secondaryStructures.push(new Bioblocks1DSection(structId, resno));
              }
            });
        }
      }
    }

    if (pdbData && experimentalProteins.length === 0 && predictedProteins.length === 0) {
      experimentalProteins.push(pdbData);
    } else if (experimentalProteins.length === 0) {
      pdbData = predictedProteins[0];
    } else {
      pdbData = experimentalProteins[0];
    }

    let couplingScores = getCouplingScoresData(couplingScoresCSV, residueMapping);
    let mismatches = new Array<IResidueMismatchResult>();

    if (pdbData) {
      if (couplingScores.rankedContacts.length === 0 || couplingScores.rankedContacts[0].dist === undefined) {
        couplingScores = pdbData.amendPDBWithCouplingScores(couplingScores.rankedContacts, measuredProximity);
      } else {
        mismatches = pdbData.getResidueNumberingMismatches(couplingScores);
      }
    }
    couplingScores.isDerivedFromCouplingScores = couplingFlag;

    this.setState({
      [VIZ_TYPE.CONTACT_MAP]: {
        couplingScores,
        pdbData: { experimental: experimentalProteins[0], predicted: predictedProteins[0] },
        secondaryStructures:
          secondaryStructures.length >= 1 ? [secondaryStructures] : pdbData ? pdbData.secondaryStructureSections : [],
      },
      errorMsg: '',
      experimentalProteins,
      isLoading: false,
      mismatches,
      predictedProteins,
    });
    e.target.value = '';
  };

  protected onMeasuredProximityChange = () => (value: number) => {
    this.setState({
      measuredProximity: Object.values(CONTACT_DISTANCE_PROXIMITY)[value] as CONTACT_DISTANCE_PROXIMITY,
    });
  };

  protected renderButtonsRow = () => {
    return (
      <Grid.Row textAlign={'right'} verticalAlign={'bottom'}>
        <Grid.Column style={{ height: '100%', width: 'auto' }}>{this.renderClearAllButton()}</Grid.Column>
        <Grid.Column style={{ height: '100%', width: 'auto' }}>
          <Grid.Row>{this.renderUploadForm(this.onFileUpload, 'upload-coupling-scores', 'Upload Files')}</Grid.Row>
        </Grid.Column>
      </Grid.Row>
    );
  };

  protected renderCouplingComponents = ({ style } = this.props, { measuredProximity } = this.state) => (
    <Segment attached={true} raised={true}>
      <Header as={'h1'} attached={'top'}>
        Bioblocks-Viz: Visualization Component Library
      </Header>

      {this.renderStartMessage()}
      <Grid centered={true} padded={true} relaxed={true}>
        {this.renderButtonsRow()}
        <Grid.Row>
          <br />
        </Grid.Row>
        <Grid.Row columns={2} verticalAlign={'bottom'}>
          <Grid.Column width={7}>{this.renderContactMapCard(style)}</Grid.Column>
          <Grid.Column width={7}>{this.renderNGLCard(measuredProximity)}</Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );

  protected renderSequenceAccordionMessage = (
    title: string,
    sequence: string,
    mismatches: IResidueMismatchResult[],
    pdbOrCoupling: 'pdb' | 'coupling',
  ) => {
    let startIndex = 0;
    let prevResno = mismatches[0].resno;
    const result = new Array<JSX.Element>();

    for (const mismatch of mismatches) {
      const aminoAcid = pdbOrCoupling === 'pdb' ? mismatch.pdbAminoAcid : mismatch.couplingAminoAcid;
      const resIndex = sequence.indexOf(aminoAcid.singleLetterCode, startIndex + (mismatch.resno - prevResno));

      if (resIndex >= 0) {
        result.push(
          <React.Fragment key={`mismatch-${mismatch.resno}`}>
            <span style={{ color: 'black', fontSize: '12px' }}>{sequence.substring(startIndex, resIndex)}</span>
            <span style={{ color: 'red', fontSize: '16px', textDecoration: 'underline' }}>
              {sequence.charAt(resIndex)}
            </span>
          </React.Fragment>,
        );

        prevResno = mismatch.resno + 1;
        startIndex = resIndex + 1;
      }
    }

    result.push(
      <span key={'mismatch-final'} style={{ color: 'black', fontSize: '12px' }}>
        {sequence.substring(startIndex)}
      </span>,
    );

    return {
      content: {
        content: <p style={{ width: '80%', wordBreak: 'break-word' }}>{result}</p>,
      },
      key: `panel-${title}`,
      title: {
        content: `${title} (${sequence.length} Amino Acids)`,
      },
    };
  };
  protected renderStartMessage = () => (
    <Message>
      {`To get started, please upload either a PDB (.pdb) or EVCouplings score (.csv) file!`} {<br />} Check out the
      {/* tslint:disable-next-line: no-http-string*/}
      {<a href="http://evfold.org"> EVFold</a>}, {<a href="http://sanderlab.org/contact-maps/">Sander Lab</a>}, or
      {<a href="https://evcouplings.org/"> EVCouplings </a>} website to get these files.
    </Message>
  );

  protected renderUploadForm = (
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    id: string,
    content: string,
    disabled?: boolean,
  ) => {
    return (
      <Grid.Column>
        <Label as={'label'} basic={true} htmlFor={id}>
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
            multiple={true}
          />
        </Label>
      </Grid.Column>
    );
  };

  protected renderContactMapCard = (style: React.CSSProperties) => {
    const { isLoading, 'Contact Map': contactMapState } = this.state;

    return (
      <PredictedContactMap
        data={{
          couplingScores: contactMapState.couplingScores,
          pdbData: {
            experimental: contactMapState.pdbData ? contactMapState.pdbData.experimental : undefined,
            predicted: contactMapState.pdbData ? contactMapState.pdbData.predicted : undefined,
          },
          secondaryStructures: contactMapState.secondaryStructures,
        }}
        isDataLoading={isLoading}
        style={style}
      />
    );
  };

  protected renderNGLCard = (measuredProximity: CONTACT_DISTANCE_PROXIMITY) => {
    const { isLoading, experimentalProteins, predictedProteins } = this.state;

    return (
      <NGLContainer
        experimentalProteins={experimentalProteins}
        isDataLoading={isLoading}
        measuredProximity={measuredProximity}
        onMeasuredProximityChange={this.onMeasuredProximityChange()}
        predictedProteins={predictedProteins}
      />
    );
  };

  protected renderClearAllButton = () => (
    <Grid.Row verticalAlign={'middle'} columns={1} centered={true}>
      <Grid.Column>
        <Label as="label" basic={true} htmlFor={'clear-data'}>
          <Button
            icon={'trash'}
            label={{
              basic: true,
              content: 'Clean View',
            }}
            labelPosition={'right'}
            onClick={this.onClearAll()}
          />
        </Label>
      </Grid.Column>
    </Grid.Row>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      removeAllHoveredSecondaryStructures: createContainerActions('secondaryStructure/hovered').clear,
      removeAllLockedResiduePairs: createResiduePairActions().locked.clear,
      removeAllSelectedSecondaryStructures: createContainerActions('secondaryStructure/selected').clear,
      removeCandidateResidues: createResiduePairActions().candidates.clear,
      removeHoveredResidues: createResiduePairActions().hovered.clear,
    },
    dispatch,
  );

const ExampleApp = connect(
  null,
  mapDispatchToProps,
)(ExampleAppClass);

ReactDOM.render(
  <Provider store={BBStore}>
    <ExampleApp />
  </Provider>,
  document.getElementById('example-root'),
);

if (module.hot) {
  module.hot.accept();
}
