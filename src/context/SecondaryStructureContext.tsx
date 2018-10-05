import * as React from 'react';

import { SECONDARY_STRUCTURE_SECTION } from '~chell-viz~/data';

export interface ISecondaryStructureContext {
  selectedSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  temporarySecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  addSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  clearSecondaryStructure(): void;
  removeSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  toggleSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
}

export const initialSecondaryStructureContext: ISecondaryStructureContext = {
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
  temporarySecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
  toggleSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
};

export type SecondaryStructureContextState = Readonly<typeof initialSecondaryStructureContext>;

export const SecondaryStructureContext = React.createContext(initialSecondaryStructureContext);

export const SecondaryStructureContextConsumer = SecondaryStructureContext.Consumer;

export class SecondaryStructureContextProvider extends React.Component<any, SecondaryStructureContextState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      addSecondaryStructure: this.onAddSecondaryStructure(),
      clearSecondaryStructure: this.onClearSecondaryStructure(),
      removeSecondaryStructure: this.onRemoveSecondaryStructure(),
      selectedSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
      temporarySecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
      toggleSecondaryStructure: this.onToggleSecondaryStructure(),
    };
  }

  public render() {
    return (
      <SecondaryStructureContext.Provider value={this.state}>{this.props.children}</SecondaryStructureContext.Provider>
    );
  }

  protected onAddSecondaryStructure = () => (section: SECONDARY_STRUCTURE_SECTION) => {
    if (!this.state.selectedSecondaryStructures.includes(section)) {
      this.setState({
        selectedSecondaryStructures: [...this.state.selectedSecondaryStructures, section],
      });
    }
  };

  protected onClearSecondaryStructure = () => () => {
    this.setState({
      selectedSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
      temporarySecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
    });
  };

  protected onRemoveSecondaryStructure = () => (sectionToRemove: SECONDARY_STRUCTURE_SECTION) => {
    const prev = this.state.selectedSecondaryStructures;
    this.setState({
      selectedSecondaryStructures: prev.filter((section, index) => index !== prev.indexOf(sectionToRemove)),
      temporarySecondaryStructures: prev.filter((section, index) => index !== prev.indexOf(sectionToRemove)),
    });
  };

  protected onToggleSecondaryStructure = () => (sectionToToggle: SECONDARY_STRUCTURE_SECTION) => {
    const prev = this.state.temporarySecondaryStructures;
    if (this.state.temporarySecondaryStructures.includes(sectionToToggle)) {
      this.setState({
        temporarySecondaryStructures: prev.filter((section, index) => index !== prev.indexOf(section)),
      });
    } else {
      this.setState({
        temporarySecondaryStructures: [...this.state.temporarySecondaryStructures, sectionToToggle],
      });
    }
  };
}
