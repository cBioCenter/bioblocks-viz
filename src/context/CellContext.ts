import * as React from 'react';

import { CELL_TYPE } from '../data/chell-data';

export interface ICellContext {
  addCells: (cells: CELL_TYPE[]) => void;
  currentCells: CELL_TYPE[];
  removeAllCells: (cells: CELL_TYPE[]) => void;
  removeCells: (cells: CELL_TYPE[]) => void;
}

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
} as ICellContext;

const CellContext = React.createContext({
  ...initialCellContext,
});

export default CellContext;
export { CellContext };
