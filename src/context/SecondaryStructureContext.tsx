import * as React from 'react';
import { SECONDARY_STRUCTURE_SECTION } from '../data/chell-data';
import ToggleableContainer from '../data/ToggleableContainer';

export const initialSecondaryStructureContext = {
  selectedSecondaryStructures: new ToggleableContainer<SECONDARY_STRUCTURE_SECTION>(),
};

export type SecondaryStructureContextState = Readonly<typeof initialSecondaryStructureContext>;

export class SecondaryStructureContextHandler extends React.Component<any, SecondaryStructureContextState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      selectedSecondaryStructures: new ToggleableContainer<SECONDARY_STRUCTURE_SECTION>(),
    };
  }

  public render() {
    return (
      <SecondaryStructureContext.Provider value={this.state}>{this.props.children}</SecondaryStructureContext.Provider>
    );
  }
}

const SecondaryStructureContext = React.createContext(initialSecondaryStructureContext);

export default SecondaryStructureContext;
export { SecondaryStructureContext };
