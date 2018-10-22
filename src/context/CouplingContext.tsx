import * as React from 'react';

import { ResidueContextProvider, SecondaryStructureContextProvider } from '~chell-viz~/context';
import { CouplingContainer } from '~chell-viz~/data';

export const initialCouplingContext = {
  couplingScores: new CouplingContainer(),
};

export type ICouplingContext = typeof initialCouplingContext;
export const CouplingContext = React.createContext(initialCouplingContext);
export const CouplingContextConsumer = CouplingContext.Consumer;

/**
 * Shorthand for passing contexts relevant for Coupling Scores - Primarily interaction with residues and secondary structures.
 *
 * @export
 * @extends {React.Component<any, ICouplingContext>}
 */
export class CouplingContextProvider extends React.Component<any, ICouplingContext> {
  constructor(props: any) {
    super(props);
    this.state = initialCouplingContext;
  }

  public render() {
    return (
      <SecondaryStructureContextProvider>
        <ResidueContextProvider>
          <CouplingContext.Provider value={this.state}>{this.props.children}</CouplingContext.Provider>
        </ResidueContextProvider>
      </SecondaryStructureContextProvider>
    );
  }
}
