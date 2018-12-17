// tslint:disable:max-classes-per-file
import * as React from 'react';

import { SECONDARY_STRUCTURE_SECTION } from '~chell-viz~/data';

export const initialSecondaryStructContextRead = {
  hoveredSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
  selectedSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
};

export const initialSecondaryStructContextWrite = {
  addHoveredSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
  addSelectedSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
  clearAllSecondaryStructures: () => {
    return;
  },
  removeHoveredSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
  removeSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
};

export const initialSecondaryStructureContext = {
  ...initialSecondaryStructContextWrite,
  ...initialSecondaryStructContextRead,
};

export interface ISecondaryStructureProps {
  secondaryStructureContext: ISecondaryStructureContext;
}

export type ISecondaryStructureContextRead = typeof initialSecondaryStructContextRead;
export type ISecondaryStructureContextWrite = typeof initialSecondaryStructContextWrite;

export type ISecondaryStructureContext = ISecondaryStructureContextRead & ISecondaryStructureContextWrite;

export const SecondaryStructureContextRead = React.createContext(initialSecondaryStructContextRead);
export const SecondaryStructureContextWrite = React.createContext(initialSecondaryStructContextWrite);
export const SecondaryStructureContext = React.createContext(initialSecondaryStructureContext);

export const SecondaryStructureContextReadConsumer = SecondaryStructureContextRead.Consumer;
export const SecondaryStructureContextWriteConsumer = SecondaryStructureContextWrite.Consumer;
export const SecondaryStructureContextConsumer = SecondaryStructureContext.Consumer;

export class SecondaryStructureContextProvider extends React.Component<any, ISecondaryStructureContext> {
  public constructor(props: any) {
    super(props);
    this.state = {
      addHoveredSecondaryStructure: this.onAddHoveredSecondaryStructure(),
      addSelectedSecondaryStructure: this.onAddSelectedSecondaryStructure(),
      clearAllSecondaryStructures: this.onClearSecondaryStructure(),
      hoveredSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
      removeHoveredSecondaryStructure: this.onRemoveHoveredSecondaryStructure(),
      removeSecondaryStructure: this.onRemoveSecondaryStructure(),
      selectedSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
    };
  }

  public render() {
    return (
      <SecondaryStructureContextRead.Provider value={this.state}>
        <SecondaryStructureContextWrite.Provider value={this.state}>
          <SecondaryStructureContext.Provider value={this.state}>
            {this.props.children}
          </SecondaryStructureContext.Provider>
        </SecondaryStructureContextWrite.Provider>
      </SecondaryStructureContextRead.Provider>
    );
  }

  protected onAddHoveredSecondaryStructure = () => (section: SECONDARY_STRUCTURE_SECTION) => {
    if (!this.state.hoveredSecondaryStructures.includes(section)) {
      this.setState({
        hoveredSecondaryStructures: [...this.state.hoveredSecondaryStructures, section],
      });
    }
  };

  protected onAddSelectedSecondaryStructure = () => (section: SECONDARY_STRUCTURE_SECTION) => {
    if (!this.state.selectedSecondaryStructures.includes(section)) {
      this.setState({
        selectedSecondaryStructures: [...this.state.selectedSecondaryStructures, section],
      });
    }
  };

  protected onClearSecondaryStructure = () => () => {
    this.setState({
      hoveredSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
      selectedSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
    });
  };

  protected onRemoveHoveredSecondaryStructure = () => (sectionToRemove: SECONDARY_STRUCTURE_SECTION) => {
    const prevIndex = this.state.hoveredSecondaryStructures.findIndex(
      section =>
        section.label === sectionToRemove.label &&
        section.start === sectionToRemove.start &&
        section.end === sectionToRemove.end,
    );
    this.setState({
      hoveredSecondaryStructures: [
        ...this.state.hoveredSecondaryStructures.splice(0, prevIndex),
        ...this.state.hoveredSecondaryStructures.splice(prevIndex + 1),
      ],
    });
  };

  protected onRemoveSecondaryStructure = () => (sectionToRemove: SECONDARY_STRUCTURE_SECTION) => {
    const prevSelectedIndex = this.state.selectedSecondaryStructures.findIndex(
      section =>
        section.label === sectionToRemove.label &&
        section.start === sectionToRemove.start &&
        section.end === sectionToRemove.end,
    );
    const prevHoveredIndex = this.state.hoveredSecondaryStructures.findIndex(
      section =>
        section.label === sectionToRemove.label &&
        section.start === sectionToRemove.start &&
        section.end === sectionToRemove.end,
    );
    this.setState({
      hoveredSecondaryStructures: [
        ...this.state.hoveredSecondaryStructures.splice(0, prevHoveredIndex),
        ...this.state.hoveredSecondaryStructures.splice(prevHoveredIndex + 1),
      ],
      selectedSecondaryStructures: [
        ...this.state.selectedSecondaryStructures.splice(0, prevSelectedIndex),
        ...this.state.selectedSecondaryStructures.splice(prevSelectedIndex + 1),
      ],
    });
  };
}
