import { mount } from 'enzyme';
import * as React from 'react';

import {
  initialSecondaryStructureContext,
  ISecondaryStructureContext,
  SecondaryStructureContextConsumer,
  SecondaryStructureContextProvider,
} from '~chell-viz~/context';
import { Chell1DSection, SECONDARY_STRUCTURE_KEYS } from '~chell-viz~/data';
import { genSecondaryStructureSection, MockContextClass } from '~chell-viz~/test';

describe('SecondaryStructureContext', () => {
  interface IMockContextConsumerProps {
    secondaryStructureContext: ISecondaryStructureContext;
  }

  let MockWrappedElement: JSX.Element;
  let MockContextConsumer: JSX.Element;
  let MockContextProvider: JSX.Element;
  beforeEach(() => {
    MockContextConsumer = (
      <SecondaryStructureContextConsumer>
        {secondaryStructureContext => {
          MockWrappedElement = <MockContextClass secondaryStructureContext={secondaryStructureContext} />;

          return MockWrappedElement;
        }}
      </SecondaryStructureContextConsumer>
    );
    MockContextProvider = <SecondaryStructureContextProvider>{MockContextConsumer}</SecondaryStructureContextProvider>;
  });

  describe('Consumer', () => {
    it('Should allow components to consume a secondary structure context.', () => {
      const wrapper = mount(MockContextConsumer);
      expect(wrapper).toMatchSnapshot();
      const props = wrapper.props() as IMockContextConsumerProps;
      expect(props.secondaryStructureContext).toEqual(initialSecondaryStructureContext);
    });

    it('Should have default implementations if no provider is provided.', () => {
      mount(MockContextConsumer);
      const context = (MockWrappedElement.props as IMockContextConsumerProps).secondaryStructureContext;
      const sectionToAdd = new Chell1DSection('B' as SECONDARY_STRUCTURE_KEYS, 0, 5);

      context.addSelectedSecondaryStructure(sectionToAdd);
      context.addHoveredSecondaryStructure(sectionToAdd);
      expect(context.selectedSecondaryStructures).toEqual([]);
      expect(context.hoveredSecondaryStructures).toEqual([]);
      context.removeHoveredSecondaryStructure(sectionToAdd);
      context.removeSecondaryStructure(sectionToAdd);
      context.clearAllSecondaryStructures();
      expect(context.selectedSecondaryStructures).toEqual([]);
      expect(context.hoveredSecondaryStructures).toEqual([]);
    });
  });

  describe('Provider', () => {
    it('Should allow components to be provided a secondary structure context.', () => {
      const wrapper = mount(MockContextProvider);
      expect(wrapper).toMatchSnapshot();
    });

    it('Should handle adding a selected secondary structure.', () => {
      const wrapper = mount(MockContextProvider);
      const context = (MockWrappedElement.props as IMockContextConsumerProps).secondaryStructureContext;
      const instance = wrapper.instance() as SecondaryStructureContextProvider;
      const sectionToAdd = new Chell1DSection('B' as SECONDARY_STRUCTURE_KEYS, 0, 5);

      context.addSelectedSecondaryStructure(sectionToAdd);
      expect(instance.state.selectedSecondaryStructures).toEqual([sectionToAdd]);
    });

    it('Should handle adding a hovered secondary structure.', () => {
      const wrapper = mount(MockContextProvider);
      const context = (MockWrappedElement.props as IMockContextConsumerProps).secondaryStructureContext;
      const instance = wrapper.instance() as SecondaryStructureContextProvider;
      const sectionToAdd = new Chell1DSection('C' as SECONDARY_STRUCTURE_KEYS, 4, 5);

      context.addHoveredSecondaryStructure(sectionToAdd);
      expect(instance.state.hoveredSecondaryStructures).toEqual([sectionToAdd]);
    });

    it('Should handle removing a selected secondary structure.', () => {
      const wrapper = mount(MockContextProvider);
      const context = (MockWrappedElement.props as IMockContextConsumerProps).secondaryStructureContext;
      const instance = wrapper.instance() as SecondaryStructureContextProvider;
      const sectionToAdd = new Chell1DSection('B' as SECONDARY_STRUCTURE_KEYS, 0, 5);

      context.addSelectedSecondaryStructure(sectionToAdd);
      expect(instance.state.selectedSecondaryStructures).toEqual([sectionToAdd]);
      context.removeSecondaryStructure(sectionToAdd);
      expect(instance.state.selectedSecondaryStructures).toEqual([]);
    });

    it('Should remove the hovered and selected secondary structure if removing the selection.', () => {
      const wrapper = mount(MockContextProvider);
      const context = (MockWrappedElement.props as IMockContextConsumerProps).secondaryStructureContext;
      const instance = wrapper.instance() as SecondaryStructureContextProvider;
      const sectionToAdd = new Chell1DSection('B' as SECONDARY_STRUCTURE_KEYS, 0, 5);

      context.addHoveredSecondaryStructure(sectionToAdd);
      context.addSelectedSecondaryStructure(sectionToAdd);
      expect(instance.state.selectedSecondaryStructures).toEqual([sectionToAdd]);
      context.removeSecondaryStructure(sectionToAdd);
      expect(instance.state.hoveredSecondaryStructures).toEqual([]);
      expect(instance.state.selectedSecondaryStructures).toEqual([]);
    });

    it('Should handle removing a hovered secondary structure.', () => {
      const wrapper = mount(MockContextProvider);
      const context = (MockWrappedElement.props as IMockContextConsumerProps).secondaryStructureContext;
      const instance = wrapper.instance() as SecondaryStructureContextProvider;
      const sections = genSecondaryStructureSection('G', 40, 4);

      context.addHoveredSecondaryStructure(sections[0]);
      expect(instance.state.hoveredSecondaryStructures).toEqual(genSecondaryStructureSection('G', 40, 4));
      context.removeHoveredSecondaryStructure(sections[0]);
      expect(instance.state.selectedSecondaryStructures).toEqual([]);
    });

    it('Should not toggle a secondary structure that is already selected.', () => {
      const wrapper = mount(MockContextProvider);
      const context = (MockWrappedElement.props as IMockContextConsumerProps).secondaryStructureContext;
      const instance = wrapper.instance() as SecondaryStructureContextProvider;
      const sections = genSecondaryStructureSection('B', 10, 3);

      context.addSelectedSecondaryStructure(sections[0]);
      context.addHoveredSecondaryStructure(sections[0]);
      expect(instance.state.selectedSecondaryStructures).toEqual(sections);
      context.addHoveredSecondaryStructure(sections[0]);
      expect(instance.state.selectedSecondaryStructures).toEqual(sections);
    });

    it('Should handle removing all secondary structures.', () => {
      const wrapper = mount(MockContextProvider);
      const context = (MockWrappedElement.props as IMockContextConsumerProps).secondaryStructureContext;
      const instance = wrapper.instance() as SecondaryStructureContextProvider;
      const sections = genSecondaryStructureSection('C', 12, 15);

      context.addSelectedSecondaryStructure(sections[0]);
      context.addHoveredSecondaryStructure(sections[0]);
      expect(instance.state.selectedSecondaryStructures).toEqual(sections);
      expect(instance.state.hoveredSecondaryStructures).toEqual(sections);
      context.clearAllSecondaryStructures();
      expect(instance.state.selectedSecondaryStructures).toEqual([]);
      expect(instance.state.hoveredSecondaryStructures).toEqual([]);
    });
  });
});
