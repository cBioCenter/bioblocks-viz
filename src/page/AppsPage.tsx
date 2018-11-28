import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, List } from 'semantic-ui-react';

import { IVizSummaryData, VizData } from '~chell-viz~/data';

export interface IAppsPageProps extends Partial<RouteComponentProps> {}

export class AppsPage extends React.Component<IAppsPageProps, any> {
  constructor(props: IAppsPageProps) {
    super(props);
  }

  public render() {
    return (
      <List divided={true}>
        <List.Item>{this.renderAppItem(VizData.spring)}</List.Item>
        <List.Item>{this.renderAppItem(VizData.tfjsTsne)}</List.Item>
        <List.Item>{this.renderAppItem(VizData.anatomogram)}</List.Item>
      </List>
    );
  }

  protected renderAppItem(viz: IVizSummaryData) {
    return (
      <Grid centered={true} columns={3} padded={true} relaxed={true}>
        <Grid.Column>
          <img
            src={`assets/icons/${viz.name.toLocaleLowerCase()}-thumbnail.png`}
            alt={`icon for ${viz.name}`}
            style={{ height: '100px' }}
          />
        </Grid.Column>
        <Grid.Column textAlign={'left'}>
          <Header as={'h2'}>{viz.name}</Header>
          <List>
            <List.Item>{`${viz.listAsOriginal ? 'original: ' : ''}${viz.authors.join(', ')}`}</List.Item>
            <List.Item>{viz.summary}</List.Item>
            <List.Item>{`relevant data: ${viz.relevantData}`}</List.Item>
          </List>
        </Grid.Column>
        <Grid.Column stretched={true}>
          <Grid.Row>
            <Button basic={true}>
              <Link to={{ pathname: '/overview', search: `?name=${viz.name.toLocaleLowerCase()}` }}>details</Link>
            </Button>
          </Grid.Row>
          <Grid.Row>
            <Button basic={true}>
              <Link to={'/beta'}>launch</Link>
            </Button>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}
