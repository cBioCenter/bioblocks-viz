import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';

import { IDatasetInfo, IStory, IVizSummaryData, Stories, userDatasets, VizData } from '~chell-viz~/data';

export interface ILandingPageProps extends Partial<RouteComponentProps> {}

export class LandingPage extends React.Component<ILandingPageProps, any> {
  constructor(props: ILandingPageProps) {
    super(props);
  }

  public render() {
    return (
      <Container fluid={false}>
        <Segment basic={true} padded={'very'}>
          <Grid centered={true} padded={true} relaxed={true}>
            {this.renderFeaturedStories()}
            {this.renderFeaturedVisualizations()}
            {this.renderFeaturedDatasets()}
          </Grid>
        </Segment>
      </Container>
    );
  }

  protected renderSingleVisualization(viz: IVizSummaryData) {
    return (
      <Grid.Row columns={3}>
        <Grid.Column width={2}>
          <img
            src={`assets/icons/${viz.name.toLocaleLowerCase()}-thumbnail.png`}
            style={{ height: '90px', width: '90px' }}
            alt={`viz ${viz.name} icon`}
          />
        </Grid.Column>
        <Grid.Column textAlign={'left'} width={8}>
          <Header>{viz.name}</Header>
          {viz.summary}
          <p>
            <span style={{ fontWeight: 'bold' }}>{viz.listAsOriginal ? 'Original authors' : 'Authors'}: </span>
            {viz.authors.length === 2 ? `${viz.authors[0]} and ${viz.authors[1]}` : viz.authors.join(', ')}
          </p>
        </Grid.Column>
        <Grid.Column width={2}>
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
      </Grid.Row>
    );
  }

  protected renderFeaturedDatasets() {
    return (
      <>
        <Grid.Row centered={true}>
          <Grid.Column width={12}>
            <Header floated={'left'}>Featured Datasets</Header>
            <Divider section={true} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} divided={true}>
          {this.renderHCADatasets()}
          {this.renderUserSharedDatasets()}
        </Grid.Row>
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Link style={{ color: 'blue', float: 'right' }} to={'datasets'}>
              more datasets...
            </Link>
          </Grid.Column>
        </Grid.Row>
      </>
    );
  }

  protected renderFeaturedStories() {
    return (
      <>
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Header floated={'left'}>Featured Stories</Header>
            <Divider section={true} />
          </Grid.Column>
        </Grid.Row>
        {this.renderSingleFeaturedStory(Stories[0])}
        {this.renderSingleFeaturedStory(Stories[1])}
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Link style={{ color: 'blue', float: 'right' }} to={'stories'}>
              more stories...
            </Link>
          </Grid.Column>
        </Grid.Row>
      </>
    );
  }

  protected renderFeaturedVisualizations() {
    return (
      <>
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Header floated={'left'}>Featured Visualizations</Header>
            <Divider section={true} />
          </Grid.Column>
        </Grid.Row>
        {this.renderSingleVisualization(VizData.spring)}
        {this.renderSingleVisualization(VizData.tfjsTsne)}
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Link style={{ color: 'blue', float: 'right' }} to={'visualizations'}>
              more visualizations...
            </Link>
          </Grid.Column>
        </Grid.Row>
      </>
    );
  }

  protected renderSingleFeaturedStory(story: IStory) {
    return (
      <Grid.Row columns={3}>
        <Grid.Column width={2}>
          <img src={story.icon} style={{ height: '90px', width: '90px' }} alt={`story ${story.title} icon`} />
        </Grid.Column>
        <Grid.Column textAlign={'left'} width={8}>
          <Header>{story.title}</Header>
          <p>
            <span style={{ fontWeight: 'bold' }}>Description: </span>
            {story.description}
          </p>
          <p>
            <span style={{ fontWeight: 'bold' }}>Analysis authors: </span>
            {story.authors.length === 2 ? `${story.authors[0]} and ${story.authors[1]}` : story.authors.join(', ')}
          </p>
        </Grid.Column>
        <Grid.Column width={2}>
          <Button basic={true}>
            <Link to={story.link}>launch</Link>
          </Button>
        </Grid.Column>
      </Grid.Row>
    );
  }

  protected renderHCADatasets() {
    return (
      <Grid.Column width={3}>
        <Grid.Row>
          <img
            src={'assets/icons/hca-logo.png'}
            style={{ width: '150px', height: '250px' }}
            alt={'human cell atlas logo'}
          />
          <Grid.Row>
            <a href={'https://preview.data.humancellatlas.org/'}>Search HCA datasets ...</a>
          </Grid.Row>
        </Grid.Row>
      </Grid.Column>
    );
  }

  protected renderSingleUserSharedDatasets(dataset: IDatasetInfo) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column floated={'left'}>
          <Header>{dataset.name}</Header>
          <p>
            {dataset.summary}
            <br />
            <span style={{ fontWeight: 'bold' }}>Authors: </span>
            {dataset.authors.join(', ')}
          </p>
        </Grid.Column>
        <Grid.Column floated={'right'}>
          <Button basic={true} floated={'right'}>
            <Link to={dataset.links.detail}>details</Link>
          </Button>
          <Button basic={true} floated={'right'}>
            <Link to={dataset.links.analysis}>analyze</Link>
          </Button>
        </Grid.Column>
      </Grid.Row>
    );
  }

  protected renderUserSharedDatasets() {
    return (
      <Grid.Column stretched={true} textAlign={'left'} width={8}>
        <Grid.Row textAlign={'center'}>
          <Header as={'h2'} textAlign={'center'}>
            User shared
          </Header>
        </Grid.Row>
        <br />
        <Grid.Row>{this.renderSingleUserSharedDatasets(userDatasets[0])}</Grid.Row>
        <Grid.Row>{this.renderSingleUserSharedDatasets(userDatasets[1])}</Grid.Row>
      </Grid.Column>
    );
  }
}
