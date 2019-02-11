import { Map, Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { createResiduePairActions } from '~chell-viz~/action/ResiduePairAction';
import { NGLComponent } from '~chell-viz~/component';
import { ChellVisualization } from '~chell-viz~/container';
import { ChellPDB, CONTACT_DISTANCE_PROXIMITY, RESIDUE_TYPE, SECONDARY_STRUCTURE_SECTION } from '~chell-viz~/data';
import { EMPTY_FUNCTION } from '~chell-viz~/helper';
import {
  createContainerReducer,
  createDataReducer,
  createResiduePairReducer,
  ILockedResiduePair,
} from '~chell-viz~/reducer';
import { getCandidates, getHovered, getLocked, selectCurrentItems, selectCurrentValue } from '~chell-viz~/selector';

export interface INGLContainerProps {
  candidateResidues: RESIDUE_TYPE[];
  data: ChellPDB;
  hoveredResidues: RESIDUE_TYPE[];
  hoveredSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  isDataLoading: boolean;
  lockedResiduePairs: Map<string, Set<RESIDUE_TYPE>>;
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
  selectedSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  showConfigurations: boolean;
  addCandidateResidues(residues: RESIDUE_TYPE[]): void;
  addHoveredResidues(residues: RESIDUE_TYPE[]): void;
  addLockedResiduePair(residuePair: ILockedResiduePair): void;
  onMeasuredProximityChange?(value: number): void;
  onResize?(event?: UIEvent): void;
  removeAllLockedResiduePairs(): void;
  removeHoveredResidues(): void;
  removeNonLockedResidues(): void;
  removeLockedResiduePair(key: string): void;
  removeCandidateResidues(): void;
}

export class NGLContainerClass extends ChellVisualization<INGLContainerProps> {
  public static defaultProps = {
    data: ChellPDB.createEmptyPDB(),
    dispatchNglFetch: EMPTY_FUNCTION,
    isDataLoading: false,
    measuredProximity: CONTACT_DISTANCE_PROXIMITY.C_ALPHA,
    showConfigurations: true,
  };

  constructor(props: INGLContainerProps) {
    super(props);
  }

  public setupDataServices() {
    createContainerReducer<SECONDARY_STRUCTURE_SECTION>('secondaryStructure/hovered');
    createContainerReducer<SECONDARY_STRUCTURE_SECTION>('secondaryStructure/selected');
    createDataReducer<ChellPDB>('pdb');
    createResiduePairReducer();
  }

  public render() {
    const { lockedResiduePairs, ...rest } = this.props;

    return <NGLComponent lockedResiduePairs={lockedResiduePairs.toJS() as ILockedResiduePair} {...rest} />;
  }
}

const mapStateToProps = (state: { [key: string]: any }, ownProps: { data: ChellPDB }) => ({
  candidateResidues: getCandidates(state).toArray(),
  data: selectCurrentValue<ChellPDB>(state, 'pdb')
    ? (selectCurrentValue<ChellPDB>(state, 'pdb') as ChellPDB)
    : ownProps.data,
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
