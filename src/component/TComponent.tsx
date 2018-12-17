import memoizeOne from 'memoize-one';
import * as React from 'react';

import { defaultPlotlyConfig, defaultPlotlyLayout, PlotlyChart } from '~chell-viz~/component';
import { initialSpringContext, ISpringContext, SpringContext } from '~chell-viz~/context';
import { ChellChartEvent, T_SNE_DATA_TYPE } from '~chell-viz~/data';

export interface ITComponentProps {
  data: T_SNE_DATA_TYPE;
  height: number;
  padding: number | string;
  pointColor: string;
  springContext: ISpringContext;
  width: number;
}

class TComponentClass extends React.Component<ITComponentProps, any> {
  public static defaultProps = {
    data: [[0], [0]],
    height: 400,
    padding: 0,
    pointColor: '#000000',
    springContext: {
      ...initialSpringContext,
    },
    width: 400,
  };

  protected getXs = memoizeOne((data: number[][]) => data.map(ele => ele[0]));

  constructor(props: ITComponentProps) {
    super(props);
  }

  public render() {
    const { springContext, data, height, padding, pointColor, width } = this.props;

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
              x: springContext.currentCells.toArray().map(cell => data[cell][0]),
              xaxis: 'x',
              y: springContext.currentCells.toArray().map(cell => data[cell][1]),
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
          onSelectedCallback={this.onMouseSelect(springContext.setCells)}
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

export const TComponent = (props: requiredProps) => (
  <SpringContext.Consumer>
    {springContext => <TComponentClass {...props} springContext={springContext} />}
  </SpringContext.Consumer>
);
