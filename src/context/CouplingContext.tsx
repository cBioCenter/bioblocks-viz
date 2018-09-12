import * as React from 'react';

import { ResidueContextHandler } from './ResidueContext';
import { SecondaryStructureContextHandler } from './SecondaryStructureContext';

/**
 * Shorthand for passing contexts relevant for Coupling Scores - Primarily interaction with residues and secondary structures.
 *
 * @export
 * @extends {React.Component<any, any>}
 */
export default class CouplingContext extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <SecondaryStructureContextHandler>
        <ResidueContextHandler>{this.props.children}</ResidueContextHandler>
      </SecondaryStructureContextHandler>
    );
  }
}

export { CouplingContext };
