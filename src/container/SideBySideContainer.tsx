import * as React from 'react';
import { Card, Grid } from 'semantic-ui-react';

import { SpringContainer } from './SpringContainer';
import { TContainer } from './TContainer';

export class SideBySideContainer extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Grid id="SideBySideContainer">
        <Grid.Row columns={2}>
          <Grid.Column floated={'left'}>
            <TContainer />
          </Grid.Column>
          <Grid.Column floated={'right'}>
            <SpringContainer />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
