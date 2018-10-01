import * as React from 'react';

import { CouplingContainer } from '../data/CouplingContainer';
import { ResidueContext, ResidueContextWrapper } from './ResidueContext';
import { SecondaryStructureContext, SecondaryStructureContextWrapper } from './SecondaryStructureContext';

export const initialCouplingContext = {
  couplingScores: new CouplingContainer(),
};

export type ICouplingContext = typeof initialCouplingContext;

/**
 * Shorthand for passing contexts relevant for Coupling Scores - Primarily interaction with residues and secondary structures.
 *
 * @export
 * @extends {React.Component<any, ICouplingContext>}
 */
export class CouplingContextClass extends React.Component<any, ICouplingContext> {
  constructor(props: any) {
    super(props);
    this.state = {
      couplingScores: new CouplingContainer(),
    };
  }

  public render() {
    return (
      <SecondaryStructureContext>
        <ResidueContext>
          <CouplingContext.Provider value={this.state}>{this.props.children}</CouplingContext.Provider>
        </ResidueContext>
      </SecondaryStructureContext>
    );
  }
}

export const CouplingContext = React.createContext(initialCouplingContext);

const withCouplingContext = (Component: any) => {
  return function CouplingContextWrapper(props: any) {
    return (
      <CouplingContext.Consumer>
        {couplingContext => (
          <SecondaryStructureContextWrapper.Consumer>
            {secStructContext => (
              <ResidueContextWrapper.Consumer>
                {residueContext => (
                  <Component
                    {...props}
                    residueContext={{ ...residueContext }}
                    secondaryStructureContext={{ ...secStructContext }}
                    couplingContext={{ ...couplingContext }}
                  />
                )}
              </ResidueContextWrapper.Consumer>
            )}
          </SecondaryStructureContextWrapper.Consumer>
        )}
      </CouplingContext.Consumer>
    );
  };
};

export default withCouplingContext;
export { withCouplingContext };
