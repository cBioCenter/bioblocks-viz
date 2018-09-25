import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export const DimmedComponent = (component: JSX.Element, active: boolean) => (
  <Dimmer.Dimmable dimmed={active}>
    <Dimmer active={active}>
      <Loader />
    </Dimmer>
    {component}
  </Dimmer.Dimmable>
);
