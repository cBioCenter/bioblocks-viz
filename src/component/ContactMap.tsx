import * as React from 'react';

import { IContactMapData, ICouplingScore, RESIDUE_TYPE } from '../../types/chell';
import ResidueContext, { IResidueSelection } from '../context/ResidueContext';
import PlotlyChart, { defaultConfig, defaultLayout, generatePointCloudData } from '../helper/PlotlyHelper';
import { withDefaultProps } from '../helper/ReactHelper';
import ChellSlider from './ChellSlider';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

const defaultProps = {
  contactColor: '#009999',
  couplingColor: '#000000',
  data: {
    contactMonomer: [],
    couplingScore: [],
    distanceMapMonomer: [],
  } as IContactMapData,
  enableSliders: false,
  height: 400,
  highlightColor: '#0000ff',
  onClick: undefined as ContactMapCallback | undefined,
  onMouseEnter: undefined as ContactMapCallback | undefined,
  padding: 0,
  selectedData: undefined as number | undefined,
  width: 400,
};

const initialState = {
  contactPoints: new Float32Array(0),
  couplingPoints: new Float32Array(0),
  highlightedPoints: new Float32Array(0),
  nodeSize: 4,
  probabilityFilter: 0.99,
};

type Props = {} & typeof defaultProps;
type State = Readonly<typeof initialState>;

export class ContactMapComponent extends React.Component<Props, State> {
  public readonly state: State = initialState;

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.setupData(data);
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const { data } = this.props;
    const isFreshDataView = data !== prevProps.data || this.state.probabilityFilter !== prevState.probabilityFilter;
    if (isFreshDataView) {
      this.setupData(data);
    }
  }

  public render() {
    const { contactColor, couplingColor, height, highlightColor, padding, width } = this.props;
    const { contactPoints, couplingPoints } = this.state;

    return (
      <ResidueContext.Consumer>
        {({
          addLockedResiduePair,
          addHoveredResidues,
          candidateResidues,
          hoveredResidues,
          lockedResiduePairs,
          removeLockedResiduePair,
        }) => (
          <div id="ContactMapComponent" style={{ padding }}>
            <PlotlyChart
              config={{
                ...defaultConfig,
              }}
              data={[
                generatePointCloudData(contactPoints, contactColor, this.state.nodeSize),
                generatePointCloudData(couplingPoints, couplingColor, this.state.nodeSize),
                generatePointCloudData(
                  this.getHighlightedResidues(lockedResiduePairs),
                  highlightColor,
                  this.state.nodeSize,
                ),
              ]}
              layout={{
                ...defaultLayout,
                height,
                width,
                xaxis: {
                  ...defaultLayout.xaxis,
                  gridcolor: '#ff0000',
                  gridwidth: this.state.nodeSize,
                  showticklabels: false,
                  tickvals: [...candidateResidues, ...hoveredResidues],
                },
                yaxis: {
                  ...defaultLayout.yaxis,
                  gridcolor: '#ff0000',
                  gridwidth: this.state.nodeSize,
                  showticklabels: false,
                  tickvals: [...candidateResidues, ...hoveredResidues],
                },
              }}
              onHoverCallback={this.onMouseEnter(addHoveredResidues)}
              onClickCallback={this.onMouseClick(addLockedResiduePair)}
              onSelectedCallback={this.onMouseSelect()}
            />
            {this.props.enableSliders && this.renderSliders()}
          </div>
        )}
      </ResidueContext.Consumer>
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

    const contactPoints = new Float32Array(data.contactMonomer.length * 2);
    data.contactMonomer.forEach((contact, index) => {
      contactPoints[index * 2] = contact.i;
      contactPoints[index * 2 + 1] = contact.j;
    });

    const couplingPoints = new Float32Array(blackDots.length * 2);
    blackDots.forEach((coupling, index) => {
      couplingPoints[index * 2] = coupling.i;
      couplingPoints[index * 2 + 1] = coupling.j;
    });

    this.setState({
      contactPoints,
      couplingPoints,
    });
  }

  protected getHighlightedResidues(pairs: IResidueSelection): Float32Array {
    const pairKeys = Object.keys(pairs);
    const highlightedPoints: number[] = [];
    for (const key of pairKeys) {
      for (const residue of pairs[key]) {
        highlightedPoints.push(residue);
      }
    }
    return new Float32Array([...highlightedPoints, ...highlightedPoints.slice().reverse()]);
  }

  protected onClick = () => (coupling: ICouplingScore) => {
    if (this.props.onClick) {
      this.props.onClick(coupling);
    }
  };

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

const ContactMap = withDefaultProps(defaultProps, ContactMapComponent);

export default ContactMap;
export { ContactMap };
