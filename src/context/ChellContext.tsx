import * as React from 'react';

import { CellContext, ResidueContext, SecondaryStructureContext, SpringContext } from '~chell-viz~/context';

/**
 * Shorthand for passing all Chell contexts down.
 *
 * @export
 * @extends {React.Component<any, any>}
 */
export class ChellContext extends React.Component<any, any> {
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
