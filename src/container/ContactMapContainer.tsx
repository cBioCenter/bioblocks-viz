import * as React from 'react';
import { connect, Provider } from 'react-redux';

import { bindActionCreators, Dispatch } from 'redux';
import { createContainerActions, createResiduePairActions } from '~bioblocks-viz~/action';
import { ContactMapComponent, generateChartDataEntry, IContactMapChartData } from '~bioblocks-viz~/component';
import {
  BIOBLOCKS_CSS_STYLE,
  BioblocksPDB,
  BioblocksWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  CouplingContainer,
  IContactMapData,
  ICouplingScoreFilter,
  RESIDUE_TYPE,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_SECTION,
} from '~bioblocks-viz~/data';
import { EMPTY_FUNCTION, generateCouplingScoreHoverText } from '~bioblocks-viz~/helper';
import { BBStore, createContainerReducer, createResiduePairReducer, LockedResiduePair } from '~bioblocks-viz~/reducer';
import { getHovered, getLocked, selectCurrentItems } from '~bioblocks-viz~/selector';

export interface IContactMapContainerProps {
  /** Color to distinguish contacts that are considered in agreement. */
  agreementColor: string;
  /** Color to distinguish contacts with no special designation. */
  allColor: string;
  data: IContactMapData;
  filters: ICouplingScoreFilter[];
  height: number | string;
  /** Color to distinguish contacts that are highlighted. */
  highlightColor: string;
  /** Flag to control loading spinner. */
  isDataLoading: boolean;
  /** Color to distinguish contacts that are considered observed. */
  observedColor: string;
  style?: BIOBLOCKS_CSS_STYLE;
  width: number | string;
  addHoveredResidues(residues: RESIDUE_TYPE[]): void;
  addHoveredSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  addSelectedSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  onBoxSelection?(residues: RESIDUE_TYPE[]): void;
  removeAllLockedResiduePairs(): void;
  removeAllSelectedSecondaryStructures(): void;
  removeHoveredResidues(): void;
  removeHoveredSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  removeSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  toggleLockedResiduePair(residuePair: LockedResiduePair): void;
}

export const initialContactMapContainerState = {
  linearDistFilter: 5,
  minimumProbability: 0.9,
  minimumScore: 0,
  numPredictionsToShow: -1,
  pointsToPlot: [] as IContactMapChartData[],
  rankFilter: [1, 100],
};

export type ContactMapContainerState = typeof initialContactMapContainerState;

/**
 * Container for the ContactMap, responsible for data interaction.
 * @extends {React.Component<IContactMapContainerProps, ContactMapContainerState>}
 */
export class ContactMapContainerClass extends React.Component<IContactMapContainerProps, ContactMapContainerState> {
  public static defaultProps = {
    addHoveredResidues: EMPTY_FUNCTION,
    addHoveredSecondaryStructure: EMPTY_FUNCTION,
    addSelectedSecondaryStructure: EMPTY_FUNCTION,
    agreementColor: '#ff0000',
    allColor: '#000000',
    data: {
      couplingScores: new CouplingContainer(),
      secondaryStructures: new Array<SECONDARY_STRUCTURE>(),
    },
    filters: [],
    height: '100%',
    highlightColor: '#ff8800',
    isDataLoading: false,
    observedColor: '#0000ff',
    onBoxSelection: EMPTY_FUNCTION,
    removeAllLockedResiduePairs: EMPTY_FUNCTION,
    removeAllSelectedSecondaryStructures: EMPTY_FUNCTION,
    removeHoveredResidues: EMPTY_FUNCTION,
    removeHoveredSecondaryStructure: EMPTY_FUNCTION,
    removeSecondaryStructure: EMPTY_FUNCTION,
    toggleLockedResiduePair: EMPTY_FUNCTION,
    width: '100%',
  };

  public readonly state: ContactMapContainerState = initialContactMapContainerState;

  constructor(props: IContactMapContainerProps) {
    super(props);
    this.setupDataServices();
  }

  public setupDataServices() {
    createContainerReducer<SECONDARY_STRUCTURE_SECTION>('secondaryStructure/hovered');
    createContainerReducer<SECONDARY_STRUCTURE_SECTION>('secondaryStructure/selected');
    createContainerReducer<BioblocksPDB[]>('pdb');
    createResiduePairReducer();
  }
  public componentDidMount() {
    this.setupData(true);
  }

  public componentDidUpdate(prevProps: IContactMapContainerProps, prevState: ContactMapContainerState) {
    const { agreementColor, allColor, data } = this.props;
    const { linearDistFilter, minimumProbability, minimumScore, numPredictionsToShow, rankFilter } = this.state;

    const isRecomputeNeeded =
      agreementColor !== prevProps.agreementColor ||
      allColor !== prevProps.allColor ||
      data.couplingScores !== prevProps.data.couplingScores ||
      linearDistFilter !== prevState.linearDistFilter ||
      minimumProbability !== prevState.minimumProbability ||
      minimumScore !== prevState.minimumScore ||
      numPredictionsToShow !== prevState.numPredictionsToShow ||
      rankFilter !== prevState.rankFilter;
    if (isRecomputeNeeded) {
      this.setupData(data.couplingScores !== prevProps.data.couplingScores);
    }
  }

  public render() {
    const { data, style, ...passThroughProps } = this.props;
    const { pointsToPlot } = this.state;

    return (
      <Provider store={BBStore}>
        <div className="ContactMapContainer" style={style}>
          <ContactMapComponent
            configurations={this.getConfigs()}
            data={{
              couplingScores: data.couplingScores,
              pdbData: data.pdbData,
              secondaryStructures: data.secondaryStructures,
            }}
            formattedPoints={pointsToPlot}
            {...passThroughProps}
          />
        </div>
      </Provider>
    );
  }

  public onLinearDistFilterChange = () => (value: number) => {
    this.setState({
      linearDistFilter: value,
    });
  };

  public onMinimumProbabilityChange = () => (value: number) => {
    this.setState({
      minimumProbability: value,
    });
  };

  public onNumPredictionsToShowChange = () => (value: number) => {
    this.setState({
      numPredictionsToShow: value,
    });
  };

  protected getConfigs = (): BioblocksWidgetConfig[] => {
    const { linearDistFilter, minimumProbability, numPredictionsToShow } = this.state;
    const { chainLength } = this.props.data.couplingScores;

    return [
      {
        marks: {
          [Math.floor(chainLength / 2)]: 'L/2',
          [Math.floor(chainLength / 4)]: 'L/4',
          0: '0',
          [chainLength]: 'L',
          [chainLength * 2]: '2L',
          [chainLength * 3]: '3L',
        },
        name: '# Couplings to Display',
        onChange: this.onNumPredictionsToShowChange(),
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: numPredictionsToShow,
          defaultValue: Math.floor(chainLength / 2),
          max: chainLength * 3,
          min: 0,
        },
      },
      {
        name: 'Linear Distance Filter (|i - j|)',
        onChange: this.onLinearDistFilterChange(),
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: linearDistFilter,
          defaultValue: initialContactMapContainerState.linearDistFilter,
          max: 10,
          min: 1,
        },
      },
      {
        name: 'Minimum Probability',
        onChange: this.onMinimumProbabilityChange(),
        step: 0.01,
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: minimumProbability,
          defaultValue: initialContactMapContainerState.minimumProbability,
          max: 1.0,
          min: 0.0,
        },
      },
    ];
  };

  protected getPredictedFilters = () => {
    const { linearDistFilter, minimumProbability, minimumScore } = this.state;

    return new Array<ICouplingScoreFilter>(
      {
        filterFn: score => (score.probability !== undefined ? score.probability >= minimumProbability : true),
      },
      {
        filterFn: score => (score.score !== undefined ? score.score >= minimumScore : true),
      },
      {
        filterFn: score => Math.abs(score.i - score.j) >= linearDistFilter,
      },
    );
  };

  /**
   * Setups up the prediction values for the data.
   *
   * @param isNewData Is this an entirely new dataset?
   */
  protected setupData(isNewData: boolean) {
    const { agreementColor, data, allColor } = this.props;
    const { linearDistFilter, numPredictionsToShow } = this.state;
    const { couplingScores } = data;
    const { chainLength } = couplingScores;

    const newPoints = new Array<IContactMapChartData>();

    if (couplingScores.isDerivedFromCouplingScores) {
      const allPredictions = couplingScores.getPredictedContacts(
        numPredictionsToShow,
        linearDistFilter,
        this.getPredictedFilters(),
      );
      const correctPredictionPercent = (
        (allPredictions.correct.length / allPredictions.predicted.length) *
        100
      ).toFixed(1);
      newPoints.push(
        generateChartDataEntry(
          'text',
          allColor,
          'Inferred Contact',
          `(N=${numPredictionsToShow}, L=${chainLength})`,
          4,
          allPredictions.predicted,
          {
            text: allPredictions.predicted.map(generateCouplingScoreHoverText),
          },
        ),
        generateChartDataEntry(
          'text',
          agreementColor,
          'Inferred Contact Agrees with PDB Contact',
          `(N=${allPredictions.correct.length}, ${correctPredictionPercent}%)`,
          6,
          allPredictions.correct,
          {
            text: allPredictions.correct.map(generateCouplingScoreHoverText),
          },
        ),
      );
    }

    this.setState({
      numPredictionsToShow: isNewData ? Math.floor(chainLength / 2) : numPredictionsToShow,
      pointsToPlot: newPoints,
    });
  }
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  hoveredResidues: getHovered(state).toArray(),
  hoveredSecondaryStructures: selectCurrentItems<SECONDARY_STRUCTURE_SECTION>(
    state,
    'secondaryStructure/hovered',
  ).toArray(),
  lockedResiduePairs: getLocked(state).toJS(),
  selectedSecondaryStructures: selectCurrentItems<SECONDARY_STRUCTURE_SECTION>(
    state,
    'secondaryStructure/selected',
  ).toArray(),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addHoveredResidues: createResiduePairActions().hovered.set,
      addHoveredSecondaryStructure: createContainerActions('secondaryStructure/hovered').add,
      addSelectedSecondaryStructure: createContainerActions('secondaryStructure/selected').add,
      removeAllLockedResiduePairs: createResiduePairActions().locked.clear,
      removeAllSelectedSecondaryStructures: createContainerActions('secondaryStructure/selected').clear,
      removeHoveredResidues: createResiduePairActions().hovered.clear,
      removeHoveredSecondaryStructure: createContainerActions('secondaryStructure/hovered').remove,
      removeSecondaryStructure: createContainerActions('secondaryStructure/selected').remove,
      toggleLockedResiduePair: createResiduePairActions().locked.toggle,
    },
    dispatch,
  );

export const ContactMapContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactMapContainerClass);
