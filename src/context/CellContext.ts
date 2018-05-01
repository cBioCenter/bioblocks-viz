import { CELL_TYPE } from 'chell';
import * as React from 'react';

export interface ICellContext {
  addCells: (cells: CELL_TYPE[]) => void;
  currentCells: CELL_TYPE[];
  removeAllCells: (cells: CELL_TYPE[]) => void;
  removeCells: (cells: CELL_TYPE[]) => void;
}

export const initialCellContext = {
  currentCells: [] as CELL_TYPE[],
} as ICellContext;

export const CellContext = React.createContext({
  ...initialCellContext,
});
