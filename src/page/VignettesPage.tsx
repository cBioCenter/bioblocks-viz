import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';

import { IVignette, Vignettes } from '~chell-viz~/data';

export interface IVignettesPageProps extends Partial<RouteComponentProps> {}

export class VignettesPage extends React.Component<IVignettesPageProps, any> {
  constructor(props: IVignettesPageProps) {
    super(props);
  }

  public render() {
    return (
      <Grid centered={true} padded={true} relaxed={false}>
        {Vignettes.map((vignette, index) => (
          <React.Fragment key={`vignette-${index}`}>{this.renderSingleFeaturedVignette(vignette)}</React.Fragment>
        ))}
      </Grid>
    );
  }

  protected renderSingleFeaturedVignette(vignette: IVignette) {
    return (
      <Grid.Row columns={3}>
        <Grid.Column>
          <img src={vignette.icon} style={{ height: '90px', width: '90px' }} alt={`vignette ${vignette.title} icon`} />
        </Grid.Column>
        <Grid.Column textAlign={'left'}>
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
        <Grid.Column>
          <Button basic={true}>
            <Link to={vignette.link}>launch</Link>
          </Button>
        </Grid.Column>
      </Grid.Row>
    );
  }
}
