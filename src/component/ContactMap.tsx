import * as Plotly from 'plotly.js';
import * as React from 'react';

import ResidueContext, { initialResidueContext, IResidueSelection } from '../context/ResidueContext';
import { CONTACT_VIEW_TYPE, IContactMapData, ICouplingScore, RESIDUE_TYPE } from '../data/chell-data';
import { withDefaultProps } from '../helper/ReactHelper';
import ContactMapChart from './chart/ContactMapChart';
import ChellSlider from './ChellSlider';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

export const defaultContactMapProps = {
  correctColor: '#ff0000',
  data: {
    couplingScores: [],
  } as IContactMapData,
  enableSliders: false,
  height: 400,
  highlightColor: '#ffff00',
  incorrectColor: '#000000',
  ...initialResidueContext,
  observedColor: '#0000ff',
  padding: 0,
  width: 400,
};

export const initialContactMapState = {
  chainLength: 59,
  contactViewType: CONTACT_VIEW_TYPE.BOTH,
  correctPredictedContacts: [] as ICouplingScore[],
  incorrectPredictedContacts: [] as ICouplingScore[],
  linearDistFilter: 5,
  nodeSize: 3,
  observedContacts: [] as ICouplingScore[],
  predictedContactCount: 29,
  predictionCutoffDist: 5,
};

export type ContactMapProps = {} & typeof defaultContactMapProps;
export type ContactMapState = Readonly<typeof initialContactMapState>;

export class ContactMapClass extends React.Component<ContactMapProps, ContactMapState> {
  public readonly state: ContactMapState = initialContactMapState;

  constructor(props: ContactMapProps) {
    super(props);
  }

  public componentDidMount() {
    this.setupData(this.props.data, this.state.contactViewType);
  }

  public componentDidUpdate(prevProps: ContactMapProps, prevState: ContactMapState) {
    const { data } = this.props;
    const { contactViewType } = this.state;

    const isFreshDataView =
      data !== prevProps.data ||
      contactViewType !== prevState.contactViewType ||
      this.state.linearDistFilter !== prevState.linearDistFilter ||
      this.state.predictedContactCount !== prevState.predictedContactCount ||
      this.state.chainLength !== prevState.chainLength;

    if (isFreshDataView) {
      this.setupData(data, contactViewType);
    }
  }

  public render() {
    const {
      correctColor,
      highlightColor,
      incorrectColor,
      observedColor,
      padding,
      width,
      addLockedResiduePair,
      addHoveredResidues,
      candidateResidues,
      hoveredResidues,
      lockedResiduePairs,
    } = this.props;

    const {
      chainLength,
      correctPredictedContacts,
      incorrectPredictedContacts,
      nodeSize,
      observedContacts,
    } = this.state;

    const sliderStyle = { width: width * 0.9 };

    const inputData = [
      {
        color: observedColor,
        hoverinfo: 'x+y',
        name: 'Observed',
        points: observedContacts,
      },
      {
        color: incorrectColor,
        name: 'Incorrect Prediction',
        points: incorrectPredictedContacts,
      },
      {
        color: correctColor,
        name: 'Correct Prediction',
        points: correctPredictedContacts,
      },
      {
        color: highlightColor,
        name: 'Locked Residue',
        points: lockedResiduePairs
          ? Object.keys(lockedResiduePairs as IResidueSelection)
              .filter(key => lockedResiduePairs[key].length === 2)
              .map(key => ({ i: lockedResiduePairs[key][0], j: lockedResiduePairs[key][1] }))
          : [],
      },
    ];

    return (
      <div id="ContactMapComponent" style={{ padding }}>
        <ContactMapChart
          candidateResidues={candidateResidues}
          data={inputData}
          hoveredResidues={hoveredResidues}
          nodeSize={nodeSize}
          onClickCallback={this.onMouseClick(addLockedResiduePair)}
          onHoverCallback={this.onMouseEnter(addHoveredResidues)}
          onSelectedCallback={this.onMouseSelect()}
          range={[0, chainLength]}
        />
        {this.props.enableSliders && this.renderSliders(sliderStyle, chainLength)}
      </div>
    );
  }

  protected renderSliders(sliderStyle: React.CSSProperties[] | React.CSSProperties, chainLength: number) {
    return (
      <div>
        <ChellSlider
          className={'node-size-slider'}
          defaultValue={initialContactMapState.nodeSize}
          label={'Node Size'}
          max={5}
          min={1}
          onChange={this.onNodeSizeChange()}
          style={sliderStyle}
        />
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
          className={'prediction-cutoff-filter'}
          defaultValue={5}
          label={'Prediction Cutoff Dist (Correct/Incorrect)'}
          max={20}
          min={1}
          onChange={this.onPredictionCutoffDistChange()}
          style={sliderStyle}
        />
        <ChellSlider
          className={'predicted-contact-slider'}
          defaultValue={initialContactMapState.predictedContactCount}
          label={'# Predicted Contacts to Show (L)'}
          max={59}
          min={1}
          onChange={this.onPredictedContactCountChange()}
          sliderProps={
            {
              /*marks: {
              1: 'One',
              [Math.floor(chainLength / 2)]: `Half (${Math.floor(chainLength / 2)})`,
              [chainLength]: `All (${chainLength})`,
            },*/
            }
          }
          style={sliderStyle}
        />
        <ChellSlider
          className={'contact-view-slider'}
          defaultValue={initialContactMapState.contactViewType}
          hideLabelValue={true}
          label={'What to show?'}
          max={2}
          min={0}
          onChange={this.onContactViewChange()}
          sliderProps={{
            marks: { 0: 'Observed', 1: 'Both', 2: 'Predicted' },
          }}
          style={sliderStyle}
        />
      </div>
    );
  }

  /**
   * Parse the incoming data object to determine which contacts to show and if they are correct/incorrect.
   *
   * @param data Incoming data object which has an array of all observed contacts.
   * @param contactViewType Whether to only show observed, predicted, or both kinds of contacts.
   */
  protected setupData(data: IContactMapData, contactViewType: CONTACT_VIEW_TYPE) {
    const showObserved = contactViewType === CONTACT_VIEW_TYPE.BOTH || contactViewType === CONTACT_VIEW_TYPE.OBSERVED;
    const showPredicted = contactViewType === CONTACT_VIEW_TYPE.BOTH || contactViewType === CONTACT_VIEW_TYPE.PREDICTED;
    const chainLength = data.couplingScores.reduce((a, b) => Math.max(a, Math.max(b.i, b.j)), 0);

    const { linearDistFilter, predictedContactCount, predictionCutoffDist } = this.state;

    const observedContacts: ICouplingScore[] = [];
    const correctPredictedContacts: ICouplingScore[] = [];
    const incorrectPredictedContacts: ICouplingScore[] = [];

    for (const contact of data.couplingScores
      .filter(score => Math.abs(score.i - score.j) >= linearDistFilter)
      .slice(0, predictedContactCount)) {
      if (showPredicted) {
        if (contact.dist < predictionCutoffDist) {
          correctPredictedContacts.push(contact);
        } else {
          incorrectPredictedContacts.push(contact);
        }
      }
      if (showObserved) {
        observedContacts.push(contact);
      }
    }

    this.setState({
      chainLength,
      correctPredictedContacts,
      incorrectPredictedContacts,
      observedContacts,
    });
  }

  protected onContactViewChange = () => (value: number) => {
    this.setState({
      contactViewType: value,
    });
  };

  protected onLinearDistFilterChange = () => (value: number) => {
    this.setState({
      linearDistFilter: value,
    });
  };

  protected onNodeSizeChange = () => (value: number) => {
    this.setState({
      nodeSize: value,
    });
  };

  protected onPredictedContactCountChange = () => (value: number) => {
    this.setState({
      predictedContactCount: value,
    });
  };

  protected onPredictionCutoffDistChange = () => (value: number) => {
    this.setState({
      predictionCutoffDist: value,
    });
  };

  protected onMouseEnter = (cb: (residue: RESIDUE_TYPE[]) => void) => (e: Plotly.PlotMouseEvent) => {
    const { points } = e;
    cb([points[0].x, points[0].y]);
  };

  protected onMouseClick = (cb: (residues: RESIDUE_TYPE[]) => void) => (e: Plotly.PlotMouseEvent) => {
    const { points } = e;
    cb([points[0].x, points[0].y]);
  };

  protected onMouseSelect = () => (e: Plotly.PlotSelectionEvent) => {
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
