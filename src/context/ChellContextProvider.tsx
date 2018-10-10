import * as React from 'react';

import {
  CellContextProvider,
  ResidueContextProvider,
  SecondaryStructureContextProvider,
  SpringContextProvider,
} from '~chell-viz~/context';

/**
 * Shorthand for passing all Chell contexts down.
 *
 * @export
 * @extends {React.Component<any, any>}
 */
export class ChellContextProvider extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <SecondaryStructureContextProvider>
        <SpringContextProvider>
          <CellContextProvider>
            <ResidueContextProvider>{this.props.children}</ResidueContextProvider>
          </CellContextProvider>
        </SpringContextProvider>
      </SecondaryStructureContextProvider>
    );
  }
}
