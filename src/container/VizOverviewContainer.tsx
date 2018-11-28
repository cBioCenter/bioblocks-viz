import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Accordion, Button, Container, Divider, Grid, Header, Icon, List, Message } from 'semantic-ui-react';

export interface IVizOverviewContainerProps extends Partial<RouteComponentProps> {}

export interface IVizOverviewContainerState {
  vizData: { [key: string]: string };
}

export class VizOverviewContainer extends React.Component<IVizOverviewContainerProps, IVizOverviewContainerState> {
  constructor(props: IVizOverviewContainerProps) {
    super(props);
  }

  public render() {
    return (
      <Container>
        {this.renderSummary()}
        {this.renderExamples()}
      </Container>
    );
  }

  protected renderSummary() {
    return (
      <Grid centered={true} columns={2}>
        <Grid.Column width={2}>
          <img
            alt={'component icon'}
            src={'assets/spring-icon.png'}
            style={{ height: '200px', padding: '20px', width: '128px' }}
          />
        </Grid.Column>
        <Grid.Column>
          <Header as={'h1'}>
            Component Name
            <Header.Subheader>Authors</Header.Subheader>
          </Header>
          {this.renderSummaryDetails()}
        </Grid.Column>
      </Grid>
    );
  }

  protected renderSummaryDetails() {
    return <p>Summary goes here - and also applicable data, comatability, etc.</p>;
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
}
