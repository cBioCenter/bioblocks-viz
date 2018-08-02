import * as React from 'react';

import { CELL_TYPE } from '../data/chell-data';

export interface ICellContext {
  addCells: (cells: CELL_TYPE[]) => void;
  currentCells: CELL_TYPE[];
  removeAllCells: (cells: CELL_TYPE[]) => void;
  removeCells: (cells: CELL_TYPE[]) => void;
}

export const initialCellContext: ICellContext = {
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

const CellContext = React.createContext({
  ...initialCellContext,
});

export default CellContext;
export { CellContext };
