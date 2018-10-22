import * as React from 'react';

import {
  ResidueContextConsumer,
  ResidueContextProvider,
  SecondaryStructureContextConsumer,
  SecondaryStructureContextProvider,
} from '~chell-viz~/context';
import { CouplingContainer } from '~chell-viz~/data';
import { ContextConsumerComposer } from '~chell-viz~/hoc';

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

export const withCouplingContext = (Comp: React.ComponentClass<any>) => (props: any) => (
  <ContextConsumerComposer components={[ResidueContextConsumer, SecondaryStructureContextConsumer]}>
    {([resContext, secStructContext]) => {
      return (
        <Comp
          {...props as any}
          residueContext={resContext as any}
          secondaryStructureContext={secStructContext as any}
        />
      );
    }}
  </ContextConsumerComposer>
);