import * as React from 'react';

import CellContext, { initialCellContext } from '../context/CellContext';
import ResidueContext, { initialResidueContext } from '../context/ResidueContext';
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
    if (!lockedResiduePairs.has(residuePairKey)) {
      const result = new Map(lockedResiduePairs);
      result.set(residuePairKey, sortedResidues);
      this.setState({
        residueContext: {
          ...this.state.residueContext,
          lockedResiduePairs: result,
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
        lockedResiduePairs: new Map(),
      },
    });
  };

  public onRemoveAllLockedResiduePairs = () => {
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        lockedResiduePairs: new Map(),
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
    const residuePairKey = residues.sort().join(',');
    const { lockedResiduePairs } = this.state.residueContext;
    if (lockedResiduePairs.has(residuePairKey)) {
      const result = new Map(lockedResiduePairs);
      result.delete(residuePairKey);
      this.setState({
        residueContext: {
          ...this.state.residueContext,
          lockedResiduePairs: result,
        },
      });
    }
  };

  public onToggleLockedResiduePair = (residues: RESIDUE_TYPE[]) => {
    const { lockedResiduePairs } = this.state.residueContext;
    const sortedResidues = residues.sort();
    const residuePairKey = sortedResidues.toString();
    const result = new Map(lockedResiduePairs);
    if (!lockedResiduePairs.has(residuePairKey)) {
      result.set(residuePairKey, sortedResidues);
    } else {
      result.delete(residuePairKey);
    }
    this.setState({
      residueContext: {
        ...this.state.residueContext,
        lockedResiduePairs: result,
      },
    });
  };
}

export { ChellContext };
