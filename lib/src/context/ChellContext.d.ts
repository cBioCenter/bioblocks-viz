/// <reference types="react" />
import * as React from 'react';
import * as ResContext from '../context/ResidueContext';
export declare const initialState: {
  cellContext: {
    addCells: (cells: number[]) => void;
    currentCells: number[];
    removeAllCells: (cells: number[]) => void;
    removeCells: (cells: number[]) => void;
  };
  residueContext: {
    addCandidateResidues: (residues: number[]) => void;
    addHoveredResidues: (residues: number[]) => void;
    addLockedResiduePair: (residues: number[]) => void;
    candidateResidues: number[];
    hoveredResidues: number[];
    lockedResiduePairs: ResContext.IResidueSelection;
    removeAllLockedResiduePairs: () => void;
    removeCandidateResidues: () => void;
    removeHoveredResidues: () => void;
    removeLockedResiduePair: (residues: number[]) => void;
  };
};
export declare type ChellContextState = Readonly<typeof initialState>;
export declare class ChellContext extends React.Component<any, ChellContextState> {
  public readonly state: ChellContextState;
  constructor(props: any);
  public render(): JSX.Element;
  public onAddCells: (cells: number[]) => void;
  public onRemoveAllCells: () => void;
  public onRemoveCells: (cellsToRemove: number[]) => void;
  public onAddCandidateResidues: (candidateResidues: number[]) => void;
  public onAddHoveredResidues: (hoveredResidues: number[]) => void;
  public onRemoveAllResidues: () => void;
  public onRemoveCandidateResidue: () => void;
  public onRemoveHoveredResidue: () => void;
  public onRemoveResidues: (residues: number[]) => void;
  public onResidueSelect: (residues: number[]) => void;
}
