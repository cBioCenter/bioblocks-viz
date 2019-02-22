import * as React from 'react';

import { defaultPlotlyLayout, PlotlyChart } from '~bioblocks-viz~/component';
import { BioblocksChartEvent, IPlotlyData } from '~bioblocks-viz~/data';

export interface ITensorComponentProps {
  pointsToPlot: Array<Partial<IPlotlyData>>;
  onSelectedCallback?(event: BioblocksChartEvent): void;
}

class TensorTComponentClass extends React.Component<ITensorComponentProps> {
  public static defaultProps = {
    pointsToPlot: [],
    style: {
      padding: 0,
    },
  };

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
