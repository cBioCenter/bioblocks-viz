import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export const withDimmedLoader = (component: JSX.Element, active: boolean) => (
  <Dimmer.Dimmable dimmed={true}>
    <Dimmer active={active}>
      <Loader />
    </Dimmer>
    {component}
  </Dimmer.Dimmable>
);
