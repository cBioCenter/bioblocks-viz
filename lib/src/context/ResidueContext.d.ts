/// <reference types="react" />
import { RESIDUE_TYPE } from 'chell';
import * as React from 'react';
export interface IResidueSelection {
  [key: string]: RESIDUE_TYPE[];
}
export interface IResidueContext {
  addCandidateResidues: (residues: RESIDUE_TYPE[]) => void;
  addHoveredResidues: (residues: RESIDUE_TYPE[]) => void;
  addLockedResiduePair: (residues: RESIDUE_TYPE[]) => void;
  candidateResidues: RESIDUE_TYPE[];
  hoveredResidues: RESIDUE_TYPE[];
  lockedResiduePairs: IResidueSelection;
  removeAllLockedResiduePairs: () => void;
  removeCandidateResidues: () => void;
  removeHoveredResidues: () => void;
  removeLockedResiduePair: (residues: RESIDUE_TYPE[]) => void;
}
export declare const initialResidueContext: IResidueContext;
export declare const ResidueContext: React.Context<{
  addCandidateResidues: (residues: number[]) => void;
  addHoveredResidues: (residues: number[]) => void;
  addLockedResiduePair: (residues: number[]) => void;
  candidateResidues: number[];
  hoveredResidues: number[];
  lockedResiduePairs: IResidueSelection;
  removeAllLockedResiduePairs: () => void;
  removeCandidateResidues: () => void;
  removeHoveredResidues: () => void;
  removeLockedResiduePair: (residues: number[]) => void;
}>;
