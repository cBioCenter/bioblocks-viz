import * as React from 'react';

import { defaultPlotlyLayout, PlotlyChart } from '~chell-viz~/component';
import { ChellChartEvent, IPlotlyData } from '~chell-viz~/data';

export interface ITensorComponentProps {
  onSelectedCallback?: ((event: ChellChartEvent) => void);
  pointsToPlot: Array<Partial<IPlotlyData>>;
}

class TensorTComponentClass extends React.Component<ITensorComponentProps> {
  public static defaultProps = {
    pointsToPlot: [],
    style: {
      padding: 0,
    },
  };

  protected canvasContext: CanvasRenderingContext2D | null = null;

  constructor(props: ITensorComponentProps) {
    super(props);
  }

  public render() {
    const { pointsToPlot } = this.props;

    return (
      <PlotlyChart
        data={pointsToPlot}
        layout={{
          ...defaultPlotlyLayout,
          dragmode: 'select',
          margin: {
            b: 20,
          },
          xaxis: { autorange: false, range: [0, 1], showline: true },
          yaxis: { autorange: false, range: [0, 1], showline: true },
        }}
        onSelectedCallback={this.props.onSelectedCallback}
      />
    );
  }
}

type requiredProps = Omit<ITensorComponentProps, keyof typeof TensorTComponentClass.defaultProps> &
  Partial<ITensorComponentProps>;

export const TensorTComponent = (props: requiredProps) => <TensorTComponentClass {...props} />;
