import * as React from 'react';
// tslint:disable-next-line:import-name
import { Container, Grid } from 'semantic-ui-react';

import { SiteHeader, SpringContainer, TensorTContainer } from '~chell-viz~/container';
import { ChellContextProvider } from '~chell-viz~/context';
import { fetchTensorTSneCoordinateData } from '~chell-viz~/helper';

export interface IChellVizAppState {
  activeVisualizations: number;
  tensorData: null | number[][];
}

export class ChellVizApp extends React.Component<any, IChellVizAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeVisualizations: 0,
      tensorData: null,
    };
  }

  public async componentDidMount() {
    const tensorData = await fetchTensorTSneCoordinateData('assets/datasets/hpc/full');
    // const tensorData = await fetchTensorTSneCoordinateData('assets/datasets/tabula_muris/full');
    this.setState({
      activeVisualizations: 2,
      tensorData,
    });
  }

  public render() {
    return (
      <Container id="ChellVizApp" fluid={true}>
        <SiteHeader numVisualizations={2} />
        <ChellContextProvider>{this.renderComponents()}</ChellContextProvider>
      </Container>
    );
  }

  protected renderComponents = () => (
    <div style={{ padding: '20px' }}>
      <Grid centered={true} stackable={true} stretched={false} padded={true} columns={2}>
        <Grid.Column style={{ width: 'auto' }}>
          <SpringContainer />
        </Grid.Column>
        <Grid.Column style={{ width: 'auto' }}>
          {this.state.tensorData && <TensorTContainer data={this.state.tensorData} />}
        </Grid.Column>
        {/*<Grid.Column>
          <ComponentCard componentName={AnatomogramContainerClass.displayName}>
            <AnatomogramContainer />
  </ComponentCard>
        </Grid.Column>*/}
      </Grid>
    </div>
  );
}
