import * as React from 'react';
import { CELL_TYPE } from '../../types/chell';

export interface ICellContext {
  addCells: (cells: CELL_TYPE[]) => void;
  currentCells: CELL_TYPE[];
  removeAllCells: (cells: CELL_TYPE[]) => void;
  removeCells: (cells: CELL_TYPE[]) => void;
}

export const initialCellContext = {
  currentCells: [] as CELL_TYPE[],
} as ICellContext;

const CellContext = React.createContext({
  ...initialCellContext,
});

export default CellContext;
export { CellContext };
