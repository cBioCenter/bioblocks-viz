import * as React from 'react';

import { ContactMap, generateChartDataEntry, IContactMapChartData } from '~bioblocks-viz~/component';
import {
  BIOBLOCKS_CSS_STYLE,
  BioblocksWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  CouplingContainer,
  IContactMapData,
  SECONDARY_STRUCTURE,
} from '~bioblocks-viz~/data';

export interface IPredictedContactMapProps {
  agreementColor: string;
  allColor: string;
  data: IContactMapData;
  height: number | string;
  isDataLoading: boolean;
  style?: BIOBLOCKS_CSS_STYLE;
  width: number | string;
}

export const initialPredictedContactMapState = {
  linearDistFilter: 5,
  minimumProbability: 0.9,
  minimumScore: 0,
  numPredictionsToShow: -1,
  pointsToPlot: [] as IContactMapChartData[],
  rankFilter: [1, 100],
};

export type PredictedContactMapState = typeof initialPredictedContactMapState;

export class PredictedContactMap extends React.Component<IPredictedContactMapProps, PredictedContactMapState> {
  public static defaultProps = {
    agreementColor: '#ff0000',
    allColor: '#000000',
    data: {
      couplingScores: new CouplingContainer(),
      secondaryStructures: new Array<SECONDARY_STRUCTURE>(),
    },
    height: '100%',
    isDataLoading: false,
    width: '100%',
  };

  public readonly state: PredictedContactMapState = initialPredictedContactMapState;

  constructor(props: IPredictedContactMapProps) {
    super(props);
  }

  public componentDidMount() {
    this.setupData(true);
  }

  public componentDidUpdate(prevProps: IPredictedContactMapProps, prevState: PredictedContactMapState) {
    const { data } = this.props;
    const { linearDistFilter, minimumProbability, minimumScore, numPredictionsToShow, rankFilter } = this.state;

    const isRecomputeNeeded =
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
      <div className="PredictedContactMapComponent" style={style}>
        <ContactMap
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

  public onMinimumScoreChange = () => (value: number) => {
    this.setState({
      minimumScore: value,
    });
  };

  public onNumPredictionsToShowChange = () => (value: number) => {
    this.setState({
      numPredictionsToShow: value,
    });
  };

  public onRankChange = () => (range: number[]) => {
    this.setState({
      rankFilter: range,
    });
  };

  protected getConfigs = (): BioblocksWidgetConfig[] => {
    const { linearDistFilter, minimumProbability, minimumScore, numPredictionsToShow, rankFilter } = this.state;

    return [
      {
        name: 'Linear Distance Filter (|i - j|)',
        onChange: this.onLinearDistFilterChange(),
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: linearDistFilter,
          defaultValue: initialPredictedContactMapState.linearDistFilter,
          max: 10,
          min: 1,
        },
      },
      {
        name: 'Top N Predictions to Show',
        onChange: this.onNumPredictionsToShowChange(),
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: numPredictionsToShow,
          defaultValue: 100,
          max: this.props.data.couplingScores.chainLength,
          min: 1,
        },
      },
      {
        name: 'Minimum Allowed Probability',
        onChange: this.onMinimumProbabilityChange(),
        step: 0.01,
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: minimumProbability,
          defaultValue: initialPredictedContactMapState.minimumProbability,
          max: 1.0,
          min: 0.0,
        },
      },
      {
        name: 'Minimum Allowed Score',
        onChange: this.onMinimumScoreChange(),
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: minimumScore,
          defaultValue: initialPredictedContactMapState.minimumScore,
          max: 100,
          min: 0,
        },
      },

      {
        name: 'Rank Range',
        onChange: this.onRankChange(),
        range: {
          current: rankFilter,
          defaultRange: initialPredictedContactMapState.rankFilter,
          max: 100,
          min: 0,
        },
        type: CONFIGURATION_COMPONENT_TYPE.RANGE_SLIDER,
      },
    ];
  };

  /**
   * Setups up the prediction values for the data.
   *
   * @param isNewData Is this an entirely new dataset?
   */
  protected setupData(isNewData: boolean) {
    const { agreementColor: correctColor, data, allColor } = this.props;
    const { linearDistFilter, minimumProbability, minimumScore, numPredictionsToShow } = this.state;

    let couplingScores = new CouplingContainer();
    const { pdbData } = data;
    if (pdbData) {
      if (pdbData.known) {
        couplingScores = pdbData.known.contactInformation;
      } else if (pdbData.predicted) {
        couplingScores = pdbData.predicted.contactInformation;
      }
    } else {
      couplingScores = new CouplingContainer(data.couplingScores.rankedContacts);
    }

    const { chainLength } = couplingScores;
    const allPredictions = couplingScores.getPredictedContacts(
      numPredictionsToShow,
      linearDistFilter,
      5,
      minimumProbability,
      minimumScore,
    );
    const correctPredictionPercent = ((allPredictions.correct.length / allPredictions.predicted.length) * 100).toFixed(
      1,
    );

    const newPoints: IContactMapChartData[] = [
      generateChartDataEntry(
        'text',
        allColor,
        'Predicted Contact',
        `(N=${numPredictionsToShow}, L=${chainLength})`,
        4,
        allPredictions.predicted,
        {
          text: allPredictions.predicted.map(point => {
            let hoverText =
              point && point.A_i && point.A_j
                ? `(${point.i}${point.A_i}, ${point.j}${point.A_j})`
                : `(${point.i}, ${point.j})`;
            if (point && point.score) {
              hoverText = `${hoverText}<br>Score: ${point.score}`;
            }
            if (point && point.probability) {
              hoverText = `${hoverText}<br>Probability: ${point.probability.toFixed(1)}`;
            }

            return hoverText;
          }),
        },
      ),
      generateChartDataEntry(
        'text',
        correctColor,
        'Correct Prediction',
        `(N=${allPredictions.correct.length}, ${correctPredictionPercent}%)`,
        6,
        allPredictions.correct,
        {
          text: allPredictions.correct.map(point => {
            let hoverText =
              point.A_i && point.A_j ? `(${point.i}${point.A_i}, ${point.j}${point.A_j})` : `(${point.i}, ${point.j})`;
            if (point && point.score) {
              hoverText = `${hoverText}<br>Score: ${point.score}`;
            }
            if (point && point.probability) {
              hoverText = `${hoverText}<br>Probability: ${point.probability.toFixed(1)}`;
            }

            return hoverText;
          }),
        },
      ),
    ];

    this.setState({
      numPredictionsToShow: isNewData ? Math.floor(chainLength / 2) : numPredictionsToShow,
      pointsToPlot: newPoints,
    });
  }
}
