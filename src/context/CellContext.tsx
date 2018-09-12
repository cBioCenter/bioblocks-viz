import * as React from 'react';

import { CELL_TYPE } from '../data/chell-data';

export const initialCellContext = {
  addCells: (cells: CELL_TYPE[]) => {
    return;
  },
  currentCells: new Array<CELL_TYPE>(),
  removeAllCells: () => {
    return;
  },
  removeCells: (cells: CELL_TYPE[]) => {
    return;
  },
};

export type ICellContext = typeof initialCellContext;

export class CellContextHandler extends React.Component<any, ICellContext> {
  public constructor(props: any) {
    super(props);
    this.state = {
      addCells: this.onAddCells,
      currentCells: new Array<CELL_TYPE>(),
      removeAllCells: this.onRemoveAllCells,
      removeCells: this.onRemoveCells,
    };
  }

  public render() {
    return <CellContext.Provider value={this.state}>{this.props.children}</CellContext.Provider>;
  }

  protected onAddCells = (cells: CELL_TYPE[]) => {
    this.setState({
      currentCells: cells,
    });
  };

  protected onRemoveAllCells = () => {
    this.setState({
      currentCells: [],
    });
  };

  protected onRemoveCells = (cellsToRemove: CELL_TYPE[]) => {
    const { currentCells } = this.state;
    this.setState({
      currentCells: currentCells.filter(cell => cellsToRemove.indexOf(cell) === -1),
    });
  };
}

const CellContext = React.createContext(initialCellContext);

export default CellContext;
export { CellContext };
