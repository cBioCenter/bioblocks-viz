import * as React from 'react';

import { NGLComponent } from '../component/NGLComponent';

export class NGLContainer extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div id="ContactContainer">
        <NGLComponent />
      </div>
    );
  }
}
