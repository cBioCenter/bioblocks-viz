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
        removeAllCells: this.onRemoveAllCells,
        removeCells: this.onRemoveCells,
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

  public onAddCells = (cells: CELL_TYPE[]) => {
    this.setState({
      cellContext: {
        ...this.state.cellContext,
        currentCells: cells,
      },
    });
  };

  public onRemoveAllCells = () => {
    this.setState({
      cellContext: {
        ...this.state.cellContext,
        currentCells: [],
      },
    });
  };

  public onRemoveCells = (cellsToRemove: CELL_TYPE[]) => {
    const { currentCells } = this.state.cellContext;
    this.setState({
      cellContext: {
        ...this.state.cellContext,
        currentCells: currentCells.filter(cell => cellsToRemove.indexOf(cell) === -1),
      },
    });
  };

  public onCandidateResidueSelect = (candidateResidue: RESIDUE_TYPE) => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidue,
      },
    });
  };

  public onRemoveAllResidues = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        lockedResiduePairs: {},
      },
    });
  };

  public onRemoveCandidateResidue = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidue: 'none',
      },
    });
  };

  public onRemoveResidues = (residues: RESIDUE_TYPE[]) => {
    const residueKey = residues.join(',');
    const { lockedResiduePairs } = this.state.residueContext;
    if (lockedResiduePairs[residueKey]) {
      delete lockedResiduePairs[residueKey];
    }
  };

  public onResidueSelect = (residues: RESIDUE_TYPE[]) => {
    const { lockedResiduePairs } = this.state.residueContext;
    const sortedResidues = residues.sort();
    const residuePairKey = sortedResidues.toString();
    if (!lockedResiduePairs[residuePairKey]) {
      this.setState({
        residueContext: {
          ...this.state.residueContext,
          lockedResiduePairs: {
            ...lockedResiduePairs,
            [residuePairKey]: sortedResidues,
          },
        },
      });
    }
  };
}
