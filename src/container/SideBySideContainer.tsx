import * as React from 'react';

import { SpringContainer } from './SpringContainer';
import { TContainer } from './TContainer';

export class SideBySideContainer extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div id="SideBySideContainer">
        <TContainer />
        <SpringContainer />
      </div>
    );
  }
}
