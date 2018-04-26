import { RESIDUE_TYPE } from 'chell';
import * as React from 'react';

export interface IResidueSelection {
  [key: string]: RESIDUE_TYPE[];
}

export const initialResidueContext = {
  addNewResidues: (residues: RESIDUE_TYPE[]) => {
    return;
  },
  currentResidueSelections: {} as IResidueSelection,
  removeAllResidues: () => {
    return;
  },
  removeResidues: (residues: RESIDUE_TYPE[]) => {
    return;
  },
};

export const ResidueContext = React.createContext({
  ...initialResidueContext,
});
