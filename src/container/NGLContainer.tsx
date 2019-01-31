import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchDataset } from '~chell-viz~/action';
import { createResiduePairActions } from '~chell-viz~/action/ResiduePairAction';
import { NGLComponent } from '~chell-viz~/component';
import { ChellVisualization } from '~chell-viz~/container';
import {
  initialSecondaryStructureContext,
  ISecondaryStructureContext,
  SecondaryStructureContextConsumer,
} from '~chell-viz~/context';
import { ChellPDB, CONTACT_DISTANCE_PROXIMITY, RESIDUE_TYPE } from '~chell-viz~/data';
import { EMPTY_FUNCTION, fetchNGLDataFromFile } from '~chell-viz~/helper';
import { createDataReducer, createResiduePairReducer, ILockedResiduePair } from '~chell-viz~/reducer';
import { getCandidates, getHovered, getLocked, selectCurrentValue } from '~chell-viz~/selector';

export interface INGLContainerProps {
  candidateResidues: RESIDUE_TYPE[];
  data: ChellPDB;
  hoveredResidues: RESIDUE_TYPE[];
  isDataLoading: boolean;
  lockedResiduePairs: ILockedResiduePair;
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
  secondaryStructureContext: ISecondaryStructureContext;
  showConfigurations: boolean;
  addCandidateResidues(residues: RESIDUE_TYPE[]): void;
  addHoveredResidues(residues: RESIDUE_TYPE[]): void;
  addLockedResiduePair(residuePair: ILockedResiduePair): void;
  dispatchPdbFetch(dataset: string, fetchFn: () => Promise<ChellPDB>): void;
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
    secondaryStructureContext: {
      ...initialSecondaryStructureContext,
    },
    showConfigurations: true,
  };

  constructor(props: INGLContainerProps) {
    super(props);
  }

  public setupDataServices() {
    const { dispatchPdbFetch } = this.props;
    createDataReducer<ChellPDB>('pdb');
    createResiduePairReducer();
    dispatchPdbFetch('pdb', async () =>
      ChellPDB.createPDBFromNGLData(await fetchNGLDataFromFile('assets/1g68/1g68.pdb')),
    );
  }

  public render() {
    return <NGLComponent {...this.props} />;
  }
}

type requiredProps = Omit<INGLContainerProps, keyof typeof NGLContainerClass.defaultProps> &
  Partial<INGLContainerProps>;

const mapStateToProps = (state: { [key: string]: any }) => ({
  candidateResidues: getCandidates(state).toArray(),
  data: selectCurrentValue<ChellPDB>(state, 'pdb', ChellPDB.createEmptyPDB()) as ChellPDB,
  hoveredResidues: getHovered(state).toArray(),
  lockedResiduePairs: getLocked(state).toJS(),
  removeNonLockedResidues: () => {
    const { candidates, hovered } = createResiduePairActions();
    candidates.clear();
    hovered.clear();
  },
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addCandidateResidues: createResiduePairActions().candidates.addMultiple,
      addHoveredResidues: createResiduePairActions().hovered.set,
      addLockedResiduePair: createResiduePairActions().locked.add,
      dispatchPdbFetch: fetchDataset,
      removeAllLockedResiduePairs: createResiduePairActions().locked.clear,
      removeCandidateResidues: createResiduePairActions().candidates.clear,
      removeHoveredResidues: createResiduePairActions().hovered.clear,
      removeLockedResiduePair: createResiduePairActions().locked.remove,
    },
    dispatch,
  );

const NGLContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)((props: requiredProps) => (
  <SecondaryStructureContextConsumer>
    {secondaryStructureContext => (
      <NGLContainerClass secondaryStructureContext={secondaryStructureContext} {...props} />
    )}
  </SecondaryStructureContextConsumer>
));

export { NGLContainer };
