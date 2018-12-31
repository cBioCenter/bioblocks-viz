// tslint:disable-next-line:import-name
import Anatomogram from 'anatomogram';
import { Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { LabelActions } from '~chell-viz~/action';
import { initialSpringContext, ISpringContext, SpringContext } from '~chell-viz~/context';
import { CHELL_CSS_STYLE } from '~chell-viz~/data';
import { RootState } from '~chell-viz~/reducer';

interface IReduxAnatomogramContainerProps {
  height: number | string;
  selectIds: Set<string>;
  species: 'homo_sapiens' | 'mus_musculus';
  springContext: ISpringContext;
  style: CHELL_CSS_STYLE;
  width: number | string;
  addLabel(label: string): void;
}

interface IReduxAnatomogramContainerState {
  ids: string[];
}

export const springToAnatomogramMappingRedux: { [key: string]: { [key: string]: string } } = {
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

const anatomogramToSpringMappingRedux: { [key: string]: { [key: string]: string[] } } = {
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

class ReduxAnatomogramContainerClass extends React.Component<
  IReduxAnatomogramContainerProps,
  IReduxAnatomogramContainerState
> {
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

  constructor(props: IReduxAnatomogramContainerProps) {
    super(props);
    this.state = {
      ids: Object.keys(anatomogramToSpringMappingRedux[props.species]),
    };
  }

  public render() {
    const { species, selectIds } = this.props;
    const { ids } = this.state;

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
          species={species}
          selectedView={species === 'mus_musculus' ? 'female' : 'male'}
        />
      </div>
    );
  }

  protected onClick = (ids: string[]) => {
    const { addLabel, species, springContext } = this.props;
    const labels = anatomogramToSpringMappingRedux[species][ids[0]];

    addLabel(ids[0]);
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

const mapStateToProps = (state: RootState) => ({
  selectIds: Set<string>([state.label.selectedLabel]),
});

type requiredProps = Omit<IReduxAnatomogramContainerProps, keyof typeof ReduxAnatomogramContainerClass.defaultProps> &
  Partial<IReduxAnatomogramContainerProps>;

const UnconnectedReduxAnatomogramContainer = (props: requiredProps) => (
  <SpringContext.Consumer>
    {springContext => <ReduxAnatomogramContainerClass {...props} springContext={springContext} />}
  </SpringContext.Consumer>
);

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addLabel: LabelActions.addLabel,
    },
    dispatch,
  );

// tslint:disable-next-line:max-classes-per-file
export class ReduxAnatomogramContainer extends connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedReduxAnatomogramContainer) {}
