import { T_SNE_DATA_TYPE } from 'chell';
import * as React from 'react';
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import { withDefaultProps } from '../helper/ReactHelper';

const defaultProps = {
  data: [[0], [0]] as T_SNE_DATA_TYPE,
  height: 450,
  width: 450,
};

const initialState = {
  chartHeight: 0,
  chartWidth: 0,
};

type Props = {} & typeof defaultProps;
type State = typeof initialState;

export const TComponent = withDefaultProps(
  defaultProps,
  class TComponentClass extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        ...this.state,
        chartHeight: Math.floor(0.9 * this.props.height),
        chartWidth: Math.floor(0.9 * this.props.width),
      };
    }

    public render() {
      const { data, height, width } = this.props;
      return (
        <div id="TComponent" style={{ height, padding: 15, width }}>
          <ScatterChart height={this.state.chartHeight} width={this.state.chartHeight}>
            <XAxis type="number" dataKey={'x'} />
            <YAxis type="number" dataKey={'y'} />
            <CartesianGrid />
            <Scatter
              data={
                data
                  ? data.map(ele => {
                      return { x: ele[0], y: ele[1] };
                    })
                  : []
              }
            />
          </ScatterChart>
        </div>
      );
    }
  },
);
