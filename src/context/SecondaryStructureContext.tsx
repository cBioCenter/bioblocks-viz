import * as React from 'react';
import { SECONDARY_STRUCTURE_SECTION } from '../data/chell-data';

export const initialSecondaryStructureContext = {
  addSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
  clearSecondaryStructure: () => {
    return;
  },
  removeSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
  selectedSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
  toggleSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
};

export type SecondaryStructureContextState = Readonly<typeof initialSecondaryStructureContext>;

export class SecondaryStructureContextHandler extends React.Component<any, SecondaryStructureContextState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      addSecondaryStructure: this.onAddSecondaryStructure(),
      clearSecondaryStructure: this.onClearSecondaryStructure(),
      removeSecondaryStructure: this.onRemoveSecondaryStructure(),
      selectedSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
      toggleSecondaryStructure: this.onToggleSecondaryStructure(),
    };
  }

  public render() {
    return (
      <SecondaryStructureContext.Provider value={this.state}>{this.props.children}</SecondaryStructureContext.Provider>
    );
  }

  protected onAddSecondaryStructure = () => (section: SECONDARY_STRUCTURE_SECTION) => {
    this.setState({
      selectedSecondaryStructures: [...this.state.selectedSecondaryStructures, section],
    });
  };

  protected onClearSecondaryStructure = () => () => {
    this.setState({
      selectedSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
    });
  };

  protected onRemoveSecondaryStructure = () => (sectionToRemove: SECONDARY_STRUCTURE_SECTION) => {
    const prev = this.state.selectedSecondaryStructures;
    this.setState({
      selectedSecondaryStructures: prev.filter((section, index) => index !== prev.indexOf(sectionToRemove)),
    });
  };

  protected onToggleSecondaryStructure = () => (section: SECONDARY_STRUCTURE_SECTION) => {
    if (this.state.selectedSecondaryStructures.includes(section)) {
      this.onRemoveSecondaryStructure()(section);
    } else {
      this.onAddSecondaryStructure()(section);
    }
  };
}

const SecondaryStructureContext = React.createContext(initialSecondaryStructureContext);

export default SecondaryStructureContext;
export { SecondaryStructureContext };
