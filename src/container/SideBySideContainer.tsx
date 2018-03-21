import * as React from 'react';
import { Card, Grid, GridColumn, GridRow, TextArea } from 'semantic-ui-react';

import { SpringContainer } from './SpringContainer';
import { TContainer } from './TContainer';

export class SideBySideContainer extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Grid columns={2} divided={true}>
        <GridColumn>
          <TContainer />
        </GridColumn>
        <GridColumn>
          <SpringContainer />
        </GridColumn>
      </Grid>
    );
  }
}
