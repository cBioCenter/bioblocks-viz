import { IResiduePair } from 'chell';
import * as React from 'react';

export const ResidueContext = React.createContext({
  currentResiduePair: { i: 0, j: 0 } as IResiduePair,
  selectNewResiduePair: (residuePair: IResiduePair) => {
    return;
  },
});
