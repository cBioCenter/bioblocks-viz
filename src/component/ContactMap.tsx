import * as Plotly from 'plotly.js';
import * as React from 'react';
// import { Checkbox } from 'semantic-ui-react';

import ResidueContext, { initialResidueContext, IResidueSelection } from '../context/ResidueContext';
import { IContactMapData, ICouplingScore, IMonomerContact, RESIDUE_TYPE } from '../data/chell-data';
import { withDefaultProps } from '../helper/ReactHelper';
import ChellSlider from './ChellSlider';
import ScatterChart from './ScatterChart';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

export const defaultContactMapProps = {
  contactColor: '#009999',
  couplingColor: '#000000',
  data: {
    contactMonomer: [],
    couplingScore: [],
    distanceMapMonomer: [],
    observedMonomer: [],
  } as IContactMapData,
  enableSliders: false,
  height: 400,
  highlightColor: '#0000ff',
  ...initialResidueContext,
  observedColor: '#ff8800',
  onClick: undefined as ContactMapCallback | undefined,
  onMouseEnter: undefined as ContactMapCallback | undefined,
  padding: 0,
  selectedData: undefined as number | undefined,
  width: 400,
};

export const initialContactMapState = {
  contactPoints: [] as IMonomerContact[],
  couplingPoints: [] as ICouplingScore[],
  highlightedPoints: [] as number[],
  // contactPoints: new Float32Array(0),
  // couplingPoints: new Float32Array(0),
  // highlightedPoints: new Float32Array(0),
  nodeSize: 4,
  // observedPoints: new Float32Array(0),
  observedPoints: [] as IMonomerContact[],
  probabilityFilter: 0.99,
};

export type ContactMapProps = {} & typeof defaultContactMapProps;
export type ContactMapState = Readonly<typeof initialContactMapState>;

export class ContactMapClass extends React.Component<ContactMapProps, ContactMapState> {
  public readonly state: ContactMapState = initialContactMapState;

  constructor(props: ContactMapProps) {
    super(props);
  }

  public componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.setupData(data);
    }
  }

  public componentDidUpdate(prevProps: ContactMapProps, prevState: ContactMapState) {
    const { data, lockedResiduePairs } = this.props;
    const isFreshDataView = data !== prevProps.data || this.state.probabilityFilter !== prevState.probabilityFilter;
    if (isFreshDataView) {
      this.setupData(data);
    }

    if (lockedResiduePairs && prevProps.lockedResiduePairs !== lockedResiduePairs) {
      this.setupHighlightedResidues(lockedResiduePairs);
    }
  }

  public render() {
    const {
      contactColor,
      couplingColor,
      height,
      // highlightColor,
      observedColor,
      padding,
      width,
      addLockedResiduePair,
      addHoveredResidues,
      candidateResidues,
      hoveredResidues,
      // lockedResiduePairs,
    } = this.props;

    const { contactPoints, couplingPoints, nodeSize, observedPoints } = this.state;

    const inputData = [
      {
        color: contactColor,
        points: contactPoints,
      },
      {
        color: couplingColor,
        points: couplingPoints,
      },
      {
        color: observedColor,
        points: observedPoints,
      },
    ];

    return (
      <div id="ContactMapComponent" style={{ padding }}>
        <ScatterChart
          candidateResidues={candidateResidues}
          height={height}
          hoveredResidues={hoveredResidues}
          inputData={inputData}
          nodeSize={nodeSize}
          onHoverCallback={this.onMouseEnter(addHoveredResidues)}
          onClickCallback={this.onMouseClick(addLockedResiduePair)}
          onSelectedCallback={this.onMouseSelect()}
          width={width}
        />
        {this.props.enableSliders && this.renderSliders()}
        {/* <Checkbox toggle={true} onChange={this.onRendererChange()} /> */}
      </div>
    );
  }

  protected renderSliders() {
    const { width } = this.props;
    const sliderStyle = { width };
    return (
      <div>
        <ChellSlider
          max={100}
          min={0}
          label={'Probability'}
          defaultValue={99}
          onChange={this.onProbabilityChange()}
          style={sliderStyle}
        />
        <ChellSlider
          max={5}
          min={1}
          label={'Node Size'}
          defaultValue={this.state.nodeSize}
          onChange={this.onNodeSizeChange()}
          style={sliderStyle}
        />
      </div>
    );
  }

  protected setupData(data: IContactMapData) {
    const blackDots = new Array<ICouplingScore>();
    data.couplingScore.filter(coupling => coupling.probability >= this.state.probabilityFilter).forEach(coupling => {
      blackDots.push(coupling);
      blackDots.push({
        ...coupling,
        i: coupling.j,
        // tslint:disable-next-line:object-literal-sort-keys
        A_i: coupling.A_j,
        j: coupling.i,
        A_j: coupling.A_i,
      });
    });

    this.setState({
      contactPoints: data.contactMonomer,
      couplingPoints: data.couplingScore.filter(coupling => coupling.probability >= this.state.probabilityFilter),
      observedPoints: data.observedMonomer,
    });
  }

  protected setupHighlightedResidues(pairs: IResidueSelection) {
    const pairKeys = Object.keys(pairs);
    const highlightedPoints: number[] = [];
    for (const key of pairKeys) {
      for (const residue of pairs[key]) {
        highlightedPoints.push(residue);
      }
    }

    this.setState({
      highlightedPoints,
    });
  }

  protected onProbabilityChange = () => (value: number) => {
    this.setState({
      probabilityFilter: value / 100,
    });
  };

  protected onNodeSizeChange = () => (value: number) => {
    this.setState({
      nodeSize: value,
    });
  };

  protected onRendererChange = () => (value: any) => {
    console.log(value);
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
