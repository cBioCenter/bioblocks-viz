import * as React from 'react';
import { RESIDUE_TYPE } from '../data/chell-data';

export type ResidueSelection = Map<string, RESIDUE_TYPE[]>;

export interface IResidueContext {
  addCandidateResidues: (residues: RESIDUE_TYPE[]) => void;
  addHoveredResidues: (residues: RESIDUE_TYPE[]) => void;
  addLockedResiduePair: (residues: RESIDUE_TYPE[]) => void;
  candidateResidues: RESIDUE_TYPE[];
  clearAllResidues: () => void;
  hoveredResidues: RESIDUE_TYPE[];
  lockedResiduePairs: ResidueSelection;
  removeAllLockedResiduePairs: () => void;
  removeCandidateResidues: () => void;
  removeHoveredResidues: () => void;
  removeLockedResiduePair: (residues: RESIDUE_TYPE[]) => void;
  removeNonLockedResidues: () => void;
  toggleLockedResiduePair: (residues: RESIDUE_TYPE[]) => void;
}

export const initialResidueContext = {
  addCandidateResidues: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  addHoveredResidues: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  addLockedResiduePair: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  candidateResidues: [] as number[],
  clearAllResidues: () => {
    return;
  },
  hoveredResidues: [] as number[],
  lockedResiduePairs: new Map(),
  removeAllLockedResiduePairs: () => {
    return;
  },
  removeCandidateResidues: () => {
    return;
  },
  removeHoveredResidues: () => {
    return;
  },
  removeLockedResiduePair: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  removeNonLockedResidues: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  toggleLockedResiduePair: (residues: RESIDUE_TYPE[]) => {
    return;
  },
} as IResidueContext;

const ResidueContext = React.createContext({
  ...initialResidueContext,
});

export default ResidueContext;
export { ResidueContext };
