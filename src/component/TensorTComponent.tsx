import * as React from 'react';

// tslint:disable-next-line:no-submodule-imports
import { defaultPlotlyLayout, PlotlyChart } from '~chell-viz~/component';
import { CHELL_CSS_STYLE, IPlotlyData } from '~chell-viz~/data';

export interface ITensorComponentProps {
  height: number;
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
            height,
            margin: {
              b: 20,
            },
            width,
            xaxis: { autorange: true, showline: true },
            yaxis: { autorange: true, showline: true },
          }}
        />
      </div>
    );
  }
}

type requiredProps = Omit<ITensorComponentProps, keyof typeof TensorTComponentClass.defaultProps> &
  Partial<ITensorComponentProps>;

export const TensorTComponent = (props: requiredProps) => <TensorTComponentClass {...props} />;
