import * as React from 'react';

import { defaultPlotlyLayout, PlotlyChart } from '~chell-viz~/component';
import { CHELL_CSS_STYLE, ChellChartEvent, IPlotlyData } from '~chell-viz~/data';

export interface ITensorComponentProps {
  height: number;
  onSelectedCallback?: ((event: ChellChartEvent) => void);
  pointsToPlot: Array<Partial<IPlotlyData>>;
  style: CHELL_CSS_STYLE;
  width: number;
}

class TensorTComponentClass extends React.Component<ITensorComponentProps> {
  public static defaultProps = {
    height: 400,
    pointsToPlot: [],
    style: {
      padding: 0,
    },
    width: 400,
  };

  protected canvasContext: CanvasRenderingContext2D | null = null;

  constructor(props: ITensorComponentProps) {
    super(props);
  }

  public render() {
    const { height, pointsToPlot, style, width } = this.props;

    return (
      <div id="TensorTComponentDiv" style={style}>
        <PlotlyChart
          data={pointsToPlot}
          layout={{
            ...defaultPlotlyLayout,
            dragmode: 'select',
            height,
            margin: {
              b: 20,
            },
            width,
            xaxis: { autorange: false, range: [0, 1], showline: true },
            yaxis: { autorange: false, range: [0, 1], showline: true },
          }}
          onSelectedCallback={this.props.onSelectedCallback}
        />
      </div>
    );
  }
}

type requiredProps = Omit<ITensorComponentProps, keyof typeof TensorTComponentClass.defaultProps> &
  Partial<ITensorComponentProps>;

export const TensorTComponent = (props: requiredProps) => <TensorTComponentClass {...props} />;
