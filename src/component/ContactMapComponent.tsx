import * as React from 'react';
import { Dot, ReferenceLine, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

import { CONTACT_MAP_DATA_TYPE, ICouplingScore } from 'chell';
import { withDefaultProps } from '../helper/ReactHelper';
import { ChellSlider } from './ChellSlider';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

const defaultProps = {
  data: {
    contactMonomer: [],
    couplingScore: [],
    distanceMapMonomer: [],
  } as CONTACT_MAP_DATA_TYPE,
  onClick: undefined as ContactMapCallback | undefined,
  onMouseEnter: undefined as ContactMapCallback | undefined,
  selectedData: undefined as number | undefined,
};
const initialState = { min_x: 1000, max_x: 0, nodeSize: 4, probabilityFilter: 0.99 };

type Props = {} & typeof defaultProps;
type State = Readonly<typeof initialState>;

export const ContactMapComponent = withDefaultProps(
  defaultProps,
  class ContactMapComponentClass extends React.Component<Props, State> {
    public readonly state: State = initialState;

    constructor(props: Props) {
      super(props);
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
      const { data } = this.props;
      const isFreshDataView = data !== prevProps.data || this.state.probabilityFilter !== prevState.probabilityFilter;
      if (isFreshDataView) {
        let max = initialState.max_x;
        let min = initialState.min_x;
        data.contactMonomer.forEach(contact => {
          max = Math.max(max, contact.i);
          min = Math.min(min, contact.i);
        });
        data.couplingScore
          .filter(coupling => coupling.probability >= this.state.probabilityFilter)
          .forEach(coupling => {
            max = Math.max(max, coupling.i);
            min = Math.min(min, coupling.i);
          });
        this.setState({
          max_x: max,
          min_x: min,
        });
      }
    }

    public render() {
      const { data, selectedData } = this.props;
      const minOffset = this.state.min_x - 5 - this.state.min_x % 5;
      const maxOffset = this.state.max_x + 5 + this.state.max_x % 5;
      const domain = [Math.max(0, minOffset), maxOffset];
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
      return data ? (
        <div>
          <ScatterChart width={400} height={400}>
            <XAxis type="number" dataKey={'i'} orientation={'top'} domain={domain} />
            <YAxis type="number" dataKey={'j'} reversed={true} domain={domain} />
            {selectedData && <ReferenceLine x={selectedData} stroke={'#ff0000'} />}
            {selectedData && <ReferenceLine y={selectedData} stroke={'#ff0000'} />}
            <Scatter
              name="contacts_monomer"
              data={data.contactMonomer}
              fill="#009999"
              onClick={this.onClick()}
              shape={<Dot r={this.state.nodeSize} />}
            />
            <Scatter
              name="CouplingScoresCompared"
              data={blackDots}
              fill="#000000"
              onClick={this.onClick()}
              onMouseEnter={this.onMouseEnter()}
              shape={<Dot r={this.state.nodeSize} />}
            />
            <Tooltip />
          </ScatterChart>
          <ChellSlider
            max={100}
            min={0}
            label={'Probability'}
            defaultValue={99}
            onChange={this.onProbabilityChange()}
          />
          <ChellSlider
            max={5}
            min={1}
            label={'Node Size'}
            defaultValue={this.state.nodeSize}
            onChange={this.onNodeSizeChange()}
          />
        </div>
      ) : null;
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

    protected onMouseEnter = () => (e: { [key: string]: any; payload: ICouplingScore }) => {
      const { payload } = e;
      const { onMouseEnter } = this.props;

      if (onMouseEnter) {
        onMouseEnter(payload);
      }
    };

    /*
  Exposed recharts mouse events to potentially become props:
  - onMouseDown
  - onMouseUp
  - onMouseMove
  - onMouseOut
  - onMouseOver
  - onMouseLeave
  */
  },
);
