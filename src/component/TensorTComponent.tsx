// ~bb-viz~
// TensorFlow T-SNE Visualization Component.
// Responsible for displaying T-SNE data
// ~bb-viz~
import * as React from 'react';

import { defaultPlotlyLayout, PlotlyChart } from '~bioblocks-viz~/component';
import { BioblocksChartEvent, IPlotlyData } from '~bioblocks-viz~/data';

export interface ITensorComponentProps {
  currentCells: number[];
  coordsArray: number[][];
  pointColor: string;
  onSelectedCallback?(event: BioblocksChartEvent): void;
}

class TensorTComponentClass extends React.Component<ITensorComponentProps> {
  public static defaultProps = {
    coordsArray: [],
    currentCells: [],
    pointColor: '#aa0000',
    pointsToPlot: [],
  };

  constructor(props: ITensorComponentProps) {
    super(props);
  }

  public render() {
    const { onSelectedCallback, coordsArray } = this.props;

    return (
      <PlotlyChart
        data={this.getPlotlyCoordsFromTsne(coordsArray)}
        layout={{
          ...defaultPlotlyLayout,
          dragmode: 'select',
          margin: {
            b: 20,
          },
          xaxis: { autorange: false, range: [0, 1], showline: true },
          yaxis: { autorange: false, range: [0, 1], showline: true },
        }}
        onSelectedCallback={onSelectedCallback}
      />
    );
  }

  protected getPlotlyCoordsFromTsne = (coords: number[][]): Array<Partial<IPlotlyData>> => {
    const { currentCells, pointColor } = this.props;

    return [
      {
        marker: {
          color: pointColor,
        },
        mode: 'markers',
        type: 'scattergl',
        x: coords.map(coord => coord[0]),
        y: coords.map(coord => coord[1]),
      },
      {
        marker: {
          color: this.props.pointColor,
          line: {
            color: '#ffaa00',
            width: 2,
          },
        },
        mode: 'markers',
        type: 'scattergl',
        x: currentCells.map(cellIndex => coords[cellIndex][0]),
        y: currentCells.map(cellIndex => coords[cellIndex][1]),
      },
    ];
  };
}

type requiredProps = Omit<ITensorComponentProps, keyof typeof TensorTComponentClass.defaultProps> &
  Partial<ITensorComponentProps>;

export const TensorTComponent = (props: requiredProps) => <TensorTComponentClass {...props} />;
