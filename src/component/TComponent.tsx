import { T_SNE_DATA_TYPE } from 'chell';
import * as React from 'react';

import { CellContext } from '../context/CellContext';
import { defaultConfig, defaultLayout, PlotlyChart } from '../helper/PlotlyHelper';
import { withDefaultProps } from '../helper/ReactHelper';

const defaultProps = {
  data: [[0], [0]] as T_SNE_DATA_TYPE,
  height: 400,
  pointColor: '#000000',
  width: 400,
};
type Props = {} & typeof defaultProps;

export const TComponent = withDefaultProps(
  defaultProps,
  class TComponentClass extends React.Component<Props, any> {
    constructor(props: Props) {
      super(props);
      this.state = {
        ...this.state,
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
        <div id="TComponent" style={{ padding: 10 }}>
          <CellContext.Consumer>
            {({ addCells }) => (
              <PlotlyChart
                config={{
                  ...defaultConfig,
                  modeBarButtons: [['zoomOut2d', 'zoomIn2d'], ['resetScale2d', 'autoScale2d'], ['select2d', 'pan2d']],
                }}
                data={[
                  {
                    marker: {
                      color: pointColor,
                    },
                    mode: 'markers',
                    type: 'scatter',
                    x: data.map(ele => ele[0]),
                    xaxis: 'x',
                    y: data.map(ele => ele[1]),
                    yaxis: 'y',
                  },
                ]}
                layout={{
                  ...defaultLayout,
                  height,
                  width,
                  yaxis: {
                    autorange: true,
                  },
                }}
                onSelectedCallback={this.onMouseSelect(addCells)}
              />
            )}
          </CellContext.Consumer>
        </div>
      );
    }

    protected onMouseSelect = (cb: (cells: number[]) => void) => (e: Plotly.PlotSelectionEvent) => {
      cb(e.points.map(point => point.pointNumber));
    };
  },
);
