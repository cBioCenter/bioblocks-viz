import { T_SNE_DATA_TYPE } from 'chell';
import * as React from 'react';

import { defaultConfig, defaultLayout, generatePointCloudData, PlotlyChart } from '../helper/PlotlyHelper';
import { withDefaultProps } from '../helper/ReactHelper';

const defaultProps = {
  data: [[0], [0]] as T_SNE_DATA_TYPE,
  height: 450,
  pointColor: '#000000',
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
      const { data, height, pointColor, width } = this.props;
      const coords = new Float32Array(data.length * 2);
      data.forEach((ele, index) => {
        coords[index * 2] = ele[0];
        coords[index * 2 + 1] = ele[1];
      });

      return (
        <div id="TComponent" style={{ height, padding: 15, width }}>
          <PlotlyChart
            config={defaultConfig}
            data={[generatePointCloudData(coords, pointColor, 10)]}
            layout={{
              ...defaultLayout,
              height,
              width,
              yaxis: {
                autorange: true,
              },
            }}
          />
        </div>
      );
    }
  },
);
