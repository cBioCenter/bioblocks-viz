import * as React from 'react';

import { CellContextHandler } from './CellContext';
import { ResidueContextHandler } from './ResidueContext';
import { SecondaryStructureContextHandler } from './SecondaryStructureContext';
import { SpringContextHandler } from './SpringContext';

/**
 * Shorthand for passing all Chell contexts down.
 *
 * @export
 * @extends {React.Component<any, any>}
 */
export default class ChellContext extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <SecondaryStructureContextHandler>
        <SpringContextHandler>
          <CellContextHandler>
            <ResidueContextHandler>{this.props.children}</ResidueContextHandler>
          </CellContextHandler>
        </SpringContextHandler>
      </SecondaryStructureContextHandler>
    );
  }
}

export { ChellContext };
