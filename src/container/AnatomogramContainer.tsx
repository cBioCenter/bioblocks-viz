// tslint:disable-next-line:import-name
import Anatomogram from 'anatomogram';
import { isEqual } from 'lodash';
import * as React from 'react';

import {
  CellContext,
  ICellContext,
  initialCellContext,
  initialSpringContext,
  ISpringContext,
  SpringContext,
} from '~chell-viz~/context';
import { CHELL_CSS_STYLE } from '~chell-viz~/data';

export interface IAnatomogramContainerProps {
  cellContext: ICellContext;
  height: number | string;
  ids: string[];
  springContext: ISpringContext;
  style: CHELL_CSS_STYLE;
  width: number | string;
}

export interface IAnatomogramContainerState {
  selectIds: string[];
}

export const springToAnatomogramMapping: { [key: string]: string } = {
  P11A: 'UBERON_0000178',
  P11B: 'UBERON_0000473',
  P12A: 'UBERON_0000955',
  P9A: 'UBERON_0000977',
};

export const anatomogramToSpringMapping: { [key: string]: string } = {
  UBERON_0000178: 'P11A',
  UBERON_0000473: 'P11B',
  UBERON_0000955: 'P12A',
  UBERON_0000977: 'P9A',
};

export class AnatomogramContainerClass extends React.Component<IAnatomogramContainerProps, IAnatomogramContainerState> {
  public static defaultProps = {
    cellContext: {
      ...initialCellContext,
    },
    height: '300px',
    ids: ['UBERON_0000178', 'UBERON_0000473', 'UBERON_0000955', 'UBERON_0000977'],
    springContext: {
      ...initialSpringContext,
    },
    style: {},
    width: '400px',
  };

  public static displayName = 'Anatomogram';

  constructor(props: IAnatomogramContainerProps) {
    super(props);
    this.state = {
      selectIds: [],
    };
  }

  public componentDidUpdate(prevProps: IAnatomogramContainerProps) {
    const { cellContext, springContext } = this.props;
    if (!isEqual(springContext.selectedCategories, prevProps.springContext.selectedCategories)) {
      this.setState({
        selectIds: springContext.selectedCategories.map(category => springToAnatomogramMapping[category]),
      });
    } else if (!isEqual(cellContext.currentCells, prevProps.cellContext.currentCells)) {
      const categories = new Set<string>();
      for (const cellIndex of cellContext.currentCells) {
        categories.add(springContext.graphData.nodes[cellIndex].category);
      }
      this.setState({
        selectIds: Array.from(categories).map(category => springToAnatomogramMapping[category]),
      });
    }
  }

  public render() {
    const { selectIds } = this.state;

    return (
      <div className={'anatomogram-container'}>
        <Anatomogram
          atlasUrl={``}
          highlightColour={'yellow'}
          onClick={this.onClick}
          onMouseOut={this.onMouseOut}
          onMouseOver={this.onMouseOver}
          selectColour={'ffaa00'}
          selectIds={selectIds}
          showIds={this.props.ids}
          species={'homo_sapiens'}
        />
      </div>
    );
  }

  protected onClick = (id: string) => {
    this.props.springContext.toggleCategory(anatomogramToSpringMapping[id]);
  };

  protected onMouseOut = (id: string) => {
    return;
  };

  protected onMouseOver = (id: string) => {
    return;
  };
}

type requiredProps = Omit<IAnatomogramContainerProps, keyof typeof AnatomogramContainerClass.defaultProps> &
  Partial<IAnatomogramContainerProps>;

export const AnatomogramContainer = (props: requiredProps) => (
  <CellContext.Consumer>
    {cellContext => (
      <SpringContext.Consumer>
        {springContext => (
          <AnatomogramContainerClass {...props} cellContext={cellContext} springContext={springContext} />
        )}
      </SpringContext.Consumer>
    )}
  </CellContext.Consumer>
);
