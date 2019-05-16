import { Map, Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Checkbox, CheckboxProps, Grid, Header, Icon, Table } from 'semantic-ui-react';
import { createResiduePairActions } from '~bioblocks-viz~/action/ResiduePairAction';
import { NGLComponent } from '~bioblocks-viz~/component';
import { BioblocksVisualization } from '~bioblocks-viz~/container';
import {
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
                    on: 'click',
                    style: { opacity: 0.85 },
                    trigger: <Icon name={'tasks'} />,
                    wide: 'very',
                  },
                },
                description: 'PDB Selector',
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
    const label = (data.label as string).split(' ')[0];
    this.setState({
      selectedExperimentalProteins: data.checked
        ? [...this.state.selectedExperimentalProteins, label]
        : this.state.selectedExperimentalProteins.filter(pdb => pdb !== label),
    });
  };

  protected onPredictedProteinSelect = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    const label = (data.label as string).split(' ')[0];
    this.setState({
      selectedPredictedProteins: data.checked
        ? [...this.state.selectedPredictedProteins, label]
        : this.state.selectedPredictedProteins.filter(pdb => pdb !== label),
    });
  };

  protected renderPDBSelector() {
    return (
      <Grid divided={true} padded={true}>
        <Grid.Row>
          <Grid.Column>
            <Header>Select Structure to View</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ padding: '5px 0' }}>
          <Grid.Column width={9}>
            {`Experimental (${this.state.selectedExperimentalProteins.length}/${
              this.props.experimentalProteins.length
            })`}
            {this.renderPDBTable(this.props.experimentalProteins, 'experimental', this.onExperimentalProteinSelect)}
          </Grid.Column>
          <Grid.Column width={6}>
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
    const { selectedExperimentalProteins, selectedPredictedProteins } = this.state;

    return (
      <div style={{ height: `${maxPDBPerPopup * 50}px`, overflow: 'auto' }}>
        <Table basic={'very'} compact={true} padded={true}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ padding: '5px 0' }}>Name</Table.HeaderCell>
              {pdbGroup === 'experimental' && <Table.HeaderCell style={{ padding: '0' }}>Percent</Table.HeaderCell>}
              {pdbGroup === 'experimental' && <Table.HeaderCell style={{ padding: '0' }}>Source</Table.HeaderCell>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((pdb, index) => {
              return (
                <Table.Row columns={pdbGroup === 'experimental' ? 3 : 1} key={`pdb-radio-${pdbGroup}-${index}`}>
                  <Table.Cell>
                    <Checkbox
                      label={`${pdb.name}`}
                      onChange={onChange}
                      checked={(pdbGroup === 'experimental'
                        ? selectedExperimentalProteins
                        : selectedPredictedProteins
                      ).includes(pdb.name)}
                    />
                  </Table.Cell>

                  {pdbGroup === 'experimental' && (
                    <Table.Cell>
                      {this.props.predictedProteins.length >= 1
                        ? `${this.sequenceSimilarityPercent(pdb.sequence, this.props.predictedProteins[0].sequence)}`
                        : 'N/A'}
                    </Table.Cell>
                  )}
                  {pdbGroup === 'experimental' && <Table.Cell>{pdb.source}</Table.Cell>}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }

  protected sequenceSimilarityPercent(seqA: string, seqB: string, fractionDigits: number = 2) {
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