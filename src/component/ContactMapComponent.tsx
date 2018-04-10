import * as React from 'react';
import { CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';

export type CONTACT_MAP_DATA_TYPE = IContactMapData;

export interface IContactMapData {
  contactMonomer: IMonomerContact[];
  couplingScore: ICouplingScore[];
  distanceMapMonomer: IDistanceMapMonomer[];
}

export interface IMonomerContact {
  i: number;
  j: number;
  dist: number;
}

export interface ICouplingScore {
  i: number;
  A_i: string;
  j: number;
  A_j: string;
  fn: number;
  cn: number;
  segment_i: string;
  segment_j: string;
  probability: number;
  dist_intra: number;
  dist_multimer: number;
  dist: number;
  precision: number;
}

export interface IDistanceMapMonomer {
  id: number;
  sec_struct_3state: string;
}

export interface IContactMapComponentProps {
  data: CONTACT_MAP_DATA_TYPE;
}

const initialState = { min_x: 1000, max_x: 0, probabilityFilter: 0.99 };

type State = Readonly<typeof initialState>;

export class ContactMapComponent extends React.Component<IContactMapComponentProps, State> {
  public readonly state: State = initialState;

  constructor(props: IContactMapComponentProps) {
    super(props);
  }

  public componentDidUpdate(prevProps: IContactMapComponentProps, prevState: any) {
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
      <ScatterChart width={400} height={400}>
        <XAxis type="number" dataKey={'i'} orientation={'top'} domain={domain} />
        <YAxis type="number" dataKey={'j'} reversed={true} domain={domain} />}
        <ZAxis dataKey="dist" />
        <CartesianGrid />
        <Legend layout={'vertical'} align={'right'} />
        <Tooltip />
        <Scatter name="contacts_monomer" data={data.contactMonomer} fill="#009999" />
        <Scatter
          name="CouplingScoresCompared"
          data={data.couplingScore.filter(coupling => coupling.probability > this.state.probabilityFilter)}
          fill="#000000"
          onMouseEnter={this.onMouseEnter()}
        />
      </ScatterChart>
    ) : null;
  }

  protected onClick = () => (e: any) => {
    console.log(`Variable 'e':\n${e}\n${JSON.stringify(e, null, 2)}`);
  };

  protected onMouseEnter = () => (e: { payload: ICouplingScore }) => {
    const { payload } = e;
    const coupling = this.props.data.couplingScore.find(ele => ele.i === payload.i);
    const monomer = this.props.data.distanceMapMonomer.find(ele => ele.id === payload.i);

    console.log(`Variable 'coupling':\n${coupling}\n${JSON.stringify(coupling, null, 2)}`);
    console.log(`Variable 'monomer':\n${monomer}\n${JSON.stringify(monomer, null, 2)}`);
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
}
