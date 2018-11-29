import * as React from 'react';
import { HashRouter as Router, Route, RouteComponentProps } from 'react-router-dom';

import { Container } from 'semantic-ui-react';

import { SiteHeader } from '~chell-viz~/container';
import { ChellContextProvider } from '~chell-viz~/context';
import { AppsPage, DatasetPage, LandingPage, VignettesPage, VizOverviewPage } from '~chell-viz~/page';

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
        <Container id={'ChellVizApp'} fluid={true}>
          <SiteHeader {...this.props} />
          <Route path={'/apps'} render={this.renderAppsPage} />
          <Route path={'/overview'} render={this.renderOverviewPage} />
          <Route path={'/dataset'} render={this.renderDatasetPage} />
          <Route path={'/vignettes'} render={this.renderVignettesPage} />
          <Route exact={true} path={'/'} render={this.renderLandingPage} />
        </Container>
      </Router>
    );
  }

  protected renderAppsPage = (props: RouteComponentProps) => {
    return <AppsPage {...props} />;
  };

  protected renderDatasetPage = (props: RouteComponentProps) => {
    return (
      <ChellContextProvider>
        <DatasetPage {...props} />
      </ChellContextProvider>
    );
  };

  protected renderLandingPage = (props: RouteComponentProps) => {
    return <LandingPage {...props} />;
  };

  protected renderOverviewPage = (props: RouteComponentProps) => {
    return <VizOverviewPage {...props} />;
  };

  protected renderVignettesPage = (props: RouteComponentProps) => {
    return <VignettesPage {...props} />;
  };
}
