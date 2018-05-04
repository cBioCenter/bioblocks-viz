import * as React from 'react';

import { CELL_TYPE, RESIDUE_TYPE } from '../../types/chell';
import CellContext, { initialCellContext } from '../context/CellContext';
import ResidueContext, { initialResidueContext } from '../context/ResidueContext';

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
        addLockedResiduePair: this.onResidueSelect,
        removeAllLockedResiduePairs: this.onRemoveAllResidues,
        removeCandidateResidues: this.onRemoveCandidateResidue,
        removeHoveredResidues: this.onRemoveHoveredResidue,
        removeLockedResiduePair: this.onRemoveResidues,
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
