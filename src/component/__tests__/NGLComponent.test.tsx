import { mount, ReactWrapper, shallow } from 'enzyme';
import * as NGL from 'ngl';
import * as React from 'react';

import { Checkbox, Popup } from 'semantic-ui-react';
import { NGLComponent } from '~bioblocks-viz~/component';
import { BioblocksPDB, CONTACT_DISTANCE_PROXIMITY } from '~bioblocks-viz~/data';

describe('NGLComponent', () => {
  let sampleData: BioblocksPDB[];

  beforeEach(() => {
    const nglStructure = new NGL.Structure('sample');
    nglStructure.residueStore.resno = new Uint32Array([0, 1, 2, 3, 4]);
    sampleData = [BioblocksPDB.createPDBFromNGLData(nglStructure)];
  });

  it('Should match existing snapshot when unconnected to a context.', () => {
    expect(shallow(<NGLComponent />)).toMatchSnapshot();
  });

  it('Should handle a data reset.', () => {
    const wrapper = mount(<NGLComponent />);
    const initialProps = wrapper.props();

    wrapper.setProps({
      data: sampleData,
    });

    expect(wrapper.props()).not.toEqual(initialProps);
  });

  it('Should handle prop updates.', () => {
    const wrapper = mount(<NGLComponent />);
    const initialProps = wrapper.props();

    wrapper.setProps({
      hoveredResidues: [0],
    });

    expect(wrapper.props()).not.toEqual(initialProps);
  });

  it('Should handle candidate residue updates.', () => {
    const wrapper = shallow(<NGLComponent predictedProteins={sampleData} />);

    wrapper.setProps({
      candidateResidues: [1, 2, 3],
    });
  });

  it('Should handle hovered residue updates.', () => {
    const wrapper = shallow(<NGLComponent predictedProteins={sampleData} />);

    wrapper.setProps({
      hoveredResidues: [1, 2, 3],
    });
  });

  it('Should show the ball+stick representation for hovered residues.', () => {
    const expectedRep = 'ball+stick';
    const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
    const instance = wrapper.instance() as NGLComponent;

    wrapper.setProps({
      hoveredResidues: [1],
    });

    wrapper.update();

    expect(instance.state.activeRepresentations.predicted.reps[0].name()).toEqual(expectedRep);
  });

  it('Should show the distance and ball+stick representation for locked residues for C-Alpha proximity.', () => {
    const expectedRep = ['ball+stick', 'distance', 'ball+stick', 'distance'];
    const wrapper = shallow(<NGLComponent predictedProteins={sampleData} />);
    const instance = wrapper.instance() as NGLComponent;

    wrapper.setProps({
      lockedResiduePairs: new Map(
        Object.entries({
          '1,2': [1, 2],
          '3,4': [3, 4],
        }),
      ),
    });

    const { activeRepresentations } = instance.state;
    for (let i = 0; i < activeRepresentations.experimental.reps.length; i++) {
      expect(activeRepresentations.experimental.reps[i].name()).toEqual(expectedRep[i]);
    }
  });

  it('Should show the distance and ball+stick representation for locked residues for Closest distance proximity.', () => {
    const expectedRep = ['ball+stick', 'distance', 'ball+stick', 'distance'];
    const wrapper = shallow(
      <NGLComponent predictedProteins={sampleData} measuredProximity={CONTACT_DISTANCE_PROXIMITY.CLOSEST} />,
    );
    const instance = wrapper.instance() as NGLComponent;

    wrapper.setProps({
      lockedResiduePairs: new Map(
        Object.entries({
          '1,2': [1, 2],
          '3,4': [3, 4],
        }),
      ),
    });

    const { activeRepresentations } = instance.state;
    for (let i = 0; i < activeRepresentations.experimental.reps.length; i++) {
      expect(activeRepresentations.experimental.reps[i].name()).toEqual(expectedRep[i]);
    }
  });

  it('Should show the distance and ball+stick representation for multiple hovered residues.', () => {
    const expectedRep = ['ball+stick', 'distance'];
    const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
    const instance = wrapper.instance() as NGLComponent;

    wrapper.setProps({
      hoveredResidues: [7, 8],
    });

    wrapper.update();

    const { activeRepresentations } = instance.state;
    expect(activeRepresentations.predicted.reps.length).toEqual(expectedRep.length);
    for (let i = 0; i < activeRepresentations.predicted.reps.length; i++) {
      expect(activeRepresentations.predicted.reps[i].name()).toEqual(expectedRep[i]);
    }
  });

  it('Should show the cartoon representation for selected secondary structures.', () => {
    const expectedRep = ['cartoon'];
    const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
    const instance = wrapper.instance() as NGLComponent;

    wrapper.setProps({
      selectedSecondaryStructures: [{ start: 1, end: 2 }],
    });

    const { activeRepresentations } = instance.state;
    expect(activeRepresentations.predicted.reps.length).toEqual(expectedRep.length);
    for (let i = 0; i < activeRepresentations.predicted.reps.length; i++) {
      expect(activeRepresentations.predicted.reps[i].name()).toEqual(expectedRep[i]);
    }
  });

  it('Should follow candidate selection flow.', () => {
    const wrapper = shallow(<NGLComponent predictedProteins={sampleData} />);

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

  it.skip('Should follow candidate residue selection flow.', () => {
    const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
    const activeReps = (wrapper.instance() as NGLComponent).state.activeRepresentations;

    wrapper.setProps({
      candidateResidues: [1],
      hoveredResidues: [1],
    });

    wrapper.setProps({
      candidateResidues: [2],
    });
    expect((wrapper.instance() as NGLComponent).state.activeRepresentations.predicted).not.toEqual(
      activeReps.predicted,
    );
  });

  it.skip('Should call appropriate residue clearing callback.', () => {
    const removeSpy = jest.fn();
    const wrapper = shallow(<NGLComponent removeAllLockedResiduePairs={removeSpy} />);
    wrapper
      .find('#clear-selections-0')
      .at(0)
      .simulate('click');
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });

  it('Should unmount correctly.', () => {
    const wrapper = shallow(<NGLComponent />);
    expect(wrapper.get(0)).not.toBeNull();
    wrapper.unmount();
    expect(wrapper.get(0)).toBeNull();
  });

  describe('Events', () => {
    const simulateHoverEvent = (wrapper: ReactWrapper<any, any>, opts: object) => {
      const instance = wrapper.instance() as NGLComponent;
      const { stage } = instance.state;
      if (stage) {
        stage.mouseControls.run('hoverPick', instance.state.stage, opts);
      } else {
        expect(stage).not.toBeUndefined();
      }
    };

    const simulateClickEvent = (wrapper: ReactWrapper<any, any>, opts?: object) => {
      const instance = wrapper.instance() as NGLComponent;
      const { stage } = instance.state;
      if (stage) {
        stage.signals.clicked.dispatch(opts);
      } else {
        expect(stage).not.toBeUndefined();
      }
    };

    it('Should handle hover events when there is no hovered or candidate residue.', async () => {
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);

      const removeHoveredResiduesSpy = jest.fn();
      wrapper.setProps({
        candidateResidues: [],
        removeHoveredResidues: removeHoveredResiduesSpy,
      });
      simulateHoverEvent(wrapper, { atom: { resno: 3, resname: 'ARG' } });
      simulateHoverEvent(wrapper, { closestBondAtom: { resno: 3, resname: 'GLY' } });
      simulateHoverEvent(wrapper, {});
      expect(removeHoveredResiduesSpy).toHaveBeenCalledTimes(0);
    });

    it('Should handle hover events when the residue name is not one of the 20 common Amino Acids.', async () => {
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);

      const removeHoveredResiduesSpy = jest.fn();
      wrapper.setProps({
        candidateResidues: [],
        removeHoveredResidues: removeHoveredResiduesSpy,
      });
      simulateHoverEvent(wrapper, { atom: { resno: 3, resname: 'FOO' } });
      simulateHoverEvent(wrapper, { closestBondAtom: { resno: 3, resname: 'BAR' } });
      simulateHoverEvent(wrapper, {});
      expect(removeHoveredResiduesSpy).toHaveBeenCalledTimes(0);
    });

    it('Should handle hover events when there is a hovered residue but no candidate.', async () => {
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);

      const removeHoveredResiduesSpy = jest.fn();
      wrapper.setProps({
        candidateResidues: [],
        hoveredResidues: [3],
        removeHoveredResidues: removeHoveredResiduesSpy,
      });
      simulateHoverEvent(wrapper, { atom: { resno: 3, resname: 'ALA' } });
      simulateHoverEvent(wrapper, {});
      expect(removeHoveredResiduesSpy).toHaveBeenCalledTimes(1);
    });

    it('Should clear candidate and hovered residues when the mouse leaves the canvas.', async () => {
      const wrapper = shallow(<NGLComponent predictedProteins={sampleData} />);
      const removeNonLockedResiduesSpy = jest.fn();

      wrapper.setProps({
        candidateResidues: [3],
        hoveredResidues: [4],
        removeNonLockedResidues: removeNonLockedResiduesSpy,
      });

      wrapper.find('.NGLCanvas').simulate('mouseleave');
      expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
    });

    // tslint:disable-next-line:mocha-no-side-effect-code
    it.each([{ atom: { resno: 4, resname: 'ARG' } }, { closestBondAtom: { resno: 4, resname: 'ARG' } }])(
      'Should handle click events by creating a locked residue pair if there is a candidate.',
      async (pickingResult: NGL.PickingProxy) => {
        const addLockedSpy = jest.fn();
        const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
        wrapper.setProps({
          addLockedResiduePair: addLockedSpy,
          candidateResidues: [2],
        });
        simulateClickEvent(wrapper, pickingResult);
        expect(addLockedSpy).toHaveBeenCalledWith({ '2,4': [2, 4] });
      },
    );

    // tslint:disable-next-line:mocha-no-side-effect-code
    it.each([{ atom: { resno: 4 } }, { closestBondAtom: { resno: 4 } }])(
      'Should handle click events by creating a candidate residue when none is present.',
      async (pickingResult: NGL.PickingProxy) => {
        const addCandidateSpy = jest.fn();
        const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
        wrapper.setProps({
          addCandidateResidues: addCandidateSpy,
        });
        simulateClickEvent(wrapper, pickingResult);
        expect(addCandidateSpy).toHaveBeenCalledWith([4]);
      },
    );

    it('Should handle clicking on a distance representation.', async () => {
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
      const removedLockedSpy = jest.fn();
      const stage: NGL.Stage = wrapper.state('stage');
      const structureComponent = stage.compList[0] as NGL.StructureComponent;
      structureComponent.addRepresentation('distance');
      wrapper.setProps({
        lockedResiduePairs: new Map(
          Object.entries({
            '4,7': [4, 7],
          }),
        ),
        removeLockedResiduePair: removedLockedSpy,
      });
      simulateClickEvent(wrapper, {
        distance: { atom1: { resno: 4 }, atom2: { resno: 7 } },
        picker: { type: 'distance' },
      });
      expect(removedLockedSpy).toHaveBeenLastCalledWith('4,7');
    });

    it('Should handle clicking off-component.', async () => {
      const expected = new Array<string>();
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
      const removeNonLockedResiduesSpy = jest.fn();
      wrapper.setProps({
        hoveredResidues: [1],
        removeNonLockedResidues: removeNonLockedResiduesSpy,
      });
      expect(wrapper.state('activeRepresentations')).not.toEqual(expected);
      simulateClickEvent(wrapper, undefined);
      expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
    });

    it('Should add the hovered residue if the user clicks within a certain distance (snapping).', async () => {
      const expected = new Array<string>();
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
      const addLockedResiduePairSpy = jest.fn();
      wrapper.setProps({
        addLockedResiduePair: addLockedResiduePairSpy,
        candidateResidues: [0],
        hoveredResidues: [1],
      });
      expect(wrapper.state('activeRepresentations')).not.toEqual(expected);
      simulateClickEvent(wrapper, undefined);
      expect(addLockedResiduePairSpy).toHaveBeenCalledTimes(1);
    });

    it('Should remove the hovered residue if the user clicks within beyond a certain distance (snapping).', async () => {
      const expected = new Array<string>();
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
      const removeNonLockedResiduesSpy = jest.fn();
      wrapper.setProps({
        candidateResidues: [0],
        hoveredResidues: [51],
        removeNonLockedResidues: removeNonLockedResiduesSpy,
      });
      expect(wrapper.state('activeRepresentations')).not.toEqual(expected);
      simulateClickEvent(wrapper, undefined);
      expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
    });

    it('Should handle pressing ESC.', async () => {
      const removeNonLockedResiduesSpy = jest.fn();
      const wrapper = mount(
        <NGLComponent
          predictedProteins={sampleData}
          candidateResidues={[1]}
          hoveredResidues={[2]}
          removeNonLockedResidues={removeNonLockedResiduesSpy}
        />,
      );

      wrapper.find('.NGLCanvas').simulate('keyDown', { keyCode: 27 });
      expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
    });

    it('Should handle onResize events.', () => {
      const onResizeSpy = jest.fn();
      expect(() => shallow(<NGLComponent onResize={onResizeSpy} />)).not.toThrow();

      global.dispatchEvent(new Event('resize'));
      expect(onResizeSpy).toHaveBeenCalledTimes(1);
    });

    it('Should remove the onResize handler when unmounted.', async () => {
      const onResizeSpy = jest.fn();
      const wrapper = shallow(<NGLComponent onResize={onResizeSpy} />);
      wrapper.unmount();
      global.dispatchEvent(new Event('resize'));
      expect(onResizeSpy).toHaveBeenCalledTimes(0);
    });

    it('Should ignore focus events.', () => {
      const onFocusSpy = jest.fn();
      HTMLDivElement.prototype.focus = onFocusSpy;

      const wrapper = mount(<NGLComponent />);
      const instance = wrapper.instance() as NGLComponent;
      if (instance.canvas && instance.state.stage) {
        instance.canvas.dispatchEvent(new Event('focus'));
        instance.state.stage.keyBehavior.domElement.focus();
        expect(onFocusSpy).not.toBeCalled();
      } else {
        expect(instance.canvas).not.toBeNull();
        expect(instance.state.stage).not.toBeNull();
      }
    });
  });

  describe('Configurations', () => {
    it('Should handle changing the measuring proximity.', () => {
      const onMeasuredProximityChangeSpy = jest.fn();
      const wrapper = mount(<NGLComponent onMeasuredProximityChange={onMeasuredProximityChangeSpy} />);
      const expected = CONTACT_DISTANCE_PROXIMITY.CLOSEST;
      expect((wrapper.instance() as NGLComponent).props.measuredProximity).not.toEqual(expected);

      wrapper
        .find(Popup)
        .at(0)
        .simulate('click');

      wrapper.find('input[name="Closest Atom"]').simulate('change');

      expect(onMeasuredProximityChangeSpy).toHaveBeenLastCalledWith(0);
    });

    it('Should handle changing the structure representation type to the non-default.', () => {
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
      const instance = wrapper.instance() as NGLComponent;
      const defaultFileRepresentationSpy = jest.fn();
      if (instance.state.stage) {
        instance.state.stage.defaultFileRepresentation = defaultFileRepresentationSpy;
      } else {
        expect(instance.state.stage).not.toBeNull();
      }

      wrapper
        .find(Popup)
        .at(0)
        .simulate('click');
      wrapper
        .find('input[name="Tube"]')
        .at(0)
        .simulate('change');
      wrapper
        .find('input[name="Rainbow"]')
        .at(0)
        .simulate('change');
      expect(defaultFileRepresentationSpy).toHaveBeenCalledTimes(1);
    });

    it('Should handle changing the structure representation type to a non-default.', () => {
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
      const instance = wrapper.instance() as NGLComponent;
      const expected = 'spacefill';
      expect(instance.state.activeRepresentations.experimental.structType).toEqual('default');
      expect(instance.state.activeRepresentations.predicted.structType).toEqual('cartoon');
      wrapper
        .find(Popup)
        .at(0)
        .simulate('click');
      wrapper
        .find('input[name="Spacefill"]')
        .at(0)
        .simulate('change');
      wrapper
        .find('input[name="Spacefill"]')
        .at(1)
        .simulate('change');
      expect(instance.state.activeRepresentations.experimental.structType).toEqual(expected);
      expect(instance.state.activeRepresentations.predicted.structType).toEqual(expected);
    });

    it('Should handle turning the distance representation off.', () => {
      const wrapper = mount(<NGLComponent />);
      const instance = wrapper.instance() as NGLComponent;
      expect(instance.state.isDistRepEnabled).not.toEqual(false);

      wrapper
        .find(Popup)
        .at(0)
        .simulate('click');

      wrapper
        .find(Checkbox)
        .at(0)
        .simulate('change');

      expect(instance.state.isDistRepEnabled).not.toEqual(true);
    });

    it('Should handle turning movePick off.', () => {
      const wrapper = mount(<NGLComponent />);
      const instance = wrapper.instance() as NGLComponent;
      expect(instance.state.isMovePickEnabled).toEqual(false);

      wrapper
        .find(Popup)
        .at(0)
        .simulate('click');

      wrapper
        .find(Checkbox)
        .at(1)
        .simulate('change');

      expect(instance.state.isMovePickEnabled).toEqual(true);

      wrapper
        .find(Checkbox)
        .at(1)
        .simulate('change');

      expect(instance.state.isMovePickEnabled).toEqual(false);
    });

    it('Should handle switching cameras.', () => {
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
      const instance = wrapper.instance() as NGLComponent;
      const { stage } = instance.state;
      if (stage) {
        expect(stage.parameters.cameraType).toEqual('perspective');
        wrapper
          .find('a')
          .at(1)
          .simulate('click');
        expect(stage.parameters.cameraType).toEqual('stereo');
        wrapper
          .find('a')
          .at(1)
          .simulate('click');
        expect(stage.parameters.cameraType).toEqual('perspective');
      } else {
        expect(stage).not.toBeUndefined();
      }
    });

    it('Should not allow switching superposition when not enough proteins.', () => {
      const wrapper = mount(<NGLComponent experimentalProteins={sampleData} />);
      const instance = wrapper.instance() as NGLComponent;
      expect(instance.state.superpositionStatus).toEqual('NONE');
      const links = wrapper.find('a');
      expect(links.length).toBeGreaterThanOrEqual(1);
      links.forEach(link => {
        expect(link.text()).not.toContain('Superimpose');
      });
    });

    it('Should handle switching superposition.', () => {
      const wrapper = mount(<NGLComponent experimentalProteins={sampleData} predictedProteins={sampleData} />);
      const instance = wrapper.instance() as NGLComponent;
      expect(instance.state.superpositionStatus).toEqual('NONE');
      wrapper
        .find('a')
        .at(1)
        .simulate('click');
      expect(instance.state.superpositionStatus).toEqual('BOTH');
    });

    it('Should handle centering the camera.', () => {
      const wrapper = mount(<NGLComponent predictedProteins={sampleData} />);
      const instance = wrapper.instance() as NGLComponent;
      const { stage } = instance.state;
      if (stage) {
        const autoViewSpy = jest.fn();
        stage.autoView = autoViewSpy;
        wrapper
          .find('a')
          .at(0)
          .simulate('click');
        expect(autoViewSpy).toHaveBeenCalled();
      } else {
        expect(stage).not.toBeUndefined();
      }
    });
  });
});
