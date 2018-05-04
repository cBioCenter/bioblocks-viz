/// <reference types="react" />
import * as React from 'react';
import { ISpringGraphData } from 'spring';
export declare const SpringComponentWithDefaultProps: React.ComponentType<
  Partial<{
    padding: number;
    selectedCategory: string;
    width: number;
    addCells: (cells: number[]) => void;
    currentCells: number[];
    removeAllCells: (cells: number[]) => void;
    removeCells: (cells: number[]) => void;
    canvasBackgroundColor: number;
    data: ISpringGraphData;
    height: number;
  }> &
    Required<
      Pick<
        {
          padding: number;
          selectedCategory: string;
          width: number;
          addCells: (cells: number[]) => void;
          currentCells: number[];
          removeAllCells: (cells: number[]) => void;
          removeCells: (cells: number[]) => void;
          canvasBackgroundColor: number;
          data: ISpringGraphData;
          height: number;
        },
        never
      >
    >
>;
export declare const SpringComponent: (
  props: Partial<{
    padding: number;
    selectedCategory: string;
    width: number;
    addCells: (cells: number[]) => void;
    currentCells: number[];
    removeAllCells: (cells: number[]) => void;
    removeCells: (cells: number[]) => void;
    canvasBackgroundColor: number;
    data: ISpringGraphData;
    height: number;
  }> &
    Required<
      Pick<
        {
          padding: number;
          selectedCategory: string;
          width: number;
          addCells: (cells: number[]) => void;
          currentCells: number[];
          removeAllCells: (cells: number[]) => void;
          removeCells: (cells: number[]) => void;
          canvasBackgroundColor: number;
          data: ISpringGraphData;
          height: number;
        },
        never
      >
    >,
) => JSX.Element;
