import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, List } from 'semantic-ui-react';

import { IVizSummaryData, VizData } from '~bioblocks-viz~/data';

export interface IVisualizationsPageProps extends Partial<RouteComponentProps> {}

export class VisualizationsPage extends React.Component<IVisualizationsPageProps, any> {
  constructor(props: IVisualizationsPageProps) {
    super(props);
  }

  public render() {
    return (
      <List divided={true}>
        <List.Item>{this.renderVisualizationItem(VizData.spring)}</List.Item>
        <List.Item>{this.renderVisualizationItem(VizData.tfjsTsne)}</List.Item>
        <List.Item>{this.renderVisualizationItem(VizData.anatomogram)}</List.Item>
      </List>
    );
  }

  protected renderVisualizationItem(viz: IVizSummaryData) {
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
              <Link to={{ pathname: '/visualizations/', search: `?name=${viz.name.toLocaleLowerCase()}` }}>
                details
              </Link>
            </Button>
          </Grid.Row>
          <Grid.Row>
            <Button basic={true}>
              <Link to={{ pathname: '/dataset', search: `?viz=${viz.name.toLocaleLowerCase()}` }}>launch</Link>
            </Button>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}
