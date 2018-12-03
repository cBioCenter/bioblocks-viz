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
  species: 'homo_sapiens' | 'mus_musculus';
  springContext: ISpringContext;
  style: CHELL_CSS_STYLE;
  width: number | string;
}

export interface IAnatomogramContainerState {
  ids: string[];
  selectIds: string[];
}

export const springToAnatomogramMapping: { [key: string]: { [key: string]: string } } = {
  homo_sapiens: {
    P11A: 'UBERON_0000178',
    P11B: 'UBERON_0000473',
    P12A: 'UBERON_0000955',
    P9A: 'UBERON_0000977',
  },
  mus_musculus: {
    bladder: 'UBERON_0001255',
    heart: 'UBERON_0000948',
    kidney: 'UBERON_0002113',
    liver: 'UBERON_0002107',
    lung: 'UBERON_0002048 ',
    mammary: 'UBERON_0001911',
    marrow: 'UBERON_0002371',
    muscle: 'sUBERON_0014892',
    spleen: 'UBERON_0002106',
    thymus: 'UBERON_0002370',
    tongue: 'UBERON_0001723',
    trachea: 'UBERON_0003126',
  },
};

export const anatomogramToSpringMapping: { [key: string]: { [key: string]: string } } = {
  homo_sapiens: {
    UBERON_0000178: 'P11A',
    UBERON_0000473: 'P11B',
    UBERON_0000955: 'P12A',
    UBERON_0000977: 'P9A',
  },
  mus_musculus: {
    UBERON_0000948: 'heart',
    UBERON_0001255: 'bladder',
    UBERON_0001723: 'tongue',
    UBERON_0001911: 'mammary',
    UBERON_0002048: 'lung',
    UBERON_0002106: 'spleen',
    UBERON_0002107: 'liver',
    UBERON_0002113: 'kidney',
    UBERON_0002370: 'thymus',
    UBERON_0002371: 'marrow',
    UBERON_0003126: 'trachea',
    sUBERON_0014892: 'muscle',
  },
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

  protected anatomogramRef: any;

  constructor(props: IAnatomogramContainerProps) {
    super(props);
    this.state = {
      ids: Object.keys(anatomogramToSpringMapping[props.species]),
      selectIds: [],
    };
  }

  public componentDidUpdate(prevProps: IAnatomogramContainerProps) {
    const { cellContext, springContext } = this.props;
    if (!isEqual(springContext.selectedCategories, prevProps.springContext.selectedCategories)) {
      this.setState({
        selectIds: springContext.selectedCategories.map(
          category => springToAnatomogramMapping[this.props.species][category],
        ),
      });
    } else if (!isEqual(cellContext.currentCells, prevProps.cellContext.currentCells)) {
      const categories = new Set<string>();
      for (const cellIndex of cellContext.currentCells) {
        categories.add(springContext.graphData.nodes[cellIndex].category);
      }
      this.setState({
        selectIds: Array.from(categories).map(category => springToAnatomogramMapping[this.props.species][category]),
      });
    }
  }

  public render() {
    const { ids, selectIds } = this.state;

    return (
      <div className={'anatomogram-container'} style={{ height: '100%' }}>
        <Anatomogram
          atlasUrl={``}
          highlightColour={'yellow'}
          onClick={this.onClick}
          onMouseOut={this.onMouseOut}
          onMouseOver={this.onMouseOver}
          selectColour={'ffaa00'}
          selectIds={selectIds}
          showIds={ids}
          species={this.props.species}
          selectedView={this.props.species === 'mus_musculus' ? 'female' : 'male'}
        />
      </div>
    );
  }

  protected onClick = (id: string) => {
    this.props.springContext.toggleCategory(anatomogramToSpringMapping[this.props.species][id]);
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
