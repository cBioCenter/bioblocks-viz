import * as React from 'react';
import { Grid } from 'semantic-ui-react';

import { Provider } from 'react-redux';
import { ReduxAnatomogramContainer, ReduxTensorTContainer } from '~chell-viz~/container';
import { Store } from '~chell-viz~/reducer';

export class ReduxPrototypeApp extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Provider store={Store}>
        <div id={'ReduxPrototypeApp'}>
          <Grid>
            <Grid.Column style={{ width: 'auto' }}>
              <ReduxAnatomogramContainer species={'homo_sapiens'} />
            </Grid.Column>

            <Grid.Column style={{ width: 'auto' }}>
              <ReduxTensorTContainer />
            </Grid.Column>
          </Grid>
        </div>
      </Provider>
    );
  }
}
