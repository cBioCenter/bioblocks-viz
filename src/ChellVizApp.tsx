import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import { ComponentCard } from '~chell-viz~/component';
import {
  AnatomogramContainer,
  AnatomogramContainerClass,
  SpringContainer,
  TensorTContainer,
  TensorTContainerClass,
} from '~chell-viz~/container';
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
          <div style={{ padding: '20px' }}>
            <Grid centered={true} columns={2} style={{ width: '90vw' }}>
              <SpringContainer />
              <ComponentCard componentName={TensorTContainerClass.displayName} isFramedComponent={true}>
                {this.state.tensorData && <TensorTContainer height={450} width={450} data={this.state.tensorData} />}
              </ComponentCard>
              <ComponentCard componentName={AnatomogramContainerClass.displayName}>
                <AnatomogramContainer />
              </ComponentCard>
            </Grid>
          </div>
        </ChellContextProvider>
      </div>
    );
  }
}
