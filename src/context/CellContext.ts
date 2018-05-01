import { CELL_TYPE } from 'chell';
import * as React from 'react';

export const initialCellContext = {
  addCells: (cells: CELL_TYPE[]) => {
    return;
  },
  currentCells: [] as CELL_TYPE[],
  removeAllCells: (cells: CELL_TYPE[]) => {
    return;
  },
  removeCells: (cells: CELL_TYPE[]) => {
    return;
  },
};

export const CellContext = React.createContext({
  ...initialCellContext,
});
