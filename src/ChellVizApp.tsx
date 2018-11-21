import * as React from 'react';
// tslint:disable-next-line:import-name
import ReactSVG from 'react-svg';
import { Grid, Input, Menu } from 'semantic-ui-react';

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
      <>
        {this.renderSiteHeader()}
        <div id="ChellVizApp">
          <ChellContextProvider>
            <div style={{ padding: '20px' }}>
              <Grid centered={true} columns={2} style={{ width: '90vw' }}>
                <SpringContainer />
                <ComponentCard componentName={TensorTContainerClass.displayName}>
                  {this.state.tensorData && <TensorTContainer height={450} width={450} data={this.state.tensorData} />}
                </ComponentCard>
                <ComponentCard componentName={AnatomogramContainerClass.displayName}>
                  <AnatomogramContainer />
                </ComponentCard>
              </Grid>
            </div>
          </ChellContextProvider>
        </div>
      </>
    );
  }

  protected renderSiteHeader() {
    return (
      <Menu secondary={true} header={true}>
        <Menu.Item fitted={'vertically'} position={'left'}>
          <ReactSVG src={'assets/bio-blocks-icon.svg'} svgStyle={{ height: '32px', width: '32px' }} />
          <span style={{ fontSize: '32px', fontWeight: 'bold' }}>HCA Dynamics</span>
        </Menu.Item>
        <Menu.Item position={'right'}>
          <Input icon={'search'} size={'massive'} transparent={true} />
        </Menu.Item>
      </Menu>
    );
  }
}
