import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import { AnatomogramContainer, SpringContainer, TensorTContainer } from '~chell-viz~/container';
import { ChellContextProvider } from '~chell-viz~/context';
import { fetchTensorTSneCoordinateData } from '~chell-viz~/helper';

export interface IChellVizAppState {
  tensorData: null | number[][];
}

export class ChellVizApp extends React.Component<any, IChellVizAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      tensorData: null,
    };
  }

  public async componentDidMount() {
    const tensorData = await fetchTensorTSneCoordinateData('assets/datasets/hpc/full');
    this.setState({
      tensorData,
    });
  }

  public render() {
    return (
      <div id="ChellVizApp">
        <ChellContextProvider>
          <div style={{ float: 'right', width: '70vw' }}>
            <Grid centered={true} columns={2}>
              <SpringContainer />
              {this.state.tensorData && <TensorTContainer height={450} width={450} data={this.state.tensorData} />}
              <AnatomogramContainer />
            </Grid>
          </div>
        </ChellContextProvider>
      </div>
    );
  }
}
