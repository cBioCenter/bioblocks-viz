import * as React from 'react';
import { CartesianGrid, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';

import { CONTACT_MAP_DATA_TYPE, ICouplingScore } from 'chell';
import { withDefaultProps } from '../helper/ReactHelper';
import { ChellSlider } from './ChellSlider';

export type ContactMapCallback = (...args: any[]) => void;

const defaultProps = {
  data: {
    contactMonomer: [],
    couplingScore: [],
    distanceMapMonomer: [],
  } as CONTACT_MAP_DATA_TYPE,
  onClick: undefined as ContactMapCallback | undefined,
  onMouseEnter: undefined as ContactMapCallback | undefined,
};
const initialState = { min_x: 1000, max_x: 0, probabilityFilter: 0.99 };

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
      if (data !== prevProps.data) {
        let max = this.state.max_x;
        let min = this.state.min_x;
        for (const contact of data.contactMonomer) {
          max = Math.max(max, contact.i);
          min = Math.min(min, contact.i);
        }
        this.setState({
          max_x: max,
          min_x: min,
        });
      }
    }

    public render() {
      const { data } = this.props;
      const domain = [Math.max(0, this.state.min_x - 5), this.state.max_x + 5];
      return data ? (
        <div>
          <ScatterChart width={400} height={400}>
            <XAxis type="number" dataKey={'i'} orientation={'top'} domain={domain} />
            <YAxis type="number" dataKey={'j'} reversed={true} domain={domain} />}
            <ZAxis dataKey="dist" />
            <CartesianGrid />
            <Tooltip />
            <Scatter name="contacts_monomer" data={data.contactMonomer} fill="#009999" onClick={this.onClick()} />
            <Scatter
              name="CouplingScoresCompared"
              data={data.couplingScore.filter(coupling => coupling.probability > this.state.probabilityFilter)}
              fill="#000000"
              onClick={this.onClick()}
              onMouseEnter={this.onMouseEnter()}
            />
          </ScatterChart>
          <ChellSlider
            max={100}
            min={0}
            label={'Probability'}
            defaultValue={99}
            onChange={this.onProbabilityChange()}
          />
        </div>
      ) : null;
    }

    protected onClick = () => (...args: any[]) => {
      if (this.props.onClick) {
        this.props.onClick(args);
      }
    };

    protected onProbabilityChange = () => (value: number) => {
      this.setState({
        probabilityFilter: value / 100,
      });
    };

    protected onMouseEnter = () => (e: { [key: string]: any; payload: ICouplingScore }) => {
      const { payload } = e;
      const { data, onMouseEnter } = this.props;
      const coupling = data.couplingScore.find(ele => ele.i === payload.i);
      const monomer = data.distanceMapMonomer.find(ele => ele.id === payload.i);

      console.log(`Variable 'coupling':\n${coupling}\n${JSON.stringify(coupling, null, 2)}`);
      console.log(`Variable 'monomer':\n${monomer}\n${JSON.stringify(monomer, null, 2)}`);
      const fullSeq = 'MALLHSARVLSGVASAFHPGLAAAASARASSWWAHVEMGPPDPILGVTEAYKRDTNSKKM';
      const nglSeq = fullSeq.substr(8, 50);
      console.log(fullSeq);
      console.log(nglSeq);
      console.log(fullSeq[payload.i]);
      console.log(fullSeq[payload.j]);
      console.log(nglSeq[payload.i - 8]);
      console.log(nglSeq[payload.j - 8]);
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
