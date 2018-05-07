import * as React from 'react';
import CellContext from '../context/CellContext';
import { T_SNE_DATA_TYPE } from '../data/chell-data';
import PlotlyChart, { defaultConfig, defaultLayout } from '../helper/PlotlyHelper';
import { withDefaultProps } from '../helper/ReactHelper';

export const defaultTComponentProps = {
  data: [[0], [0]] as T_SNE_DATA_TYPE,
  height: 400,
  padding: 0,
  pointColor: '#000000',
  width: 400,
};

export type TComponentProps = {} & typeof defaultTComponentProps;

const TComponent = withDefaultProps(
  defaultTComponentProps,
  class TComponentClass extends React.Component<TComponentProps, any> {
    constructor(props: TComponentProps) {
      super(props);
      this.state = {
        ...this.state,
      };
    }

    public render() {
      const { data, height, padding, pointColor, width } = this.props;
      const coords = new Float32Array(data.length * 2);
      data.forEach((ele, index) => {
        coords[index * 2] = ele[0];
        coords[index * 2 + 1] = ele[1];
      });

      return (
        <div id="TComponent" style={{ padding }}>
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
      if (e.points) {
        cb(e.points.map(point => point.pointNumber));
      }
    };
  },
);

export default TComponent;
export { TComponent };
