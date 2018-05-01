import { RESIDUE_TYPE } from 'chell';
import * as React from 'react';

export interface IResidueSelection {
  [key: string]: RESIDUE_TYPE[];
}

export interface IResidueContext {
  addCandidateResidue: (residue: RESIDUE_TYPE) => void;
  addLockedResiduePair: (residues: RESIDUE_TYPE[]) => void;
  candidateResidue: RESIDUE_TYPE | 'none';
  lockedResiduePairs: IResidueSelection;
  removeAllLockedResiduePairs: () => void;
  removeCandidateResidue: () => void;
  removeLockedResiduePair: (residues: RESIDUE_TYPE[]) => void;
}

export const initialResidueContext = {
  candidateResidue: 'none' as RESIDUE_TYPE | 'none',
  lockedResiduePairs: {} as IResidueSelection,
} as IResidueContext;

export const ResidueContext = React.createContext({
  ...initialResidueContext,
});
