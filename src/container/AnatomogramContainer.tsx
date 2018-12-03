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
    P11B: 'UBERON_0001155',
    P12A: 'UBERON_0000955',
    P9A: 'UBERON_0000977',
  },
  mus_musculus: {
    Heart: 'UBERON_0001255',
    Kidney: 'sUBERON_0014892',
    Limb: 'UBERON_0003126',
    Liver: 'UBERON_0002371',
    Lung: 'UBERON_0002048 ',
    Mammary: 'UBERON_0002107',
    Marrow: 'UBERON_0002370',
    Muscle: 'UBERON_0003126',
    Spleen: 'UBERON_0001911',
    Thymus: 'UBERON_0002106',
    Tongue: 'UBERON_0002113',
    Trachea: 'UBERON_0001723',
  },
};

export const anatomogramToSpringMapping: { [key: string]: { [key: string]: string[] } } = {
  homo_sapiens: {
    UBERON_0000178: ['P11A'],
    UBERON_0000955: ['P12A'],
    UBERON_0000977: ['P9A'],
    UBERON_0001155: ['P11B'],
  },
  mus_musculus: {
    UBERON_0000948: ['Heart_and_Aorta-10X_P7_4'],
    UBERON_0001255: ['Bladder-10X_P4_3', 'Bladder-10X_P4_4', 'Bladder-10X_P7_7'],
    UBERON_0001723: ['Tongue-10X_P4_0', 'Tongue-10X_P4_1', 'Tongue-10X_P7_10'],
    UBERON_0001911: ['Mammary_Gland-10X_P7_12', 'Mammary_Gland-10X_P7_13'],
    UBERON_0002048: ['Lung-10X_P7_8', 'Lung-10X_P7_9', 'Lung-10X_P8_12', 'Lung-10X_P8_13'],
    UBERON_0002106: ['Spleen-10X_P4_7', 'Spleen-10X_P7_6'],
    UBERON_0002107: ['Liver-10X_P4_2', 'Liver-10X_P7_0', 'Liver-10X_P7_1'],
    UBERON_0002113: ['Kidney-10X_P4_5', 'Kidney-10X_P4_6', 'Kidney-10X_P7_5'],
    UBERON_0002370: ['Thymus-10X_P7_11'],
    UBERON_0002371: ['Marrow-10X_P7_2', 'Marrow-10X_P7_3'],
    UBERON_0003126: ['Trachea-10X_P8_14', 'Trachea-10X_P8_15'],
    UBERON_0014892: ['Limb_Muscle-10X_P7_14', 'Limb_Muscle-10X_P7_15'],
  },
};

export class AnatomogramContainerClass extends React.Component<IAnatomogramContainerProps, IAnatomogramContainerState> {
  public static defaultProps = {
    cellContext: {
      ...initialCellContext,
    },
    height: '300px',
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
          category => springToAnatomogramMapping[this.props.species][this.parseCategory(category)],
        ),
      });
    } else if (!isEqual(cellContext.currentCells, prevProps.cellContext.currentCells)) {
      const categories = new Set<string>();
      for (const cellIndex of cellContext.currentCells) {
        if (springContext.graphData.nodes[cellIndex]) {
          categories.add(springContext.graphData.nodes[cellIndex].category);
        } else {
          console.log(`No cell found for index ${cellIndex}`);
        }
      }
      this.setState({
        selectIds: Array.from(categories).map(
          category => springToAnatomogramMapping[this.props.species][this.parseCategory(category)],
        ),
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
    this.props.springContext.toggleCategories(anatomogramToSpringMapping[this.props.species][id]);
  };

  protected onMouseOut = (id: string) => {
    return;
  };

  protected onMouseOver = (id: string) => {
    return;
  };

  protected parseCategory = (category: string) => {
    const splitCategories = category.split(/-|_/);

    return splitCategories[0];
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
