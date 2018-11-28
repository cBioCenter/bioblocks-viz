import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Accordion, Button, Container, Divider, Grid, Header, Icon, List, Message } from 'semantic-ui-react';

import { Link } from 'react-router-dom';
import { IVizOverviewData, VizData } from '~chell-viz~/data';

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
          {this.renderExamples()}
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
            style={{ height: '200px', padding: '20px', width: '128px' }}
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
                <Button basic={true} icon={true} labelPosition={'right'}>
                  <Link to={{ pathname: '/dataset', search: `?name=hpc/full&app=${viz.name.toLocaleLowerCase()}` }}>
                    {`launch ${viz.name}`}
                  </Link>
                  {/* Power Gap */}
                  <Icon name={'external alternate'} />
                </Button>
              </List.Item>
            </List>
          </>
        </Grid.Column>
      </Grid>
    );
  }

  protected renderExamples() {
    const panels = [
      {
        content: {
          content: (
            <List>
              <Divider />
              <List.Item>{this.renderExampleBlock('Example 1')}</List.Item>
              <List.Item>{this.renderExampleBlock('Example Dos')}</List.Item>
              <List.Item>{this.renderExampleBlock('Example San')}</List.Item>
              <List.Item>Example 2</List.Item>
            </List>
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

    return <Accordion panels={panels} />;
  }

  protected renderExampleBlock(title: string) {
    return (
      <Grid centered={true} columns={2}>
        <Grid.Column width={2}>
          <Icon name={'user secret'} size={'huge'} />
        </Grid.Column>
        <Grid.Column>
          <Message>
            <Message.Header>{title}</Message.Header>
            <Message.Content>
              <p>This is placeholder text - hooray!</p>
              <Button floated={'right'} icon={true}>
                <Icon name={'external alternate'} />
                launch example
              </Button>
            </Message.Content>
          </Message>
        </Grid.Column>
      </Grid>
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
