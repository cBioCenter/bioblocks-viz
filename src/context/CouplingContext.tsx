import * as React from 'react';

import { CouplingContainer } from '../data/CouplingContainer';
import { ResidueContext } from './ResidueContext';
import { SecondaryStructureContext } from './SecondaryStructureContext';

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
export class CouplingContext extends React.Component<any, ICouplingContext> {
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
          <CouplingContextWrapper.Provider value={this.state}>{this.props.children}</CouplingContextWrapper.Provider>
        </ResidueContext>
      </SecondaryStructureContext>
    );
  }
}

const CouplingContextWrapper = React.createContext(initialCouplingContext);

export default CouplingContextWrapper;
export { CouplingContextWrapper };
