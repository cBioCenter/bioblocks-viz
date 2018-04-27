import { RESIDUE_TYPE } from 'chell';
import * as React from 'react';

export interface IResidueSelection {
  [key: string]: RESIDUE_TYPE[];
}

export const initialResidueContext = {
  addCandidateResidue: (residue: RESIDUE_TYPE) => {
    return;
  },
  addLockedResiduePair: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  candidateResidue: 'none' as RESIDUE_TYPE | 'none',
  lockedResiduePairs: {} as IResidueSelection,
  removeAllLockedResiduePairs: () => {
    return;
  },
  removeCandidateResidue: () => {
    return;
  },
  removeLockedResiduePair: (residues: RESIDUE_TYPE[]) => {
    return;
  },
};

export const ResidueContext = React.createContext({
  ...initialResidueContext,
});
