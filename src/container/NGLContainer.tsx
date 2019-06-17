import { Map, Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Checkbox, CheckboxProps, Grid, Header, Popup, Table } from 'semantic-ui-react';
import { createContainerActions } from '~bioblocks-viz~/action';
import { createResiduePairActions } from '~bioblocks-viz~/action/ResiduePairAction';
import { NGLComponent } from '~bioblocks-viz~/component';
import { BioblocksVisualization } from '~bioblocks-viz~/container';
import {
  BIOBLOCKS_CSS_STYLE,
  BioblocksPDB,
  CONTACT_DISTANCE_PROXIMITY,
  RESIDUE_TYPE,
  SECONDARY_STRUCTURE_SECTION,
} from '~bioblocks-viz~/data';
import { EMPTY_FUNCTION } from '~bioblocks-viz~/helper';
import { createContainerReducer, createResiduePairReducer, ILockedResiduePair } from '~bioblocks-viz~/reducer';
import { getCandidates, getHovered, getLocked, selectCurrentItems } from '~bioblocks-viz~/selector';

export interface INGLContainerProps {
  candidateResidues?: RESIDUE_TYPE[];
  experimentalProteins: BioblocksPDB[];
  hoveredResidues?: RESIDUE_TYPE[];
  hoveredSecondaryStructures?: SECONDARY_STRUCTURE_SECTION[];
  isDataLoading: boolean;
  lockedResiduePairs: Map<string, Set<RESIDUE_TYPE>>;
  maxPDBPerPopup: number;
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
  predictedProteins: BioblocksPDB[];
  selectedSecondaryStructures?: SECONDARY_STRUCTURE_SECTION[];
  showConfigurations: boolean;
  addCandidateResidues?(residues: RESIDUE_TYPE[]): void;
  addHoveredResidues?(residues: RESIDUE_TYPE[]): void;
  addLockedResiduePair?(residuePair: ILockedResiduePair): void;
  onMeasuredProximityChange?(value: number): void;
  onResize?(event?: UIEvent): void;
  removeAllLockedResiduePairs?(): void;
  removeHoveredResidues?(): void;
  removeNonLockedResidues?(): void;
  removeLockedResiduePair?(key: string): void;
  removeCandidateResidues?(): void;
}

export interface INGLContainerState {
  selectedExperimentalProteins: string[];
  selectedPredictedProteins: string[];
}

export class NGLContainerClass extends BioblocksVisualization<INGLContainerProps, INGLContainerState> {
  public static defaultProps = {
    dispatchNglFetch: EMPTY_FUNCTION,
    experimentalProteins: [],
    isDataLoading: false,
    lockedResiduePairs: Map<string, Set<RESIDUE_TYPE>>(),
    maxPDBPerPopup: 5,
    measuredProximity: CONTACT_DISTANCE_PROXIMITY.C_ALPHA,
    predictedProteins: [],
    showConfigurations: true,
  };

  constructor(props: INGLContainerProps) {
    super(props);
    this.state = {
      selectedExperimentalProteins: [],
      selectedPredictedProteins: [],
    };
  }

  public componentDidMount() {
    const { experimentalProteins, predictedProteins } = this.props;
    const selectedExperimentalProteins = experimentalProteins.length >= 1 ? [experimentalProteins[0].name] : [];
    const selectedPredictedProteins = predictedProteins.length >= 1 ? [predictedProteins[0].name] : [];
    this.setState({
      selectedExperimentalProteins,
      selectedPredictedProteins,
    });
  }

  public componentDidUpdate(prevProps: INGLContainerProps) {
    const { experimentalProteins, predictedProteins } = this.props;
    let { selectedExperimentalProteins, selectedPredictedProteins } = this.state;
    let isNewData = false;

    if (this.isBioblocksPDBArrayEqual(experimentalProteins, prevProps.experimentalProteins)) {
      isNewData = true;
      selectedExperimentalProteins = experimentalProteins.length === 0 ? [] : [experimentalProteins[0].name];
    }

    if (this.isBioblocksPDBArrayEqual(predictedProteins, prevProps.predictedProteins)) {
      isNewData = true;
      selectedPredictedProteins = predictedProteins.length === 0 ? [] : [predictedProteins[0].name];
    }
    if (isNewData) {
      this.setState({
        selectedExperimentalProteins,
        selectedPredictedProteins,
      });
    }
  }

  public setupDataServices() {
    createContainerReducer<SECONDARY_STRUCTURE_SECTION>('secondaryStructure/hovered');
    createContainerReducer<SECONDARY_STRUCTURE_SECTION>('secondaryStructure/selected');
    createContainerReducer<BioblocksPDB[]>('pdb');
    createResiduePairReducer();
  }

  public render() {
    const { experimentalProteins, lockedResiduePairs, predictedProteins, ...rest } = this.props;
    const { selectedExperimentalProteins, selectedPredictedProteins } = this.state;

    return (
      <Grid padded={true}>
        <Grid.Row>
          <NGLComponent
            experimentalProteins={experimentalProteins.filter(pdb => selectedExperimentalProteins.includes(pdb.name))}
            lockedResiduePairs={lockedResiduePairs.toJS() as ILockedResiduePair}
            menuItems={[
              {
                component: {
                  name: 'POPUP',
                  props: {
                    children: this.renderPDBSelector(),
                    disabled: experimentalProteins.length === 0 && predictedProteins.length === 0,
                    wide: 'very',
                  },
                },
                description: 'PDB Selector',
                iconName: 'tasks',
              },
            ]}
            predictedProteins={predictedProteins.filter(pdb => selectedPredictedProteins.includes(pdb.name))}
            {...rest}
          />
        </Grid.Row>
      </Grid>
    );
  }

  protected isBioblocksPDBArrayEqual(a: BioblocksPDB[], b: BioblocksPDB[]) {
    return (
      a.length !== b.length || a.reduce((prev, cur, index) => prev || cur.name !== b[index].name, false as boolean)
    );
  }

  protected onExperimentalProteinSelect = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    const fullName = (data.value as string).split(' ')[0];
    this.setState({
      selectedExperimentalProteins: data.checked
        ? [...this.state.selectedExperimentalProteins, fullName]
        : this.state.selectedExperimentalProteins.filter(pdb => pdb !== fullName),
    });
  };

  protected onPredictedProteinSelect = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    const fullName = (data.value as string).split(' ')[0];
    this.setState({
      selectedPredictedProteins: data.checked
        ? [...this.state.selectedPredictedProteins, fullName]
        : this.state.selectedPredictedProteins.filter(pdb => pdb !== fullName),
    });
  };

  protected renderPDBSelector() {
    return (
      <Grid divided={true} padded={true}>
        <Grid.Row>
          <Grid.Column>
            <Header>Select Structures to Display</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} style={{ padding: '5px 0' }}>
          <Grid.Column width={9}>
            {`Experimental (${this.state.selectedExperimentalProteins.length}/${this.props.experimentalProteins.length})`}
            {this.renderPDBTable(this.props.experimentalProteins, 'experimental', this.onExperimentalProteinSelect)}
          </Grid.Column>
          <Grid.Column width={7}>
            {`Predicted (${this.state.selectedPredictedProteins.length}/${this.props.predictedProteins.length})`}
            {this.renderPDBTable(this.props.predictedProteins, 'predicted', this.onPredictedProteinSelect)}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  protected renderPDBTable(
    data: BioblocksPDB[],
    pdbGroup: 'experimental' | 'predicted',
    onChange: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void,
  ) {
    const { maxPDBPerPopup } = this.props;
    const cellStyle = { padding: '5px 0' };

    return (
      <div style={{ height: `${maxPDBPerPopup * 50}px`, overflow: 'auto' }}>
        <Table basic={'very'} compact={true} padded={true}>
          {this.renderPDBTableHeader(pdbGroup, cellStyle)}
          {this.renderPDBTableBody(data, pdbGroup, cellStyle, onChange)}
        </Table>
      </div>
    );
  }

  protected renderPDBTableBody = (
    data: BioblocksPDB[],
    pdbGroup: string,
    cellStyle: BIOBLOCKS_CSS_STYLE,
    onChange: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void,
  ) => {
    return <Table.Body>{this.renderPDBTableBodyRows(data, pdbGroup, cellStyle, onChange)}</Table.Body>;
  };

  protected renderPDBTableBodyRows = (
    data: BioblocksPDB[],
    pdbGroup: string,
    cellStyle: BIOBLOCKS_CSS_STYLE,
    onChange: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void,
  ) => {
    const { selectedExperimentalProteins, selectedPredictedProteins } = this.state;

    return data.map((pdb, index) => (
      <Table.Row key={`pdb-radio-${pdbGroup}-${index}`}>
        <Table.Cell style={cellStyle}>
          <Popup
            position={'top left'}
            trigger={
              <Checkbox
                checked={(pdbGroup === 'experimental'
                  ? selectedExperimentalProteins
                  : selectedPredictedProteins
                ).includes(pdb.name)}
                onChange={onChange}
                value={pdb.name}
                label={pdb.name
                  .split('_')
                  .reverse()
                  .slice(0, 4)
                  .reverse()
                  .join('_')}
              />
            }
          >
            {pdb.name}
          </Popup>
        </Table.Cell>

        {this.renderPDBTableSequenceCell(pdbGroup, cellStyle, pdb)}
        {this.renderPDBTableSourceCell(pdbGroup, cellStyle, pdb)}
        {this.renderPDBTableRankCell(pdbGroup, cellStyle, pdb)}
      </Table.Row>
    ));
  };

  protected renderPDBTableHeader = (pdbGroup: string, cellStyle: BIOBLOCKS_CSS_STYLE) => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell style={cellStyle}>Name</Table.HeaderCell>
          {this.renderPDBTableSequenceHeader(pdbGroup, cellStyle)}
          {this.renderPDBTableSourceHeader(pdbGroup, cellStyle)}
          {this.renderPDBTableRankHeader(pdbGroup, cellStyle)}
        </Table.Row>
      </Table.Header>
    );
  };

  protected renderPDBTableRankCell = (pdbGroup: string, cellStyle: BIOBLOCKS_CSS_STYLE, pdb: BioblocksPDB) => {
    return pdbGroup === 'predicted' && <Table.Cell style={cellStyle}>{pdb.rank}</Table.Cell>;
  };

  protected renderPDBTableRankHeader = (pdbGroup: string, cellStyle: BIOBLOCKS_CSS_STYLE) => {
    return pdbGroup === 'predicted' && <Table.HeaderCell style={cellStyle}>Rank</Table.HeaderCell>;
  };

  protected renderPDBTableSequenceCell = (pdbGroup: string, cellStyle: BIOBLOCKS_CSS_STYLE, pdb: BioblocksPDB) => {
    return (
      pdbGroup === 'experimental' && (
        <Table.Cell style={cellStyle}>
          {this.props.predictedProteins.length >= 1
            ? `${this.sequenceSimilarityPercent(pdb.sequence, this.props.predictedProteins[0].sequence)}`
            : 'N/A'}
        </Table.Cell>
      )
    );
  };

  protected renderPDBTableSequenceHeader = (pdbGroup: string, cellStyle: BIOBLOCKS_CSS_STYLE) => {
    return pdbGroup === 'experimental' && <Table.HeaderCell style={cellStyle}>Seq. ID</Table.HeaderCell>;
  };

  protected renderPDBTableSourceCell = (pdbGroup: string, cellStyle: BIOBLOCKS_CSS_STYLE, pdb: BioblocksPDB) => {
    return pdbGroup === 'experimental' && <Table.Cell style={cellStyle}>{pdb.source}</Table.Cell>;
  };

  protected renderPDBTableSourceHeader = (pdbGroup: string, cellStyle: BIOBLOCKS_CSS_STYLE) => {
    return pdbGroup === 'experimental' && <Table.HeaderCell style={cellStyle}>Source</Table.HeaderCell>;
  };

  protected sequenceSimilarityPercent(seqA: string, seqB: string, fractionDigits: number = 1) {
    const result =
      (seqA.split('').reduce((prev, cur, seqIndex) => {
        return prev + (cur === seqB[seqIndex] ? 1 : 0);
      }, 0) /
        seqA.length) *
      100;

    return isNaN(result) ? 'N/A' : `${result.toFixed(fractionDigits)}%`;
  }
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  candidateResidues: getCandidates(state).toArray(),
  hoveredResidues: getHovered(state).toArray(),
  hoveredSecondaryStructures: selectCurrentItems<SECONDARY_STRUCTURE_SECTION>(
    state,
    'secondaryStructure/hovered',
  ).toArray(),
  lockedResiduePairs: getLocked(state),
  removeNonLockedResidues: () => {
    const { candidates, hovered } = createResiduePairActions();
    candidates.clear();
    hovered.clear();
  },
  selectedSecondaryStructures: selectCurrentItems<SECONDARY_STRUCTURE_SECTION>(
    state,
    'secondaryStructure/selected',
  ).toArray(),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addCandidateResidues: createResiduePairActions().candidates.addMultiple,
      addHoveredResidues: createResiduePairActions().hovered.set,
      addLockedResiduePair: createResiduePairActions().locked.add,
      removeAllLockedResiduePairs: createResiduePairActions().locked.clear,
      removeAllSelectedSecondaryStructures: createContainerActions('secondaryStructure/selected').clear,
      removeCandidateResidues: createResiduePairActions().candidates.clear,
      removeHoveredResidues: createResiduePairActions().hovered.clear,
      removeLockedResiduePair: createResiduePairActions().locked.remove,
    },
    dispatch,
  );

export const NGLContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NGLContainerClass);
