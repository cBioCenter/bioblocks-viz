import { mount, ReactWrapper } from 'enzyme';
import * as NGL from 'ngl';
import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import toJson from 'enzyme-to-json';
import { initialResidueContext, IResidueContext } from '../../context/ResidueContext';
import { initialSecondaryStructureContext } from '../../context/SecondaryStructureContext';
import NGLComponent, { NGLComponentClass } from '../NGLComponent';

// https://medium.com/@ryandrewjohnson/unit-testing-components-using-reacts-new-context-api-4a5219f4b3fe
// Provides a dummy context for unit testing purposes.
const getComponentWithContext = (context: IResidueContext = { ...initialResidueContext }) => {
  jest.doMock('../../context/ResidueContext', () => {
    return {
      ResidueContext: {
        Consumer: (props: any) => props.children(context),
      },
    };
  });

  return require('../NGLComponent');
};

describe('NGLComponent', () => {
  const sampleData = {
    residueStore: {
      resno: [0, 1, 2, 3, 4],
    },
  };

  it("Should match existing snapshot when canvas isn't available.", () => {
    expect(Renderer.create(<NGLComponent />).toJSON()).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Should match existing snapshot when configuration is disabled', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} showConfiguration={false} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Should handle prop updates.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass />);
    const initialProps = wrapper.props();

    wrapper.setProps({
      hoveredResidues: [0],
    });

    expect(wrapper.props()).not.toEqual(initialProps);
  });

  it('Should handle data updates.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass />);

    wrapper.setProps({
      data: sampleData,
    });
  });

  it('Should handle candidate residue updates.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);

    wrapper.setProps({
      candidateResidues: [1, 2, 3],
    });
  });

  it('Should handle hovered residue updates.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);

    wrapper.setProps({
      hoveredResidues: [1, 2, 3],
    });
  });

  it('Should show the ball+stick representation for hovered residues.', () => {
    const expectedRep = 'ball+stick';
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
    const instance = wrapper.instance() as NGLComponentClass;

    wrapper.setProps({
      residueContext: {
        ...initialResidueContext,
        hoveredResidues: [1],
      },
    });

    expect(instance.state.activeRepresentations[0].name()).toEqual(expectedRep);
  });

  it('Should show the distance and ball+stick representation for locked residues.', () => {
    const expectedRep = ['ball+stick', 'distance', 'ball+stick', 'distance'];
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
    const instance = wrapper.instance() as NGLComponentClass;

    wrapper.setProps({
      residueContext: {
        ...initialResidueContext,
        lockedResiduePairs: new Map(
          Object.entries({
            '1,2': [1, 2],
            '3,4': [3, 4],
          }),
        ),
      },
    });

    const { activeRepresentations } = instance.state;
    for (let i = 0; i < activeRepresentations.length; i++) {
      expect(activeRepresentations[i].name()).toEqual(expectedRep[i]);
    }
  });

  it('Should show the distance and ball+stick representation for multiple hovered residues.', () => {
    const expectedRep = ['ball+stick', 'distance'];
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
    const instance = wrapper.instance() as NGLComponentClass;

    wrapper.setProps({
      residueContext: {
        ...initialResidueContext,
        hoveredResidues: [7, 8],
      },
    });

    wrapper.update();

    const { activeRepresentations } = instance.state;
    expect(activeRepresentations.length).toEqual(expectedRep.length);
    for (let i = 0; i < activeRepresentations.length; i++) {
      expect(activeRepresentations[i].name()).toEqual(expectedRep[i]);
    }
  });

  it('Should show the cartoon representation for selected secondary structures.', () => {
    const expectedRep = ['cartoon'];
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
    const instance = wrapper.instance() as NGLComponentClass;

    wrapper.setProps({
      secondaryStructureContext: {
        ...initialSecondaryStructureContext,
        selectedSecondaryStructures: [{ start: 1, end: 2 }],
      },
    });

    const { activeRepresentations } = instance.state;
    expect(activeRepresentations.length).toEqual(expectedRep.length);
    for (let i = 0; i < activeRepresentations.length; i++) {
      expect(activeRepresentations[i].name()).toEqual(expectedRep[i]);
    }
  });

  it('Should follow candidate selection flow.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);

    wrapper.setProps({
      lockedResiduePairs: new Map(
        Object.entries({
          '1,2': [1, 2],
        }),
      ),
    });
    wrapper.update();

    wrapper.setProps({
      lockedResiduePairs: new Map(
        Object.entries({
          '1,2': [1, 2],
          '3,4': [3, 4],
        }),
      ),
    });
    wrapper.update();
  });

  it('Should follow candidate residue selection flow.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);

    wrapper.setProps({
      candidateResidues: [1],
    });
    wrapper.update();

    wrapper.setProps({
      candidateResidues: [2],
    });
    wrapper.update();
  });

  it('Should call appropriate residue clearing callback.', () => {
    const Component = getComponentWithContext();
    const removeSpy = jest.fn();
    const wrapper = mount(<Component.NGLComponentClass residueContext={{ removeAllLockedResiduePairs: removeSpy }} />);
    wrapper.find('Button').simulate('click');
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });

  it('Should unmount correctly.', () => {
    const Component = getComponentWithContext();
    const wrapper = mount(<Component.NGLComponentClass />);
    expect(wrapper.get(0)).not.toBeNull();
    wrapper.unmount();
    expect(wrapper.get(0)).toBeUndefined();
  });

  describe('Events', () => {
    const simulateHoverEvent = (wrapper: ReactWrapper<any, any>, opts: object) => {
      const instance = wrapper.instance() as NGLComponentClass;
      instance.state.stage!.mouseControls.run(NGL.MouseActions.HOVER_PICK, instance.state.stage, opts);
    };

    const simulateClickEvent = (wrapper: ReactWrapper<any, any>, opts?: object) => {
      const instance = wrapper.instance() as NGLComponentClass;
      instance.state.stage!.signals.clicked.dispatch(opts);
    };

    it('Should handle hover events when there is no hovered or candidate residue.', async () => {
      const Component = getComponentWithContext();
      const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);

      const removeHoveredResiduesSpy = jest.fn();
      wrapper.setProps({
        residueContext: {
          ...initialResidueContext,
          candidateResidues: [],
          removeHoveredResidues: removeHoveredResiduesSpy,
        },
      });
      simulateHoverEvent(wrapper, { atom: { resno: 3 } });
      simulateHoverEvent(wrapper, { closestBondAtom: { resno: 3 } });
      simulateHoverEvent(wrapper, {});
      expect(removeHoveredResiduesSpy).toHaveBeenCalledTimes(0);
    });

    it('Should handle hover events when there is a hovered residue but no candidate.', async () => {
      const Component = getComponentWithContext();
      const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);

      const removeHoveredResiduesSpy = jest.fn();
      wrapper.setProps({
        residueContext: {
          ...initialResidueContext,
          candidateResidues: [],
          hoveredResidues: [3],
          removeHoveredResidues: removeHoveredResiduesSpy,
        },
      });
      simulateHoverEvent(wrapper, { atom: { resno: 3 } });
      simulateHoverEvent(wrapper, {});
      expect(removeHoveredResiduesSpy).toHaveBeenCalledTimes(1);
    });

    it('Should clear candidate and hovered residues when the mouse leaves the canvas.', async () => {
      const Component = getComponentWithContext();
      const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
      const removeNonLockedResiduesSpy = jest.fn();

      wrapper.setProps({
        residueContext: {
          ...initialResidueContext,
          candidateResidues: [3],
          hoveredResidues: [4],
          removeNonLockedResidues: removeNonLockedResiduesSpy,
        },
      });

      wrapper.find('.NGLCanvas').simulate('mouseleave');
      expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
    });

    // @ts-ignore
    // TODO Add each to official jest types - Jest is as v23 but types are for v22 so far.
    it.each([{ atom: { resno: 4 } }, { closestBondAtom: { resno: 4 } }])(
      'Should handle click events by creating a locked residue pair if there is a candidate.',
      async (pickingResult: NGL.PickingProxy) => {
        const addLockedSpy = jest.fn();
        const Component = getComponentWithContext();
        const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
        wrapper.setProps({
          residueContext: {
            ...initialResidueContext,
            addLockedResiduePair: addLockedSpy,
            candidateResidues: [2],
          },
        });
        simulateClickEvent(wrapper, pickingResult);
        expect(addLockedSpy).toHaveBeenCalledWith([2, 4]);
      },
    );

    // @ts-ignore
    // TODO Add each to official jest types - Jest is as v23 but types are for v22 so far.
    it.each([{ atom: { resno: 4 } }, { closestBondAtom: { resno: 4 } }])(
      'Should handle click events by creating a candidate residue when none is present.',
      async (pickingResult: NGL.PickingProxy) => {
        const addCandidateSpy = jest.fn();
        const Component = getComponentWithContext();
        const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
        wrapper.setProps({
          residueContext: {
            ...initialResidueContext,
            addCandidateResidues: addCandidateSpy,
          },
        });
        simulateClickEvent(wrapper, pickingResult);
        expect(addCandidateSpy).toHaveBeenCalledWith([4]);
      },
    );

    it('Should handle clicking on a distance representation.', async () => {
      const Component = getComponentWithContext();
      const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
      const removedLockedSpy = jest.fn();
      (wrapper.state('structureComponent') as NGL.StructureComponent).addRepresentation('distance');
      wrapper.setProps({
        residueContext: {
          ...initialResidueContext,
          lockedResiduePairs: new Map(
            Object.entries({
              '4,7': [4, 7],
            }),
          ),
          removeLockedResiduePair: removedLockedSpy,
        },
      });
      simulateClickEvent(wrapper, {
        distance: { atom1: { resno: 4 }, atom2: { resno: 7 } },
        picker: { type: 'distance' },
      });
      expect(removedLockedSpy).toHaveBeenLastCalledWith([4, 7]);
    });

    it('Should handle clicking off-component.', async () => {
      const expected = new Array<string>();
      const Component = getComponentWithContext();
      const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
      const removeNonLockedResiduesSpy = jest.fn();
      wrapper.setProps({
        residueContext: {
          ...initialResidueContext,
          hoveredResidues: [1],
          removeNonLockedResidues: removeNonLockedResiduesSpy,
        },
      });
      expect(wrapper.state('activeRepresentations')).not.toEqual(expected);
      simulateClickEvent(wrapper, undefined);
      expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
    });

    it('Should add the hovered residue if the user clicks within a certain distance (snapping).', async () => {
      const expected = new Array<string>();
      const Component = getComponentWithContext();
      const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
      const addLockedResiduePairSpy = jest.fn();
      wrapper.setProps({
        residueContext: {
          ...initialResidueContext,
          addLockedResiduePair: addLockedResiduePairSpy,
          candidateResidues: [0],
          hoveredResidues: [1],
        },
      });
      expect(wrapper.state('activeRepresentations')).not.toEqual(expected);
      simulateClickEvent(wrapper, undefined);
      expect(addLockedResiduePairSpy).toHaveBeenCalledTimes(1);
    });

    it('Should remove the hovered residue if the user clicks within beyond a certain distance (snapping).', async () => {
      const expected = new Array<string>();
      const Component = getComponentWithContext();
      const wrapper = mount(<Component.NGLComponentClass data={sampleData} />);
      const removeNonLockedResiduesSpy = jest.fn();
      wrapper.setProps({
        residueContext: {
          ...initialResidueContext,
          candidateResidues: [0],
          hoveredResidues: [51],
          removeNonLockedResidues: removeNonLockedResiduesSpy,
        },
      });
      expect(wrapper.state('activeRepresentations')).not.toEqual(expected);
      simulateClickEvent(wrapper, undefined);
      expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
    });

    it('Should handle pressing ESC.', async () => {
      const Component = getComponentWithContext();
      const removeNonLockedResiduesSpy = jest.fn();
      const wrapper = mount(
        <Component.NGLComponentClass
          data={sampleData}
          residueContext={{
            ...initialResidueContext,
            candidateResidues: [1],
            hoveredResidues: [2],
            removeNonLockedResidues: removeNonLockedResiduesSpy,
          }}
        />,
      );

      wrapper.find('.NGLCanvas').simulate('keyDown', { keyCode: 27 });
      expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
    });
  });
});
