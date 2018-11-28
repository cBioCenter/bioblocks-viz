import * as React from 'react';
import { HashRouter as Router, Route, RouteComponentProps } from 'react-router-dom';

// tslint:disable-next-line:import-name
import { Container, Grid } from 'semantic-ui-react';

import { SiteHeader, SpringContainer, TensorTContainer } from '~chell-viz~/container';
import { ChellContextProvider } from '~chell-viz~/context';

export interface IChellVizAppState {
  activeVisualizations: number;
}

export class ChellVizApp extends React.Component<Partial<RouteComponentProps>, IChellVizAppState> {
  constructor(props: Partial<RouteComponentProps>) {
    super(props);
    this.state = {
      activeVisualizations: 0,
    };
  }

  public async componentDidMount() {
    this.setState({
      activeVisualizations: 2,
    });
  }

  public render() {
    return (
      <Router>
        <Container id="ChellVizApp" fluid={true}>
          <SiteHeader numVisualizations={2} />
          <ChellContextProvider>
            <Route path="/beta" render={this.renderComponents} />
            <Route path="/" render={this.renderComponents} />
          </ChellContextProvider>
        </Container>
      </Router>
    );
  }

  protected renderComponents = (props: RouteComponentProps) => {
    const params = new URLSearchParams(props.location ? props.location.search : '');
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const datasetLocation = params.get('name');

    return (
      <div style={{ padding: '20px' }}>
        <Grid centered={true} stackable={true} stretched={false} padded={true} columns={2}>
          <Grid.Column style={{ width: 'auto' }}>
            <SpringContainer datasetLocation={datasetLocation ? datasetLocation : ''} />
          </Grid.Column>
          <Grid.Column style={{ width: 'auto' }}>
            <TensorTContainer datasetLocation={datasetLocation ? datasetLocation : ''} />
          </Grid.Column>
          {/*<Grid.Column>
          <ComponentCard componentName={AnatomogramContainerClass.displayName}>
            <AnatomogramContainer />
  </ComponentCard>
        </Grid.Column>*/}
        </Grid>
      </div>
    );
  };
}
