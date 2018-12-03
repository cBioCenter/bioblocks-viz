import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Accordion, Button, Container, Divider, Grid, Header, Icon, List } from 'semantic-ui-react';

import { Link } from 'react-router-dom';
import { IVizExample, IVizOverviewData, VizData } from '~chell-viz~/data';

export interface IVizOverviewPageProps extends Partial<RouteComponentProps> {}

export interface IVizOverviewPageState {
  currentViz: IVizOverviewData | null;
}

export class VizOverviewPage extends React.Component<IVizOverviewPageProps, IVizOverviewPageState> {
  constructor(props: IVizOverviewPageProps) {
    super(props);
    this.state = {
      currentViz: null,
    };
  }

  public componentDidMount() {
    this.setupCurrentViz();
  }

  public componentDidUpdate(prevProps: IVizOverviewPageProps) {
    if (this.props.location !== prevProps.location) {
      this.setupCurrentViz();
    }
  }

  public render() {
    return (
      this.state.currentViz && (
        <Container>
          {this.renderOverview(this.state.currentViz)}
          {this.renderExamples(this.state.currentViz.examples)}
        </Container>
      )
    );
  }

  protected renderOverview(viz: IVizOverviewData) {
    return (
      <Grid centered={true} columns={2}>
        <Grid.Column width={2}>
          <img
            alt={`icon for ${viz.name}`}
            src={`assets/icons/${viz.name.toLocaleLowerCase()}-icon.png`}
            style={{ height: '150px', padding: '20px' }}
          />
        </Grid.Column>
        <Grid.Column textAlign={'left'}>
          <Header as={'h1'}>
            {viz.name}
            <Header.Subheader>{viz.authors.join(', ')}</Header.Subheader>
          </Header>
          <>
            <p>{viz.detailedSummary}</p>
            <List>
              <List.Item>applicable data: {viz.relevantData}</List.Item>
              <List.Item>compatible with: {viz.compatibility.join(', ')}</List.Item>
              <List.Item>
                citation(s):{' '}
                {viz.citations.map((citation, index) => (
                  <React.Fragment key={`${viz.name.toLocaleLowerCase()}-citation-${index}`}>
                    {citation.fullCitation} ({<a href={citation.link}>link</a>})
                  </React.Fragment>
                ))}
              </List.Item>
              <List.Item>
                version: {viz.repo.version} (last updated {viz.repo.lastUpdate}),
                {<a href={viz.repo.link}> github link</a>}
              </List.Item>
              <List.Item>
                <Grid.Column floated={'right'}>
                  <Button basic={true} icon={true} labelPosition={'right'}>
                    <Link to={{ pathname: '/dataset', search: `?viz=${viz.name.toLocaleLowerCase()}` }}>
                      {`launch ${viz.name}`}
                    </Link>
                    {/* Power Gap */}
                    <Icon name={'external alternate'} />
                  </Button>
                </Grid.Column>
              </List.Item>
            </List>
          </>
        </Grid.Column>
      </Grid>
    );
  }

  protected renderExamples(examples: IVizExample[]) {
    const panels = [
      {
        content: {
          content: (
            <>
              <Divider />
              <Grid centered={true} container={true} divided={'vertically'} columns={1}>
                {examples.map((example, index) => (
                  <Grid.Row columns={2} key={`viz-example-${index}`}>
                    {this.renderExampleEntry(example)}
                  </Grid.Row>
                ))}
              </Grid>
            </>
          ),
        },
        key: 'examples',
        title: 'examples',
      },
      {
        content: 'coming soon!',
        key: 'learn',
        title: 'learn',
      },
    ];

    return <Accordion panels={panels} defaultActiveIndex={0} />;
  }

  protected renderExampleEntry(example: IVizExample) {
    return (
      <>
        <Grid.Column width={2}>
          <img src={example.icon} alt={`${example.name} icon`} style={{ height: '75px', width: '75px' }} />
        </Grid.Column>
        <Grid.Column textAlign={'left'} width={8}>
          <Header>{example.name}</Header>
          <p>{example.summary}</p>
        </Grid.Column>
        <Grid.Column floated={'right'}>
          <Button basic={true} icon={true} labelPosition={'right'}>
            <Link to={example.link}>{'launch example'}</Link>
            {/* Power Gap */}
            <Icon name={'external alternate'} />
          </Button>
        </Grid.Column>
      </>
    );
  }

  protected setupCurrentViz() {
    const params = new URLSearchParams(this.props.location ? this.props.location.search : '');
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const vizName = params.get('name');

    if (vizName === VizData.spring.name.toLocaleLowerCase()) {
      this.setState({
        currentViz: VizData.spring,
      });
    } else if (vizName === VizData.tfjsTsne.name.toLocaleLowerCase()) {
      this.setState({
        currentViz: VizData.tfjsTsne,
      });
    } else if (vizName === VizData.anatomogram.name.toLocaleLowerCase()) {
      this.setState({
        currentViz: VizData.anatomogram,
      });
    }
  }
}
