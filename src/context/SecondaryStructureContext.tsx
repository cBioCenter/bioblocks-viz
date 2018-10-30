import * as React from 'react';

import { SECONDARY_STRUCTURE_SECTION } from '~chell-viz~/data';

export const initialSecondaryStructureContext = {
  addHoveredSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
  addSelectedSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
  clearAllSecondaryStructures: () => {
    return;
  },
  hoveredSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
  removeHoveredSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
  removeSecondaryStructure: (section: SECONDARY_STRUCTURE_SECTION) => {
    return;
  },
  selectedSecondaryStructures: new Array<SECONDARY_STRUCTURE_SECTION>(),
};

export interface ISecondaryStructureProps {
  secondaryStructureContext: ISecondaryStructureContext;
}

export type ISecondaryStructureContext = typeof initialSecondaryStructureContext;
export const SecondaryStructureContext = React.createContext(initialSecondaryStructureContext);
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
      <SecondaryStructureContext.Provider value={this.state}>{this.props.children}</SecondaryStructureContext.Provider>
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

export const withSecondaryStructureContext = <P extends ISecondaryStructureProps>(
  WrappedComponent: React.ComponentType<P>,
) =>
  // tslint:disable-next-line:max-classes-per-file
  class SecondaryStructureContextHOC extends React.Component<any> {
    public static WrappedComponent = WrappedComponent;

    public render() {
      return (
        <SecondaryStructureContextConsumer>
          {secondaryStructureContext => (
            <WrappedComponent secondaryStructureContext={secondaryStructureContext} {...this.props} />
          )}
        </SecondaryStructureContextConsumer>
      );
    }
  };
