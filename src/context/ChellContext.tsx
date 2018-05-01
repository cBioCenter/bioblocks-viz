import * as React from 'react';

import { CELL_TYPE, RESIDUE_TYPE } from 'chell';
import { CellContext, initialCellContext } from '../context/CellContext';
import { initialResidueContext, ResidueContext } from '../context/ResidueContext';

const initialState = {
  cellContext: {
    ...initialCellContext,
  },
  residueContext: {
    ...initialResidueContext,
  },
};

type State = Readonly<typeof initialState>;

export class ChellContext extends React.Component<any, State> {
  public readonly state: State = initialState;

  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      cellContext: {
        ...this.state.cellContext,
        addCells: this.onAddCells,
      },
      residueContext: {
        ...this.state.residueContext,
        addCandidateResidue: this.onCandidateResidueSelect,
        addLockedResiduePair: this.onResidueSelect,
        removeAllLockedResiduePairs: this.onRemoveAllResidues,
        removeCandidateResidue: this.onRemoveCandidateResidue,
        removeLockedResiduePair: this.onRemoveResidues,
      },
    };
  }

  public render() {
    return (
      <CellContext.Provider value={this.state.cellContext}>
        <ResidueContext.Provider value={this.state.residueContext}>{this.props.children}</ResidueContext.Provider>;
      </CellContext.Provider>
    );
  }

  protected onAddCells = (cells: CELL_TYPE[]) => {
    this.setState({
      cellContext: {
        ...this.state.cellContext,
        currentCells: cells,
      },
    });
  };

  protected onCandidateResidueSelect = (candidateResidue: RESIDUE_TYPE) => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidue,
      },
    });
  };

  protected onRemoveAllResidues = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        lockedResiduePairs: {},
      },
    });
  };

  protected onRemoveCandidateResidue = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidue: 'none',
      },
    });
  };

  protected onRemoveResidues = (residues: RESIDUE_TYPE[]) => {
    const residueKey = residues.join(',');
    const { lockedResiduePairs } = this.state.residueContext;
    if (lockedResiduePairs[residueKey]) {
      delete lockedResiduePairs[residueKey];
    }
  };

  protected onResidueSelect = (residues: RESIDUE_TYPE[]) => {
    const { lockedResiduePairs } = this.state.residueContext;
    const residuePairKey = residues.toString();
    if (!lockedResiduePairs[residuePairKey]) {
      this.setState({
        residueContext: {
          ...this.state.residueContext,
          lockedResiduePairs: {
            ...lockedResiduePairs,
            [residuePairKey]: residues,
          },
        },
      });
    }
  };
}
