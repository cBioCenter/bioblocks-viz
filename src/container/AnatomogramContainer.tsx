// tslint:disable-next-line:import-name
import Anatomogram from 'anatomogram';
import * as React from 'react';

import { Set } from 'immutable';
import { initialSpringContext, ISpringContext, SpringContext } from '~chell-viz~/context';
import { CHELL_CSS_STYLE } from '~chell-viz~/data';

export interface IAnatomogramContainerProps {
  height: number | string;
  species: 'homo_sapiens' | 'mus_musculus';
  springContext: ISpringContext;
  style: CHELL_CSS_STYLE;
  width: number | string;
}

export interface IAnatomogramContainerState {
  ids: string[];
  selectIds: Set<string>;
}

export const springToAnatomogramMapping: { [key: string]: { [key: string]: string } } = {
  homo_sapiens: {
    P11A: 'UBERON_0000178',
    P11B: 'UBERON_0001155',
    P12A: 'UBERON_0000955',
    P9A: 'UBERON_0000977',
  },
  mus_musculus: {
    Bladder: 'UBERON_0001255',
    Heart: 'UBERON_0000948',
    Kidney: 'UBERON_0002113',
    Limb: 'UBERON_0014892',
    Liver: 'UBERON_0002107',
    Lung: 'UBERON_0002048',
    Mammary: 'UBERON_0001911',
    Marrow: 'UBERON_0002371',
    Muscle: 'UBERON_0014892',
    Spleen: 'UBERON_0002106',
    Thymus: 'UBERON_0002370',
    Tongue: 'UBERON_0001723',
    Trachea: 'UBERON_0003126',
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
    UBERON_0000948: ['Heart_and_Aorta', 'Heart_and_Aorta-10X_P7_4'],
    UBERON_0001255: ['Bladder', 'Bladder-10X_P4_3', 'Bladder-10X_P4_4', 'Bladder-10X_P7_7'],
    UBERON_0001723: ['Tongue', 'Tongue-10X_P4_0', 'Tongue-10X_P4_1', 'Tongue-10X_P7_10'],
    UBERON_0001911: ['Mammary_Gland', 'Mammary_Gland-10X_P7_12', 'Mammary_Gland-10X_P7_13'],
    UBERON_0002048: ['Lung', 'Lung-10X_P7_8', 'Lung-10X_P7_9', 'Lung-10X_P8_12', 'Lung-10X_P8_13'],
    UBERON_0002106: ['Spleen', 'Spleen-10X_P4_7', 'Spleen-10X_P7_6'],
    UBERON_0002107: ['Liver', 'Liver-10X_P4_2', 'Liver-10X_P7_0', 'Liver-10X_P7_1'],
    UBERON_0002113: ['Kidney', 'Kidney-10X_P4_5', 'Kidney-10X_P4_6', 'Kidney-10X_P7_5'],
    UBERON_0002370: ['Thymus', 'Thymus-10X_P7_11'],
    UBERON_0002371: ['Marrow', 'Marrow-10X_P7_2', 'Marrow-10X_P7_3'],
    UBERON_0003126: ['Trachea', 'Trachea-10X_P8_14', 'Trachea-10X_P8_15'],
    UBERON_0014892: ['Limb_Muscle', 'Limb_Muscle-10X_P7_14', 'Limb_Muscle-10X_P7_15'],
  },
};

export class AnatomogramContainerClass extends React.Component<IAnatomogramContainerProps, IAnatomogramContainerState> {
  public static defaultProps = {
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
      selectIds: Set<string>(),
    };
  }

  public componentDidUpdate(prevProps: IAnatomogramContainerProps) {
    const { springContext } = this.props;
    if (!springContext.selectedLabels.equals(prevProps.springContext.selectedLabels)) {
      const selectIds = springContext.selectedLabels
        .toArray()
        .filter(label => springToAnatomogramMapping[this.props.species][this.parseCategory(label)] !== undefined)
        .map(label => springToAnatomogramMapping[this.props.species][this.parseCategory(label)]);
      this.setState({
        selectIds: Set(selectIds),
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
          selectIds={selectIds.toArray()}
          showIds={ids}
          species={this.props.species}
          selectedView={this.props.species === 'mus_musculus' ? 'female' : 'male'}
        />
      </div>
    );
  }

  protected onClick = (id: string) => {
    const { species, springContext } = this.props;
    const labels = anatomogramToSpringMapping[species][id];

    springContext.toggleLabels(labels);
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
  <SpringContext.Consumer>
    {springContext => <AnatomogramContainerClass {...props} springContext={springContext} />}
  </SpringContext.Consumer>
);
