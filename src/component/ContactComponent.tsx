import * as React from 'react';
import { Chart } from 'react-google-charts';

export interface IContactComponentProps {
  data: number[][];
}

export class ContactComponent extends React.Component<IContactComponentProps, {}> {
  public render() {
    const data = [['x', 'y'], ...this.props.data];

    return (
      <div id="TComponentChart">
        <Chart
          chartType="ScatterChart"
          data={data}
          options={{}}
          graph_id="ScatterChart"
          width="400px"
          height="400px"
          legend_toggle={true}
          loadCharts={false}
        />
      </div>
    );
  }
}
