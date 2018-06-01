import * as React from 'react';

import CellContext, { initialCellContext } from '../context/CellContext';
import ResidueContext, { initialResidueContext, IResidueSelection } from '../context/ResidueContext';
import { CELL_TYPE, RESIDUE_TYPE } from '../data/chell-data';

export const initialState = {
  cellContext: {
    ...initialCellContext,
  },
  residueContext: {
    ...initialResidueContext,
  },
};

export type ChellContextState = Readonly<typeof initialState>;

export default class ChellContext extends React.Component<any, ChellContextState> {
  public readonly state: ChellContextState = initialState;

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
        addCandidateResidues: this.onAddCandidateResidues,
        addHoveredResidues: this.onAddHoveredResidues,
        addLockedResiduePair: this.onAddLockedResiduePair,
        clearAllResidues: this.onClearAllResidues,
        removeAllLockedResiduePairs: this.onRemoveAllLockedResiduePairs,
        removeCandidateResidues: this.onRemoveCandidateResidue,
        removeHoveredResidues: this.onRemoveHoveredResidue,
        removeLockedResiduePair: this.onRemoveLockedResiduePair,
        toggleLockedResiduePair: this.onToggleLockedResiduePair,
      },
    };
  }

  public render() {
    return (
      <CellContext.Provider value={this.state.cellContext}>
        <ResidueContext.Provider value={this.state.residueContext}>{this.props.children}</ResidueContext.Provider>
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

  public onAddCandidateResidues = (candidateResidues: RESIDUE_TYPE[]) => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidues: candidateResidues.sort(),
      },
    });
  };

  public onAddHoveredResidues = (hoveredResidues: RESIDUE_TYPE[]) => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        hoveredResidues: hoveredResidues.sort(),
      },
    });
  };

  public onAddLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
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

  public onClearAllResidues = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidues: [],
        hoveredResidues: [],
        lockedResiduePairs: {} as IResidueSelection,
      },
    });
  };

  public onRemoveAllLockedResiduePairs = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        lockedResiduePairs: {} as IResidueSelection,
      },
    });
  };

  public onRemoveCandidateResidue = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        candidateResidues: [],
      },
    });
  };

  public onRemoveHoveredResidue = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        hoveredResidues: [],
      },
    });
  };

  public onRemoveLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
    const residuePairKey = residues.join(',');
    const { lockedResiduePairs } = this.state.residueContext;
    if (lockedResiduePairs[residuePairKey]) {
      delete lockedResiduePairs[residuePairKey];
    }
  };

  public onToggleLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
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
    } else {
      delete lockedResiduePairs[residuePairKey];
    }
  };
}

export { ChellContext };
