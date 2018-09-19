import * as React from 'react';

import { CellContext } from './CellContext';
import { ResidueContext } from './ResidueContext';
import { SecondaryStructureContext } from './SecondaryStructureContext';
import { SpringContext } from './SpringContext';

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
      <SecondaryStructureContext>
        <SpringContext>
          <CellContext>
            <ResidueContext>{this.props.children}</ResidueContext>
          </CellContext>
        </SpringContext>
      </SecondaryStructureContext>
    );
  }
}

export { ChellContext };
