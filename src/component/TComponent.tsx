import * as React from 'react';
import { Chart } from 'react-google-charts';

export interface ITComponentProps {
  data: number[][];
}

export class TComponent extends React.Component<ITComponentProps, {}> {
  public render() {
    const data = [['x', 'y'], ...this.props.data];

    return (
      <div id="TComponent">
        <Chart
          chartType="ScatterChart"
          data={data}
          options={{}}
          graph_id="TComponentChart"
          width="300px"
          height="300px"
          legend_toggle={true}
          loadCharts={false}
        />
      </div>
    );
  }
}
