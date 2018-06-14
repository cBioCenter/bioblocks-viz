import * as React from 'react';
import { initialResidueContext } from '../context/ResidueContext';
import { IContactMapData, ICouplingScore } from '../data/chell-data';
import { withDefaultProps } from '../helper/ReactHelper';
import { generateChartDataEntry, IContactMapChartData } from './chart/ContactMapChart';
import ContactMap, { IContactMapConfiguration } from './ContactMap';

export const defaultPredictedContactMapProps = {
  correctColor: '#ff0000',
  data: {
    couplingScores: [],
    secondaryStructures: [],
  } as IContactMapData,
  height: 400,
  incorrectColor: '#000000',
  ...initialResidueContext,
  observedColor: '#0000ff',
  padding: 0,
  width: 400,
};

export const initialPredictedContactMapState = {
  chainLength: 59,
  linearDistFilter: 5,
  measuredContactDistFilter: 5,
  numPredictionsToShow: 29,
  pointsToPlot: [] as IContactMapChartData[],
};

export type PredictedContactMapProps = {} & typeof defaultPredictedContactMapProps;
export type PredictedContactMapState = Readonly<typeof initialPredictedContactMapState>;

export class PredictedContactMapClass extends React.Component<PredictedContactMapProps, PredictedContactMapState> {
  public static getDerivedStateFromProps = (props: PredictedContactMapProps, state: PredictedContactMapState) => {
    const { correctColor, data, incorrectColor, observedColor } = props;
    const { linearDistFilter, measuredContactDistFilter, numPredictionsToShow } = state;

    const observedContacts = PredictedContactMapClass.getObservedContacts(
      data.couplingScores,
      measuredContactDistFilter,
    );
    const allPredictions = PredictedContactMapClass.getPredictedContacts(
      data.couplingScores,
      numPredictionsToShow,
      linearDistFilter,
    );

    const chainLength = data.couplingScores.reduce((a, b) => Math.max(a, Math.max(b.i, b.j)), 0);
    const correctPredictionPercent = ((allPredictions.correct.length / allPredictions.predicted.length) * 100).toFixed(
      2,
    );
    const newPoints = [
      generateChartDataEntry(
        'x+y',
        { start: observedColor, end: 'rgb(100,177,200)' },
        'Known Structure Contact',
        '(from PDB structure)',
        4,
        observedContacts,
      ),
      generateChartDataEntry(
        'x+y',
        incorrectColor,
        'Predicted Contact',
        `(${numPredictionsToShow}, L=${chainLength})`,
        4,
        allPredictions.predicted,
      ),
      generateChartDataEntry(
        'x+y',
        correctColor,
        'Correct Prediction',
        `(${allPredictions.correct.length}, ${correctPredictionPercent}%)`,
        6,
        allPredictions.correct,
      ),
    ] as IContactMapChartData[];

    return {
      chainLength,
      pointsToPlot: newPoints,
    };
  };

  /**
   * Determine which contacts in a set of coupling scores are observed.
   *
   * @param contacts Set of contacts, usually generated from coupling_scores.csv.
   * @param [actualDistFilter=5] For each score, if dist <= linearDistFilter, it is considered observed.
   * @returns Contacts that should be considered observed int he current data set.
   */
  protected static getObservedContacts = (contacts: ICouplingScore[], actualDistFilter = 5) =>
    contacts.filter(residuePair => residuePair.dist <= actualDistFilter);

  /**
   * Determine which contacts in a set of coupling scores are predicted as well as which are correct.
   *
   * @param contacts Set of contacts, usually generated from coupling_scores.csv.
   * @param totalPredictionsToShow How many predictions, max, to return.
   * @param [linearDistFilter=5] For each score, if |i - j| >= linearDistFilter, it will be a candidate for being correct/incorrect.
   * @param [measuredContactDistFilter=5]  If the dist for the contact is less than predictionCutoffDist, it is considered correct.
   * @returns The list of correct and incorrect contacts.
   */
  protected static getPredictedContacts(
    contacts: ICouplingScore[],
    totalPredictionsToShow: number,
    linearDistFilter = 5,
    measuredContactDistFilter = 5,
  ) {
    const result = {
      correct: new Array<ICouplingScore>(),
      predicted: new Array<ICouplingScore>(),
    };
    for (const contact of contacts
      .filter(score => Math.abs(score.i - score.j) >= linearDistFilter)
      .slice(0, totalPredictionsToShow)) {
      if (contact.dist < measuredContactDistFilter) {
        result.correct.push(contact);
      }
      result.predicted.push(contact);
    }
    return result;
  }

  public readonly state: PredictedContactMapState = initialPredictedContactMapState;

  constructor(props: PredictedContactMapProps) {
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

  public render() {
    const { data, ...passThroughProps } = this.props;
    const { pointsToPlot } = this.state;
    return (
      <div id="PredictedContactMapComponent">
        <ContactMap
          configurations={this.getContactMapConfigs()}
          data={{ computedPoints: pointsToPlot, secondaryStructures: data.secondaryStructures }}
          {...passThroughProps}
        />
      </div>
    );
  }

  protected getContactMapConfigs = (): IContactMapConfiguration[] => [
    {
      name: 'Linear Distance Filter (|i - j|)',
      onChange: this.onLinearDistFilterChange(),
      values: {
        default: initialPredictedContactMapState.linearDistFilter,
        max: 10,
        min: 1,
      },
    },
    {
      name: 'Top N Predictions to Show',
      onChange: this.onNumPredictionsToShowChange(),
      values: {
        default: initialPredictedContactMapState.numPredictionsToShow,
        max: 59,
        min: 1,
      },
    },
  ];
}

export const PredictedContactMap = withDefaultProps(defaultPredictedContactMapProps, PredictedContactMapClass);

export default PredictedContactMap;
