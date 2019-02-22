import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { Accordion, Button, Grid, GridColumn, GridRow, Header, Label, Message, Segment } from 'semantic-ui-react';

import { createContainerActions, createResiduePairActions } from '~bioblocks-viz~/action';
import { ContactMap, PredictedContactMap } from '~bioblocks-viz~/component';
import { NGLContainer, ProteinFeatureViewer } from '~bioblocks-viz~/container';
import {
  BIOBLOCKS_CSS_STYLE,
  BioblocksPDB,
  CONTACT_DISTANCE_PROXIMITY,
  CONTACT_MAP_DATA_TYPE,
  CouplingContainer,
  getPDBAndCouplingMismatch,
  IResidueMismatchResult,
  NGL_DATA_TYPE,
  VIZ_TYPE,
} from '~bioblocks-viz~/data';
import { generateResidueMapping, getCouplingScoresData, IResidueMapping, readFileAsText } from '~bioblocks-viz~/helper';
import { Store } from '~bioblocks-viz~/reducer';

export interface IExampleAppProps {
  style: BIOBLOCKS_CSS_STYLE;
  clearAllResidues(): void;
  clearAllSecondaryStructures(): void;
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
  mismatches: IResidueMismatchResult[];
  isResidueMappingNeeded: boolean;
  pdbData?: BioblocksPDB;
  residueMapping: IResidueMapping[];
}

class ExampleAppClass extends React.Component<IExampleAppProps, IExampleAppState> {
  public static defaultProps = {
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
    mismatches: [],
    pdbData: undefined,
    residueMapping: [],
  };

  public constructor(props: IExampleAppProps) {
    super(props);
    this.state = ExampleAppClass.initialState;
  }

  public componentDidUpdate(prevProps: IExampleAppProps, prevState: IExampleAppState) {
    const { measuredProximity, pdbData } = this.state;
    const { couplingScores } = this.state[VIZ_TYPE.CONTACT_MAP];

    let errorMsg = '';

    let newMismatches = this.state.mismatches;
    let isResidueMappingNeeded = this.state.isResidueMappingNeeded;

    if (
      pdbData &&
      (couplingScores !== prevState[VIZ_TYPE.CONTACT_MAP].couplingScores || pdbData !== prevState.pdbData)
    ) {
      newMismatches = getPDBAndCouplingMismatch(pdbData, couplingScores);

      if (newMismatches.length >= 1) {
        errorMsg = `Error details: ${newMismatches.length} mismatch(es) detected between coupling scores and PDB!\
        For example, residue number ${newMismatches[0].resno} is '${
          newMismatches[0].pdbAminoAcid.threeLetterCode
        }' in the PDB but '${newMismatches[0].couplingAminoAcid.threeLetterCode}' in the coupling scores file.`;
        isResidueMappingNeeded = true;
      }
    }

    if (pdbData && measuredProximity !== prevState.measuredProximity) {
      this.setState({
        [VIZ_TYPE.CONTACT_MAP]: {
          couplingScores: pdbData.amendPDBWithCouplingScores(couplingScores.rankedContacts, measuredProximity),
          isLoading: false,
          pdbData: { known: this.state.pdbData },
          secondaryStructures: [],
        },
        errorMsg,
        isResidueMappingNeeded,
        mismatches: newMismatches,
      });
    } else if (errorMsg.length >= 1) {
      this.setState({
        errorMsg,
        isResidueMappingNeeded,
        mismatches: newMismatches,
      });
    }
  }

  public render({ style } = this.props) {
    return (
      <div id="BioblocksVizApp" style={{ ...style, height: '1000px' }}>
        {this.renderCouplingComponents()}
        <ProteinFeatureViewer />
      </div>
    );
  }

  protected renderCouplingComponents = (
    { style } = this.props,
    { arePredictionsAvailable, couplingScores, errorMsg, isResidueMappingNeeded, measuredProximity, pdbData } = this
      .state,
  ) => (
    <div>
      <Header as={'h1'} attached={'top'}>
        ContactMap.org: 2D and 3D Visualization
      </Header>
      {errorMsg.length > 1 && this.renderErrorMessage()}
      {!pdbData && couplingScores.length === 0 && this.renderStartMessage()}

      <Segment attached={true} raised={true}>
        <Grid centered={true} padded={true} relaxed={true}>
          {this.renderUploadButtonsRow(isResidueMappingNeeded)}
          <Grid.Row>
            <br />
          </Grid.Row>
          {this.renderBioblocksComponents(style, arePredictionsAvailable, measuredProximity, pdbData)}
        </Grid>
      </Segment>
      {this.renderFooter()}
    </div>
  );

  protected renderErrorMessage = ({ errorMsg, isResidueMappingNeeded, mismatches, pdbData } = this.state) => {
    return (
      <Message warning={true}>
        {isResidueMappingNeeded && pdbData ? (
          <div>
            <Message.Header>
              {`Residue numbering mismatch detected. Please upload a file to correct the position numbering differences.`}
              {<br />}
              {`EVCouplings and EVFold outputs this file in the `}
              <strong>OUTPUT</strong>
              {` directory.
                This file might be named similar to
                '${pdbData.name}.csv' or '${pdbData.name}.indextableplus'`}
            </Message.Header>
            <Message.List>{errorMsg}</Message.List>
            <Message.Content>
              <Accordion
                fluid={true}
                exclusive={false}
                defaultActiveIndex={[]}
                panels={[
                  this.renderSequenceAccordionMessage('PDB sequence', pdbData.sequence, mismatches, 'pdb'),
                  this.renderSequenceAccordionMessage(
                    'Couplings Score sequence',
                    this.state[VIZ_TYPE.CONTACT_MAP].couplingScores.sequence,
                    mismatches,
                    'coupling',
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

  protected renderFooter = () => {
    const bioblocks = <a href="https://github.com/cBioCenter/bioblocks-viz">Bioblocks</a>;

    // prettier-ignore
    const sayings = [
      <>Powered by {bioblocks}!</>,
      <>They love me at the {bioblocks}sea.</>,
      <>Today's visualization has been brought to you by {bioblocks}.</>,
      <>{bioblocks}sea, {bioblocks}sea, I believe...</>,
      <>Now you're thinking with {bioblocks}!</>,
      <>And {bioblocks}sea says she's got nowhere to go...</>,
    ].map(saying => <React.Fragment key={'random-bioblocks-saying'}>{saying}</React.Fragment>);

    // tslint:disable-next-line:insecure-random
    const randomSaying = sayings[Math.floor(Math.random() * sayings.length)];

    return <footer style={{ padding: '25vh 0 25px 25px' }}>{randomSaying}</footer>;
  };

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
      {/* tslint:disable-next-line:no-http-string */}
      {<a href="http://evfold.org"> EVFold</a>}, {<a href="http://sanderlab.org/contact-maps/">Sander Lab</a>}, or
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

  protected renderBioblocksComponents = (
    style: React.CSSProperties,
    arePredictionsAvailable: boolean,
    measuredProximity: CONTACT_DISTANCE_PROXIMITY,
    pdbData?: BioblocksPDB,
    size: number | string = '550px',
  ) => (
    <GridRow columns={2}>
      <GridColumn width={7}>{this.renderContactMapCard(arePredictionsAvailable, size, style, pdbData)}</GridColumn>
      <GridColumn width={7}>{this.renderNGLCard(measuredProximity, pdbData)}</GridColumn>
    </GridRow>
  );

  protected renderContactMapCard = (
    arePredictionsAvailable: boolean,
    size: number | string,
    style: React.CSSProperties,
    pdbData?: BioblocksPDB,
  ) =>
    arePredictionsAvailable ? (
      <PredictedContactMap
        data={{
          couplingScores: this.state[VIZ_TYPE.CONTACT_MAP].couplingScores,
          pdbData: { known: pdbData },
          secondaryStructures: this.state[VIZ_TYPE.CONTACT_MAP].secondaryStructures,
        }}
        height={size}
        isDataLoading={this.state[VIZ_TYPE.CONTACT_MAP].isLoading}
        style={style}
        width={size}
      />
    ) : (
      <ContactMap
        data={{
          couplingScores: this.state[VIZ_TYPE.CONTACT_MAP].couplingScores,
          pdbData: { known: pdbData },
          secondaryStructures: this.state[VIZ_TYPE.CONTACT_MAP].secondaryStructures,
        }}
        height={size}
        isDataLoading={this.state[VIZ_TYPE.CONTACT_MAP].isLoading}
        style={style}
        width={size}
      />
    );

  protected renderNGLCard = (measuredProximity: CONTACT_DISTANCE_PROXIMITY, pdbData?: BioblocksPDB) => (
    <NGLContainer
      data={pdbData}
      isDataLoading={this.state[VIZ_TYPE.NGL].isLoading}
      measuredProximity={measuredProximity}
      onMeasuredProximityChange={this.onMeasuredProximityChange()}
    />
  );

  protected renderUploadButtonsRow = (isResidueMappingNeeded: boolean) => (
    <GridRow columns={4} textAlign={'center'} verticalAlign={'bottom'}>
      <GridColumn>{this.renderCouplingScoresUploadForm()}</GridColumn>
      <GridColumn>{this.renderPDBUploadForm()}</GridColumn>
      {isResidueMappingNeeded && <GridColumn>{this.renderResidueMappingUploadForm()}</GridColumn>}
      <GridColumn>{this.renderClearAllButton()}</GridColumn>
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

  protected renderClearAllButton = () => (
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
            onClick={this.onClearAll()}
          />
        </Label>
      </GridColumn>
    </GridRow>
  );

  protected onClearAll = () => async () => {
    const { clearAllResidues, clearAllSecondaryStructures } = this.props;
    this.setState(ExampleAppClass.initialState);
    clearAllResidues();
    clearAllSecondaryStructures();
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
              pdbData: { known: this.state.pdbData },
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
        const pdbData = await BioblocksPDB.createPDB(file);
        const couplingScores = pdbData.amendPDBWithCouplingScores(
          this.state[VIZ_TYPE.CONTACT_MAP].couplingScores.rankedContacts,
          measuredProximity,
        );
        this.setState({
          [VIZ_TYPE.CONTACT_MAP]: {
            couplingScores,
            isLoading: false,
            pdbData: { known: pdbData },
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

const mapStateToProps = (state: { [key: string]: any }) => ({
  clearAllResidues: () => {
    createResiduePairActions().candidates.clear();
    createResiduePairActions().hovered.clear();
    createResiduePairActions().locked.clear();
  },
  clearAllSecondaryStructures: () => {
    createContainerActions('secondaryStructure/hovered').clear();
    createContainerActions('secondaryStructure/selected').clear();
  },
});

const ExampleApp = connect(mapStateToProps)(ExampleAppClass);

ReactDOM.render(
  <Provider store={Store}>
    <ExampleApp />
  </Provider>,
  document.getElementById('example-root'),
);

if (module.hot) {
  module.hot.accept();
}
