/// <reference types="react" />
import { CELL_TYPE } from 'chell';
import * as React from 'react';
export interface ICellContext {
  addCells: (cells: CELL_TYPE[]) => void;
  currentCells: CELL_TYPE[];
  removeAllCells: (cells: CELL_TYPE[]) => void;
  removeCells: (cells: CELL_TYPE[]) => void;
}
export declare const initialCellContext: ICellContext;
export declare const CellContext: React.Context<{
  addCells: (cells: number[]) => void;
  currentCells: number[];
  removeAllCells: (cells: number[]) => void;
  removeCells: (cells: number[]) => void;
}>;
