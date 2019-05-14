import { Map, Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Checkbox, CheckboxProps, Form, Grid, Icon, Popup, Table } from 'semantic-ui-react';
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
        <Grid.Row centered={true} stretched={true}>
          <Popup on={'click'} position={'bottom center'} trigger={<Icon name={'tasks'} size={'large'} />} wide={true}>
            {this.renderPDBSelector()}
          </Popup>
        </Grid.Row>
        <Grid.Row>
          <NGLComponent
            experimentalProteins={experimentalProteins.filter(pdb => selectedExperimentalProteins.includes(pdb.name))}
            lockedResiduePairs={lockedResiduePairs.toJS() as ILockedResiduePair}
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
      <Table basic={'very'} style={{ maxWidth: '100%' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Select Structure to View</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.Cell>
              {`Experimental (${this.state.selectedExperimentalProteins.length}/${
                this.props.experimentalProteins.length
              })`}
            </Table.Cell>
            <Table.Cell>
              {`Predicted (${this.state.selectedPredictedProteins.length}/${this.props.predictedProteins.length})`}
            </Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell width={3}>
              {this.renderFormGroup(this.props.experimentalProteins, 'experimental', this.onExperimentalProteinSelect)}
            </Table.Cell>
            <Table.Cell width={1}>
              {this.renderFormGroup(this.props.predictedProteins, 'predicted', this.onPredictedProteinSelect)}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }

  protected renderFormGroup(
    data: BioblocksPDB[],
    pdbGroup: 'experimental' | 'predicted',
    onChange: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void,
  ) {
    const { maxPDBPerPopup } = this.props;
    const { selectedExperimentalProteins, selectedPredictedProteins } = this.state;

    return (
      <Form style={{ height: `${maxPDBPerPopup * 33}px`, overflow: 'auto' }}>
        {data.map((pdb, index) => {
          return (
            <Grid.Row key={`pdb-radio-${pdbGroup}-${index}`}>
              <Checkbox
                label={`${pdb.name}`}
                onChange={onChange}
                checked={(pdbGroup === 'experimental'
                  ? selectedExperimentalProteins
                  : selectedPredictedProteins
                ).includes(pdb.name)}
              />
              {pdbGroup === 'experimental' &&
                this.props.predictedProteins.length &&
                `\t${this.sequenceSimilarityPercent(pdb.sequence, this.props.predictedProteins[0].sequence)}%`}
            </Grid.Row>
          );
        })}
      </Form>
    );
  }

  protected sequenceSimilarityPercent(seqA: string, seqB: string, fractionDigits: number = 2) {
    return (
      (seqA.split('').reduce((prev, cur, seqIndex) => {
        return prev + (cur === seqB[seqIndex] ? 1 : 0);
      }, 0) /
        seqA.length) *
      100
    ).toFixed(fractionDigits);
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
