import * as React from 'react';
import {
  CONFIGURATION_COMPONENT_TYPE,
  CONTACT_DISTANCE_PROXIMITY,
  IContactMapData,
  SECONDARY_STRUCTURE,
} from '../data/chell-data';
import { CouplingContainer } from '../data/CouplingContainer';
import { generateChartDataEntry, IContactMapChartData } from './chart/ContactMapChart';
import ContactMap, { IContactMapConfiguration } from './ContactMap';

export interface IPredictedContactMapProps {
  correctColor: string;
  data: IContactMapData;
  enableSliders: boolean;
  height: number;
  incorrectColor: string;
  style: React.CSSProperties;
  width: number;
}

export const initialPredictedContactMapState = {
  linearDistFilter: 5,
  measuredProximity: CONTACT_DISTANCE_PROXIMITY.CLOSEST,
  numPredictionsToShow: -1,
  pointsToPlot: [] as IContactMapChartData[],
};

export type PredictedContactMapState = typeof initialPredictedContactMapState;

export class PredictedContactMap extends React.Component<IPredictedContactMapProps, PredictedContactMapState> {
  public static defaultProps: Partial<IPredictedContactMapProps> = {
    correctColor: '#ff0000',
    data: {
      couplingScores: new CouplingContainer(),
      secondaryStructures: new Array<SECONDARY_STRUCTURE>(),
    },
    enableSliders: true,
    height: 400,
    incorrectColor: '#000000',
    width: 400,
  };

  public readonly state: PredictedContactMapState = initialPredictedContactMapState;

  constructor(props: IPredictedContactMapProps) {
    super(props);
  }

  public onLinearDistFilterChange = () => (value: number) => {
    this.setState({
      linearDistFilter: value,
    });
  };

  public onNumPredictionsToShowChange = () => (value: number) => {
    this.setState({
      numPredictionsToShow: value,
    });
  };

  public onMeasuredProximityChange = () => (value: number) => {
    this.setState({
      measuredProximity: Object.values(CONTACT_DISTANCE_PROXIMITY)[value],
    });
  };

  public componentDidMount() {
    this.setupData(true);
  }

  public componentDidUpdate(prevProps: IPredictedContactMapProps, prevState: PredictedContactMapState) {
    const { data } = this.props;
    const { linearDistFilter, measuredProximity, numPredictionsToShow } = this.state;

    const isRecomputeNeeded =
      data.couplingScores !== prevProps.data.couplingScores ||
      linearDistFilter !== prevState.linearDistFilter ||
      measuredProximity !== prevState.measuredProximity ||
      numPredictionsToShow !== prevState.numPredictionsToShow;
    if (isRecomputeNeeded) {
      this.setupData(data.couplingScores !== prevProps.data.couplingScores);
    }
  }

  public render() {
    const { data, style, ...passThroughProps } = this.props;
    const { pointsToPlot } = this.state;
    return (
      <div id="PredictedContactMapComponent" style={{ ...style }}>
        <ContactMap
          configurations={this.getContactMapConfigs()}
          data={{
            couplingScores: data.couplingScores,
            pdbData: data.pdbData,
            secondaryStructures: data.pdbData ? data.pdbData.secondaryStructureSections : [],
          }}
          formattedPoints={pointsToPlot}
          {...passThroughProps}
        />
      </div>
    );
  }

  protected getContactMapConfigs = (): IContactMapConfiguration[] => [
    {
      name: 'Calculate Distance: Closest Atom - C-Alpha',
      onChange: this.onMeasuredProximityChange(),
      type: CONFIGURATION_COMPONENT_TYPE.RADIO,
      values: {
        current: Object.keys(CONTACT_DISTANCE_PROXIMITY).indexOf(this.state.measuredProximity),
        max: 1,
        min: 0,
        options: Object.values(CONTACT_DISTANCE_PROXIMITY),
      },
    },
    {
      name: 'Linear Distance Filter (|i - j|)',
      onChange: this.onLinearDistFilterChange(),
      type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
      values: {
        current: this.state.linearDistFilter,
        max: 10,
        min: 1,
      },
    },
    {
      name: 'Top N Predictions to Show',
      onChange: this.onNumPredictionsToShowChange(),
      type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
      values: {
        current: this.state.numPredictionsToShow,
        max: this.props.data.couplingScores.chainLength,
        min: 1,
      },
    },
  ];

  /**
   * Setups up the prediction values for the data.
   *
   * @param isNewData Is this an entirely new dataset?
   */
  protected setupData(isNewData: boolean) {
    const { correctColor, data, incorrectColor } = this.props;
    const { linearDistFilter, measuredProximity, numPredictionsToShow } = this.state;
    const couplingScores = data.pdbData
      ? data.pdbData.generateCouplingsAmendedWithPDB(data.couplingScores.rankedContacts, measuredProximity)
      : new CouplingContainer(data.couplingScores.rankedContacts);

    const { chainLength } = couplingScores;

    const allPredictions = couplingScores.getPredictedContacts(numPredictionsToShow, linearDistFilter);

    const correctPredictionPercent = ((allPredictions.correct.length / allPredictions.predicted.length) * 100).toFixed(
      2,
    );

    const newPoints: IContactMapChartData[] = [
      generateChartDataEntry(
        'x+y',
        incorrectColor,
        'Predicted Contact',
        `(N=${numPredictionsToShow}, L=${chainLength})`,
        4,
        allPredictions.predicted,
      ),
      generateChartDataEntry(
        'x+y',
        correctColor,
        'Correct Prediction',
        `(N=${allPredictions.correct.length}, ${correctPredictionPercent}%)`,
        6,
        allPredictions.correct,
      ),
    ];

    this.setState({
      numPredictionsToShow: isNewData ? Math.floor(chainLength / 2) : numPredictionsToShow,
      pointsToPlot: newPoints,
    });
  }
}

export default PredictedContactMap;
