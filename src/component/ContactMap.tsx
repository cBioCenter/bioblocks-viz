import * as plotly from 'plotly.js/dist/plotly';
import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

import ResidueContext, { initialResidueContext, IResidueSelection } from '../context/ResidueContext';
import { IContactMapData, ICouplingScore, RESIDUE_TYPE } from '../data/chell-data';
import { withDefaultProps } from '../helper/ReactHelper';
import ContactMapChart, { generateChartDataEntry, IContactMapChartData } from './chart/ContactMapChart';
import ChellSlider from './ChellSlider';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

export const defaultContactMapProps = {
  correctColor: '#ff0000',
  data: {
    couplingScores: [],
    secondaryStructures: [],
  } as IContactMapData,
  enableSliders: false,
  height: 400,
  highlightColor: '#ff8800',
  incorrectColor: '#000000',
  ...initialResidueContext,
  observedColor: '#0000ff',
  padding: 0,
  width: 400,
};

export const initialContactMapState = {
  chainLength: 59,
  linearDistFilter: 5,
  measuredContactDistFilter: 5,
  numPredictionsToShow: 29,
  pointsToPlot: [] as IContactMapChartData[],
  showConfiguration: false,
};

export type ContactMapProps = {} & typeof defaultContactMapProps;
export type ContactMapState = Readonly<typeof initialContactMapState>;

export class ContactMapClass extends React.Component<ContactMapProps, ContactMapState> {
  public static getDerivedStateFromProps = (props: ContactMapProps, state: ContactMapState) => {
    const { correctColor, data, highlightColor, incorrectColor, observedColor, lockedResiduePairs } = props;
    const { chainLength, linearDistFilter, measuredContactDistFilter, numPredictionsToShow, pointsToPlot } = state;

    const observedContacts = ContactMapClass.getObservedContacts(data.couplingScores, measuredContactDistFilter);
    const allPredictions = ContactMapClass.getPredictedContacts(
      data.couplingScores,
      numPredictionsToShow,
      linearDistFilter,
    );

    const newPoints = [
      generateChartDataEntry(
        'x+y',
        { start: observedColor, end: 'rgb(100,177,200)' },
        'Observed',
        pointsToPlot[0] && pointsToPlot[0].nodeSize ? pointsToPlot[0].nodeSize : 4,
        observedContacts,
      ),
      generateChartDataEntry(
        'x+y',
        incorrectColor,
        `Predicted Contact (${chainLength})`,
        pointsToPlot[1] && pointsToPlot[1].nodeSize ? pointsToPlot[1].nodeSize : 4,
        allPredictions.predicted,
      ),
      generateChartDataEntry(
        'x+y',
        correctColor,
        'Correct Prediction',
        pointsToPlot[2] && pointsToPlot[2].nodeSize ? pointsToPlot[2].nodeSize : 6,
        allPredictions.correct,
      ),
      generateChartDataEntry(
        'none',
        highlightColor,
        'Selected Res. Pairs',
        pointsToPlot[3] && pointsToPlot[3].nodeSize ? pointsToPlot[3].nodeSize : 6,
        Object.keys(lockedResiduePairs as IResidueSelection)
          .filter(key => lockedResiduePairs[key].length === 2)
          .map(key => ({ i: lockedResiduePairs[key][0], j: lockedResiduePairs[key][1], dist: 0 })),
        {
          marker: {
            color: highlightColor,
            line: {
              color: highlightColor,
              width: 3,
            },
            symbol: 'circle-open',
          },
        },
      ),
    ] as IContactMapChartData[];

    return {
      chainLength: data.couplingScores.reduce((a, b) => Math.max(a, Math.max(b.i, b.j)), 0),
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

  public readonly state: ContactMapState = initialContactMapState;

  constructor(props: ContactMapProps) {
    super(props);
  }

  public shouldComponentUpdate(nextProps: ContactMapProps, nextState: ContactMapState) {
    const { data, lockedResiduePairs } = this.props;
    const { chainLength, linearDistFilter, numPredictionsToShow, pointsToPlot, showConfiguration } = this.state;

    let pointsUpdated = pointsToPlot.length !== nextState.pointsToPlot.length;
    if (!pointsUpdated) {
      for (let i = 0; i < pointsToPlot.length; ++i) {
        pointsUpdated = pointsUpdated || pointsToPlot[i].nodeSize !== nextState.pointsToPlot[i].nodeSize;
      }
    }
    return (
      chainLength !== nextState.chainLength ||
      pointsUpdated ||
      data !== nextProps.data ||
      linearDistFilter !== nextState.linearDistFilter ||
      lockedResiduePairs !== nextProps.lockedResiduePairs ||
      numPredictionsToShow !== nextState.numPredictionsToShow ||
      showConfiguration !== nextState.showConfiguration
    );
  }

  public componentDidUpdate(prevProps: ContactMapProps, prevState: ContactMapState) {
    const { clearAllResidues, data } = this.props;
    if (data !== prevProps.data) {
      clearAllResidues();
    }
  }

  public render() {
    const { padding, width } = this.props;
    const { chainLength, pointsToPlot } = this.state;

    const sliderStyle = { width: width * 0.9 };

    return (
      <div id="ContactMapComponent" style={{ padding }}>
        {this.renderContactMapChart(pointsToPlot)}
        {this.props.enableSliders && this.renderSliders(sliderStyle, pointsToPlot, chainLength)}
      </div>
    );
  }

  public onNodeSizeChange = (index: number) => (value: number) => {
    const { pointsToPlot } = this.state;
    this.setState({
      pointsToPlot: [
        ...pointsToPlot.slice(0, index),
        {
          ...pointsToPlot[index],
          nodeSize: value,
        },
        ...pointsToPlot.slice(index + 1),
      ],
    });
  };

  protected renderContactMapChart(data: IContactMapChartData[]) {
    const { addHoveredResidues, candidateResidues, hoveredResidues, toggleLockedResiduePair } = this.props;
    const { chainLength } = this.state;

    return (
      <ContactMapChart
        candidateResidues={candidateResidues}
        data={data}
        hoveredResidues={hoveredResidues}
        onClickCallback={this.onMouseClick(toggleLockedResiduePair)}
        onHoverCallback={this.onMouseEnter(addHoveredResidues)}
        onSelectedCallback={this.onMouseSelect()}
        range={[0, chainLength + 5]}
      />
    );
  }

  protected renderSliders(
    sliderStyle: React.CSSProperties[] | React.CSSProperties,
    entries: IContactMapChartData[],
    chainLength: number,
  ) {
    const { showConfiguration } = this.state;
    return (
      <Accordion fluid={true} styled={true}>
        <Accordion.Title
          active={showConfiguration}
          className={'contact-map-configuration-toggle'}
          index={1}
          onClick={this.onShowConfigurationToggle()}
        >
          <Icon name="dropdown" />
          Configuration
        </Accordion.Title>
        <Accordion.Content active={showConfiguration}>
          {this.renderNodeSizeSliders(sliderStyle, entries)}
          <ChellSlider
            className={'linear-dist-filter'}
            defaultValue={initialContactMapState.linearDistFilter}
            label={'Linear Distance Filter (|i - j|)'}
            max={10}
            min={1}
            onChange={this.onLinearDistFilterChange()}
            style={sliderStyle}
          />
          <ChellSlider
            className={'predicted-contact-slider'}
            defaultValue={initialContactMapState.numPredictionsToShow}
            label={'Top N Predictions to Show'}
            max={59}
            min={1}
            onChange={this.onNumPredictionsToShowChange()}
            style={sliderStyle}
          />
        </Accordion.Content>
      </Accordion>
    );
  }

  protected renderNodeSizeSliders(
    sliderStyle: React.CSSProperties[] | React.CSSProperties,
    entries: IContactMapChartData[],
  ) {
    return entries.map((entry, index) => {
      const key = `node-size-slider-${index}`;
      return (
        <ChellSlider
          className={key}
          key={key}
          defaultValue={entry.nodeSize}
          label={`${entry.name} Node Size`}
          max={20}
          min={1}
          onChange={this.onNodeSizeChange(index)}
          style={sliderStyle}
        />
      );
    });
  }

  protected onLinearDistFilterChange = () => (value: number) => {
    this.setState({
      linearDistFilter: value,
    });
  };

  protected onNumPredictionsToShowChange = () => (value: number) => {
    this.setState({
      numPredictionsToShow: value,
    });
  };

  protected onShowConfigurationToggle = () => () => this.setState({ showConfiguration: !this.state.showConfiguration });

  protected onMouseEnter = (cb: (residue: RESIDUE_TYPE[]) => void) => (e: plotly.PlotMouseEvent) => {
    const { points } = e;
    cb([points[0].x, points[0].y]);
  };

  protected onMouseClick = (cb: (residues: RESIDUE_TYPE[]) => void) => (e: plotly.PlotMouseEvent) => {
    const { points } = e;
    cb([points[0].x, points[0].y]);
  };

  protected onMouseSelect = () => (e: plotly.PlotSelectionEvent) => {
    console.log(`onMouseSelect: ${e}`);
  };
}

export const ContactMapWithDefaultProps = withDefaultProps(defaultContactMapProps, ContactMapClass);

// TODO The required props should be discernable from `withDefaultProps` without needing to duplicate.
// However the Context consumer syntax is still new to me and I can't find the right combination :(
type requiredProps = Partial<typeof defaultContactMapProps> &
  Required<Omit<ContactMapProps, keyof typeof defaultContactMapProps>>;

const ContactMap = (props: requiredProps) => (
  <ResidueContext.Consumer>{context => <ContactMapWithDefaultProps {...props} {...context} />}</ResidueContext.Consumer>
);

export default ContactMap;
export { ContactMap };
