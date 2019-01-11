import * as React from 'react';
import { HashRouter as Router, Route, RouteComponentProps } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { SiteHeader } from '~chell-viz~/container';
import { ChellContextProvider } from '~chell-viz~/context';
import { DatasetPage, LandingPage, StoriesPage, VisualizationsPage, VizOverviewPage } from '~chell-viz~/page';

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
        <Route render={this.renderComponents} />
      </Router>
    );
  }

  protected renderComponents = (props: RouteComponentProps) => (
    <ChellContextProvider {...props}>
      <Container id={'ChellVizApp'} fluid={true}>
        <SiteHeader {...props} />
        <Route exact={true} strict={true} path={'/visualizations'} render={this.renderVisualizationsPage} />
        <Route exact={true} strict={true} path={'/visualizations/'} render={this.renderOverviewPage} />
        <Route path={'/dataset'} render={this.renderDatasetPage} />
        <Route path={'/stories'} render={this.renderStoriesPage} />
        <Route exact={true} path={'/'} render={this.renderLandingPage} />
      </Container>
    </ChellContextProvider>
  );

  protected renderVisualizationsPage = (props: RouteComponentProps) => {
    return <VisualizationsPage {...props} />;
  };

  protected renderDatasetPage = (props: RouteComponentProps) => {
    return <DatasetPage {...props} />;
  };

  protected renderLandingPage = (props: RouteComponentProps) => {
    return <LandingPage {...props} />;
  };

  protected renderOverviewPage = (props: RouteComponentProps) => {
    return <VizOverviewPage {...props} />;
  };

  protected renderStoriesPage = (props: RouteComponentProps) => {
    return <StoriesPage {...props} />;
  };
}
