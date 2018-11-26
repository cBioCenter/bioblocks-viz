import * as React from 'react';
// tslint:disable-next-line:import-name
import { Container, Grid, Input, Menu } from 'semantic-ui-react';

import { SpringContainer, TensorTContainer } from '~chell-viz~/container';
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
    // const tensorData = await fetchTensorTSneCoordinateData('assets/datasets/hpc/full');
    const tensorData = await fetchTensorTSneCoordinateData('assets/datasets/tabula_muris/full');
    this.setState({
      tensorData,
    });
  }

  public render() {
    return (
      <Container id="ChellVizApp" fluid={true}>
        {this.renderSiteHeader()}
        <ChellContextProvider>{this.renderComponents()}</ChellContextProvider>
      </Container>
    );
  }

  protected renderComponents = () => (
    <div style={{ padding: '20px' }}>
      <Grid centered={true} stackable={true} stretched={false} padded={true} columns={2}>
        <Grid.Column>
          <SpringContainer />
        </Grid.Column>
        <Grid.Column>{this.state.tensorData && <TensorTContainer data={this.state.tensorData} />}</Grid.Column>
        <Grid.Column>
          {/*<ComponentCard componentName={AnatomogramContainerClass.displayName}>
            <AnatomogramContainer />
  </ComponentCard>*/}
        </Grid.Column>
      </Grid>
    </div>
  );

  protected renderSiteHeader = () => (
    <Menu secondary={true} fluid={true}>
      <Menu.Item fitted={'vertically'} position={'left'}>
        <img
          alt={'hca-dynamics-icon'}
          src={'assets/bio-blocks-icon-2x.png'}
          style={{ height: '32px', width: '32px' }}
        />
        <span style={{ fontSize: '32px', fontWeight: 'bold' }}>HCA Dynamics</span>
      </Menu.Item>
      <Menu.Item>dataset</Menu.Item>
      <Menu.Item>apps (1)</Menu.Item>
      <Menu.Item position={'right'}>
        <Input icon={'search'} size={'massive'} transparent={true} />
      </Menu.Item>
    </Menu>
  );
}
