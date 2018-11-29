import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';

import { IDatasetInfo, IVignette, IVizSummaryData, userDatasets, Vignettes, VizData } from '~chell-viz~/data';

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
            {this.renderFeaturedVignettes()}
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
              <Link to={{ pathname: '/overview', search: `?name=${viz.name.toLocaleLowerCase()}` }}>details</Link>
            </Button>
          </Grid.Row>
          <Grid.Row>
            <Button basic={true}>
              <Link to={{ pathname: '/dataset', search: `?app=${viz.name.toLocaleLowerCase()}` }}>launch</Link>
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

  protected renderFeaturedVignettes() {
    return (
      <>
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Header floated={'left'}>Featured Vignettes</Header>
            <Divider section={true} />
          </Grid.Column>
        </Grid.Row>
        {this.renderSingleFeaturedVignette(Vignettes[0])}
        {this.renderSingleFeaturedVignette(Vignettes[1])}
        <Grid.Row centered={false}>
          <Grid.Column width={12}>
            <Link style={{ color: 'blue', float: 'right' }} to={'vignettes'}>
              more vignettes...
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
        <Grid.Row columns={3}>
          <Grid.Column width={12} floated={'right'}>
            <Link style={{ color: 'blue' }} to={'apps'}>
              more visualizations...
            </Link>
          </Grid.Column>
        </Grid.Row>
      </>
    );
  }

  protected renderSingleFeaturedVignette(vignette: IVignette) {
    return (
      <Grid.Row columns={3}>
        <Grid.Column width={2}>
          <img src={vignette.icon} style={{ height: '90px', width: '90px' }} alt={`vignette ${vignette.title} icon`} />
        </Grid.Column>
        <Grid.Column textAlign={'left'} width={8}>
          <Header>{vignette.title}</Header>
          <p>
            <span style={{ fontWeight: 'bold' }}>Description: </span>
            {vignette.description}
          </p>
          <p>
            <span style={{ fontWeight: 'bold' }}>Analysis authors: </span>
            {vignette.authors.length === 2
              ? `${vignette.authors[0]} and ${vignette.authors[1]}`
              : vignette.authors.join(', ')}
          </p>
        </Grid.Column>
        <Grid.Column width={2}>
          <Button basic={true}>
            <Link to={vignette.link}>launch</Link>
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
