import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';

import { IStory, Stories } from '~chell-viz~/data';

export interface IStoriesPageProps extends Partial<RouteComponentProps> {}

export class StoriesPage extends React.Component<IStoriesPageProps, any> {
  constructor(props: IStoriesPageProps) {
    super(props);
  }

  public render() {
    return (
      <Grid centered={true} divided={'vertically'} padded={true} relaxed={false}>
        {Stories.map((story, index) => (
          <React.Fragment key={`story-${index}`}>{this.renderSingleFeaturedStory(story)}</React.Fragment>
        ))}
      </Grid>
    );
  }

  protected renderSingleFeaturedStory(story: IStory) {
    return (
      <Grid.Row columns={3}>
        <Grid.Column>
          <img src={story.icon} style={{ height: '90px', width: '90px' }} alt={`story ${story.title} icon`} />
        </Grid.Column>
        <Grid.Column textAlign={'left'}>
          <Header>{story.title}</Header>
          <p>
            <span style={{ fontWeight: 'bold' }}>Description: </span>
            {story.description}
          </p>
          <p>
            <span style={{ fontWeight: 'bold' }}>Analysis authors: </span>
            {story.authors.length === 2 ? `${story.authors[0]} and ${story.authors[1]}` : story.authors.join(', ')}
          </p>
          <br />
        </Grid.Column>
        <Grid.Column>
          <Button basic={true}>
            <Link to={story.link}>launch</Link>
          </Button>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
