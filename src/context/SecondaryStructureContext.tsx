import * as React from 'react';

import { SECONDARY_STRUCTURE_SECTION } from '~chell-viz~/data';

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
  temporarySecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
  toggleSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
};

export type ISecondaryStructureContext = typeof initialSecondaryStructureContext;
export const SecondaryStructureContext = React.createContext(initialSecondaryStructureContext);
export const SecondaryStructureContextConsumer = SecondaryStructureContext.Consumer;

export class SecondaryStructureContextProvider extends React.Component<any, ISecondaryStructureContext> {
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
    const prevSelectedIndex = this.state.selectedSecondaryStructures.indexOf(sectionToRemove);
    const prevTempIndex = this.state.temporarySecondaryStructures.indexOf(sectionToRemove);
    this.setState({
      selectedSecondaryStructures: this.state.selectedSecondaryStructures.filter(
        (section, index) => index !== prevSelectedIndex,
      ),
      temporarySecondaryStructures: this.state.temporarySecondaryStructures.filter(
        (section, index) => index !== prevTempIndex,
      ),
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
