import memoizeOne from 'memoize-one';
import * as React from 'react';

import CellContext, { ICellContext, initialCellContext } from '../context/CellContext';
import { T_SNE_DATA_TYPE } from '../data/chell-data';
import ChellChartEvent from '../data/event/ChellChartEvent';
import PlotlyChart, { defaultPlotlyConfig, defaultPlotlyLayout } from './chart/PlotlyChart';

export interface ITComponentProps {
  cellContext: ICellContext;
  data: T_SNE_DATA_TYPE;
  height: number;
  padding: number | string;
  pointColor: string;
  width: number;
}

class TComponentClass extends React.Component<ITComponentProps, any> {
  public static defaultProps = {
    cellContext: {
      ...initialCellContext,
    },
    data: [[0], [0]],
    height: 400,
    padding: 0,
    pointColor: '#000000',
    width: 400,
  };

  protected getXs = memoizeOne((data: number[][]) => data.map(ele => ele[0]));

  constructor(props: ITComponentProps) {
    super(props);
  }

  public render() {
    const { cellContext, data, height, padding, pointColor, width } = this.props;
    return (
      <div id="TComponent" style={{ padding }}>
        <PlotlyChart
          config={{
            ...defaultPlotlyConfig,
            modeBarButtons: [['zoomOut2d', 'zoomIn2d'], ['resetScale2d', 'autoScale2d'], ['select2d', 'pan2d']],
          }}
          data={[
            {
              marker: {
                color: pointColor,
                opacity: 0.25,
                size: 4,
              },
              mode: 'markers',
              type: 'scattergl',
              x: this.getXs(data),
              xaxis: 'x',
              y: data.map(ele => ele[1]),
              yaxis: 'y',
            },
            {
              marker: {
                color: '#ff0000',
                size: 6,
              },
              mode: 'markers',
              type: 'scatter',
              x: cellContext.currentCells.map(val => data[val][0]),
              xaxis: 'x',
              y: cellContext.currentCells.map(val => data[val][1]),
              yaxis: 'y',
            },
          ]}
          layout={{
            ...defaultPlotlyLayout,
            height,
            margin: {
              b: 20,
            },
            width,
            yaxis: {
              autorange: true,
            },
          }}
          onSelectedCallback={this.onMouseSelect(cellContext.addCells)}
        />
      </div>
    );
  }

  protected onMouseSelect = (cb: (cells: number[]) => void) => (e: ChellChartEvent) => {
    if (e.selectedPoints) {
      cb(e.selectedPoints.map(point => point));
    }
  };
}

type requiredProps = Omit<ITComponentProps, keyof typeof TComponentClass.defaultProps> & Partial<ITComponentProps>;

const TComponent = (props: requiredProps) => (
  <CellContext.Consumer>
    {cellContext => <TComponentClass {...props} cellContext={{ ...cellContext, ...props.cellContext }} />}
  </CellContext.Consumer>
);

export default TComponent;
export { TComponent };
