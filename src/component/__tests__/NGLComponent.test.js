"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enzyme_1 = require("enzyme");
var NGL = require("ngl");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
var data_1 = require("~bioblocks-viz~/data");
describe('NGLComponent', function () {
    var sampleData;
    beforeEach(function () {
        var nglStructure = new NGL.Structure('sample');
        nglStructure.residueStore.resno = new Uint32Array([0, 1, 2, 3, 4]);
        sampleData = [data_1.BioblocksPDB.createPDBFromNGLData(nglStructure)];
    });
    it('Should match existing snapshot when unconnected to a context.', function () {
        expect(enzyme_1.shallow(React.createElement(component_1.NGLComponent, null))).toMatchSnapshot();
    });
    it('Should handle a data reset.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, null));
        var initialProps = wrapper.props();
        wrapper.setProps({
            data: sampleData,
        });
        expect(wrapper.props()).not.toEqual(initialProps);
    });
    it('Should handle prop updates.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, null));
        var initialProps = wrapper.props();
        wrapper.setProps({
            hoveredResidues: [0],
        });
        expect(wrapper.props()).not.toEqual(initialProps);
    });
    it('Should handle candidate residue updates.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
        wrapper.setProps({
            candidateResidues: [1, 2, 3],
        });
    });
    it('Should handle hovered residue updates.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
        wrapper.setProps({
            hoveredResidues: [1, 2, 3],
        });
    });
    it('Should show the ball+stick representation for hovered residues.', function () {
        var expectedRep = 'ball+stick';
        var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
        var instance = wrapper.instance();
        wrapper.setProps({
            hoveredResidues: [1],
        });
        wrapper.update();
        expect(instance.state.activeRepresentations.predicted.reps[0].name()).toEqual(expectedRep);
    });
    it('Should show the distance and ball+stick representation for locked residues for C-Alpha proximity.', function () {
        var expectedRep = ['ball+stick', 'distance', 'ball+stick', 'distance'];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
        var instance = wrapper.instance();
        wrapper.setProps({
            lockedResiduePairs: new Map(Object.entries({
                '1,2': [1, 2],
                '3,4': [3, 4],
            })),
        });
        var activeRepresentations = instance.state.activeRepresentations;
        for (var i = 0; i < activeRepresentations.experimental.reps.length; i++) {
            expect(activeRepresentations.experimental.reps[i].name()).toEqual(expectedRep[i]);
        }
    });
    it('Should show the distance and ball+stick representation for locked residues for Closest distance proximity.', function () {
        var expectedRep = ['ball+stick', 'distance', 'ball+stick', 'distance'];
        var wrapper = enzyme_1.shallow(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData, measuredProximity: data_1.CONTACT_DISTANCE_PROXIMITY.CLOSEST }));
        var instance = wrapper.instance();
        wrapper.setProps({
            lockedResiduePairs: new Map(Object.entries({
                '1,2': [1, 2],
                '3,4': [3, 4],
            })),
        });
        var activeRepresentations = instance.state.activeRepresentations;
        for (var i = 0; i < activeRepresentations.experimental.reps.length; i++) {
            expect(activeRepresentations.experimental.reps[i].name()).toEqual(expectedRep[i]);
        }
    });
    it('Should show the distance and ball+stick representation for multiple hovered residues.', function () {
        var expectedRep = ['ball+stick', 'distance'];
        var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
        var instance = wrapper.instance();
        wrapper.setProps({
            hoveredResidues: [7, 8],
        });
        wrapper.update();
        var activeRepresentations = instance.state.activeRepresentations;
        expect(activeRepresentations.predicted.reps.length).toEqual(expectedRep.length);
        for (var i = 0; i < activeRepresentations.predicted.reps.length; i++) {
            expect(activeRepresentations.predicted.reps[i].name()).toEqual(expectedRep[i]);
        }
    });
    it('Should show the cartoon representation for selected secondary structures.', function () {
        var expectedRep = ['cartoon'];
        var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
        var instance = wrapper.instance();
        wrapper.setProps({
            selectedSecondaryStructures: [{ start: 1, end: 2 }],
        });
        var activeRepresentations = instance.state.activeRepresentations;
        expect(activeRepresentations.predicted.reps.length).toEqual(expectedRep.length);
        for (var i = 0; i < activeRepresentations.predicted.reps.length; i++) {
            expect(activeRepresentations.predicted.reps[i].name()).toEqual(expectedRep[i]);
        }
    });
    it('Should follow candidate selection flow.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
        wrapper.setProps({
            lockedResiduePairs: new Map(Object.entries({
                '1,2': [1, 2],
            })),
        });
        wrapper.update();
        wrapper.setProps({
            lockedResiduePairs: new Map(Object.entries({
                '1,2': [1, 2],
                '3,4': [3, 4],
            })),
        });
        wrapper.update();
    });
    it.skip('Should follow candidate residue selection flow.', function () {
        var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
        var activeReps = wrapper.instance().state.activeRepresentations;
        wrapper.setProps({
            candidateResidues: [1],
            hoveredResidues: [1],
        });
        wrapper.setProps({
            candidateResidues: [2],
        });
        expect(wrapper.instance().state.activeRepresentations.predicted).not.toEqual(activeReps.predicted);
    });
    it.skip('Should call appropriate residue clearing callback.', function () {
        var removeSpy = jest.fn();
        var wrapper = enzyme_1.shallow(React.createElement(component_1.NGLComponent, { removeAllLockedResiduePairs: removeSpy }));
        wrapper
            .find('#clear-selections-0')
            .at(0)
            .simulate('click');
        expect(removeSpy).toHaveBeenCalledTimes(1);
    });
    it('Should unmount correctly.', function () {
        var wrapper = enzyme_1.shallow(React.createElement(component_1.NGLComponent, null));
        expect(wrapper.get(0)).not.toBeNull();
        wrapper.unmount();
        expect(wrapper.get(0)).toBeNull();
    });
    describe('Events', function () {
        var simulateHoverEvent = function (wrapper, opts) {
            var instance = wrapper.instance();
            var stage = instance.state.stage;
            if (stage) {
                stage.mouseControls.run('hoverPick', instance.state.stage, opts);
            }
            else {
                expect(stage).not.toBeUndefined();
            }
        };
        var simulateClickEvent = function (wrapper, opts) {
            var instance = wrapper.instance();
            var stage = instance.state.stage;
            if (stage) {
                stage.signals.clicked.dispatch(opts);
            }
            else {
                expect(stage).not.toBeUndefined();
            }
        };
        it('Should handle hover events when there is no hovered or candidate residue.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, removeHoveredResiduesSpy;
            return tslib_1.__generator(this, function (_a) {
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                removeHoveredResiduesSpy = jest.fn();
                wrapper.setProps({
                    candidateResidues: [],
                    removeHoveredResidues: removeHoveredResiduesSpy,
                });
                simulateHoverEvent(wrapper, { atom: { resno: 3, resname: 'ARG' } });
                simulateHoverEvent(wrapper, { closestBondAtom: { resno: 3, resname: 'GLY' } });
                simulateHoverEvent(wrapper, {});
                expect(removeHoveredResiduesSpy).toHaveBeenCalledTimes(0);
                return [2 /*return*/];
            });
        }); });
        it('Should handle hover events when the residue name is not one of the 20 common Amino Acids.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, removeHoveredResiduesSpy;
            return tslib_1.__generator(this, function (_a) {
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                removeHoveredResiduesSpy = jest.fn();
                wrapper.setProps({
                    candidateResidues: [],
                    removeHoveredResidues: removeHoveredResiduesSpy,
                });
                simulateHoverEvent(wrapper, { atom: { resno: 3, resname: 'FOO' } });
                simulateHoverEvent(wrapper, { closestBondAtom: { resno: 3, resname: 'BAR' } });
                simulateHoverEvent(wrapper, {});
                expect(removeHoveredResiduesSpy).toHaveBeenCalledTimes(0);
                return [2 /*return*/];
            });
        }); });
        it('Should handle hover events when there is a hovered residue but no candidate.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, removeHoveredResiduesSpy;
            return tslib_1.__generator(this, function (_a) {
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                removeHoveredResiduesSpy = jest.fn();
                wrapper.setProps({
                    candidateResidues: [],
                    hoveredResidues: [3],
                    removeHoveredResidues: removeHoveredResiduesSpy,
                });
                simulateHoverEvent(wrapper, { atom: { resno: 3, resname: 'ALA' } });
                simulateHoverEvent(wrapper, {});
                expect(removeHoveredResiduesSpy).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
        it('Should clear candidate and hovered residues when the mouse leaves the canvas.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, removeNonLockedResiduesSpy;
            return tslib_1.__generator(this, function (_a) {
                wrapper = enzyme_1.shallow(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                removeNonLockedResiduesSpy = jest.fn();
                wrapper.setProps({
                    candidateResidues: [3],
                    hoveredResidues: [4],
                    removeNonLockedResidues: removeNonLockedResiduesSpy,
                });
                wrapper.find('.NGLCanvas').simulate('mouseleave');
                expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
        // tslint:disable-next-line:mocha-no-side-effect-code
        it.each([{ atom: { resno: 4, resname: 'ARG' } }, { closestBondAtom: { resno: 4, resname: 'ARG' } }])('Should handle click events by creating a locked residue pair if there is a candidate.', function (pickingResult) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var addLockedSpy, wrapper;
            return tslib_1.__generator(this, function (_a) {
                addLockedSpy = jest.fn();
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                wrapper.setProps({
                    addLockedResiduePair: addLockedSpy,
                    candidateResidues: [2],
                });
                simulateClickEvent(wrapper, pickingResult);
                expect(addLockedSpy).toHaveBeenCalledWith({ '2,4': [2, 4] });
                return [2 /*return*/];
            });
        }); });
        // tslint:disable-next-line:mocha-no-side-effect-code
        it.each([{ atom: { resno: 4 } }, { closestBondAtom: { resno: 4 } }])('Should handle click events by creating a candidate residue when none is present.', function (pickingResult) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var addCandidateSpy, wrapper;
            return tslib_1.__generator(this, function (_a) {
                addCandidateSpy = jest.fn();
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                wrapper.setProps({
                    addCandidateResidues: addCandidateSpy,
                });
                simulateClickEvent(wrapper, pickingResult);
                expect(addCandidateSpy).toHaveBeenCalledWith([4]);
                return [2 /*return*/];
            });
        }); });
        it('Should handle clicking on a distance representation.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var wrapper, removedLockedSpy, stage, structureComponent;
            return tslib_1.__generator(this, function (_a) {
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                removedLockedSpy = jest.fn();
                stage = wrapper.state('stage');
                structureComponent = stage.compList[0];
                structureComponent.addRepresentation('distance');
                wrapper.setProps({
                    lockedResiduePairs: new Map(Object.entries({
                        '4,7': [4, 7],
                    })),
                    removeLockedResiduePair: removedLockedSpy,
                });
                simulateClickEvent(wrapper, {
                    distance: { atom1: { resno: 4 }, atom2: { resno: 7 } },
                    picker: { type: 'distance' },
                });
                expect(removedLockedSpy).toHaveBeenLastCalledWith('4,7');
                return [2 /*return*/];
            });
        }); });
        it('Should handle clicking off-component.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected, wrapper, removeNonLockedResiduesSpy;
            return tslib_1.__generator(this, function (_a) {
                expected = new Array();
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                removeNonLockedResiduesSpy = jest.fn();
                wrapper.setProps({
                    hoveredResidues: [1],
                    removeNonLockedResidues: removeNonLockedResiduesSpy,
                });
                expect(wrapper.state('activeRepresentations')).not.toEqual(expected);
                simulateClickEvent(wrapper, undefined);
                expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
        it('Should add the hovered residue if the user clicks within a certain distance (snapping).', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected, wrapper, addLockedResiduePairSpy;
            return tslib_1.__generator(this, function (_a) {
                expected = new Array();
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                addLockedResiduePairSpy = jest.fn();
                wrapper.setProps({
                    addLockedResiduePair: addLockedResiduePairSpy,
                    candidateResidues: [0],
                    hoveredResidues: [1],
                });
                expect(wrapper.state('activeRepresentations')).not.toEqual(expected);
                simulateClickEvent(wrapper, undefined);
                expect(addLockedResiduePairSpy).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
        it('Should remove the hovered residue if the user clicks within beyond a certain distance (snapping).', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var expected, wrapper, removeNonLockedResiduesSpy;
            return tslib_1.__generator(this, function (_a) {
                expected = new Array();
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
                removeNonLockedResiduesSpy = jest.fn();
                wrapper.setProps({
                    candidateResidues: [0],
                    hoveredResidues: [51],
                    removeNonLockedResidues: removeNonLockedResiduesSpy,
                });
                expect(wrapper.state('activeRepresentations')).not.toEqual(expected);
                simulateClickEvent(wrapper, undefined);
                expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
        it('Should handle pressing ESC.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var removeNonLockedResiduesSpy, wrapper;
            return tslib_1.__generator(this, function (_a) {
                removeNonLockedResiduesSpy = jest.fn();
                wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData, candidateResidues: [1], hoveredResidues: [2], removeNonLockedResidues: removeNonLockedResiduesSpy }));
                wrapper.find('.NGLCanvas').simulate('keyDown', { keyCode: 27 });
                expect(removeNonLockedResiduesSpy).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
            });
        }); });
        it('Should handle onResize events.', function () {
            var onResizeSpy = jest.fn();
            expect(function () { return enzyme_1.shallow(React.createElement(component_1.NGLComponent, { onResize: onResizeSpy })); }).not.toThrow();
            global.dispatchEvent(new Event('resize'));
            expect(onResizeSpy).toHaveBeenCalledTimes(1);
        });
        it('Should remove the onResize handler when unmounted.', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var onResizeSpy, wrapper;
            return tslib_1.__generator(this, function (_a) {
                onResizeSpy = jest.fn();
                wrapper = enzyme_1.shallow(React.createElement(component_1.NGLComponent, { onResize: onResizeSpy }));
                wrapper.unmount();
                global.dispatchEvent(new Event('resize'));
                expect(onResizeSpy).toHaveBeenCalledTimes(0);
                return [2 /*return*/];
            });
        }); });
        it('Should ignore focus events.', function () {
            var onFocusSpy = jest.fn();
            HTMLDivElement.prototype.focus = onFocusSpy;
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, null));
            var instance = wrapper.instance();
            if (instance.canvas && instance.state.stage) {
                instance.canvas.dispatchEvent(new Event('focus'));
                instance.state.stage.keyBehavior.domElement.focus();
                expect(onFocusSpy).not.toBeCalled();
            }
            else {
                expect(instance.canvas).not.toBeNull();
                expect(instance.state.stage).not.toBeNull();
            }
        });
    });
    describe('Configurations', function () {
        it('Should handle changing the measuring proximity.', function () {
            var onMeasuredProximityChangeSpy = jest.fn();
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { onMeasuredProximityChange: onMeasuredProximityChangeSpy }));
            var expected = data_1.CONTACT_DISTANCE_PROXIMITY.CLOSEST;
            expect(wrapper.instance().props.measuredProximity).not.toEqual(expected);
            wrapper
                .find(semantic_ui_react_1.Popup)
                .at(0)
                .simulate('click');
            wrapper.find('input[name="Closest Atom"]').simulate('change');
            expect(onMeasuredProximityChangeSpy).toHaveBeenLastCalledWith(0);
        });
        it('Should handle changing the structure representation type to the non-default.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
            var instance = wrapper.instance();
            var defaultFileRepresentationSpy = jest.fn();
            if (instance.state.stage) {
                instance.state.stage.defaultFileRepresentation = defaultFileRepresentationSpy;
            }
            else {
                expect(instance.state.stage).not.toBeNull();
            }
            wrapper
                .find(semantic_ui_react_1.Popup)
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
        it('Should handle changing the structure representation type to a non-default.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
            var instance = wrapper.instance();
            var expected = 'spacefill';
            expect(instance.state.activeRepresentations.experimental.structType).toEqual('default');
            expect(instance.state.activeRepresentations.predicted.structType).toEqual('cartoon');
            wrapper
                .find(semantic_ui_react_1.Popup)
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
        it('Should handle turning the distance representation off.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, null));
            var instance = wrapper.instance();
            expect(instance.state.isDistRepEnabled).not.toEqual(false);
            wrapper
                .find(semantic_ui_react_1.Popup)
                .at(0)
                .simulate('click');
            wrapper
                .find(semantic_ui_react_1.Checkbox)
                .at(1)
                .simulate('change');
            expect(instance.state.isDistRepEnabled).not.toEqual(true);
        });
        it('Should handle turning movePick off.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, null));
            var instance = wrapper.instance();
            expect(instance.state.isMovePickEnabled).toEqual(false);
            wrapper
                .find(semantic_ui_react_1.Popup)
                .at(0)
                .simulate('click');
            wrapper
                .find(semantic_ui_react_1.Checkbox)
                .at(0)
                .simulate('change');
            expect(instance.state.isMovePickEnabled).toEqual(true);
            wrapper
                .find(semantic_ui_react_1.Checkbox)
                .at(0)
                .simulate('change');
            expect(instance.state.isMovePickEnabled).toEqual(false);
        });
        it('Should handle switching cameras.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
            var instance = wrapper.instance();
            var stage = instance.state.stage;
            if (stage) {
                expect(stage.parameters.cameraType).toEqual('perspective');
                wrapper
                    .find('a')
                    .at(2)
                    .simulate('click');
                expect(stage.parameters.cameraType).toEqual('stereo');
                wrapper
                    .find('a')
                    .at(2)
                    .simulate('click');
                expect(stage.parameters.cameraType).toEqual('perspective');
            }
            else {
                expect(stage).not.toBeUndefined();
            }
        });
        it('Should not allow switching superposition when not enough proteins.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { experimentalProteins: sampleData }));
            var instance = wrapper.instance();
            expect(instance.state.superpositionStatus).toEqual('NONE');
            var links = wrapper.find('a');
            expect(links.length).toBeGreaterThanOrEqual(1);
            links.forEach(function (link) {
                expect(link.text()).not.toContain('Superimpose');
            });
        });
        it('Should handle switching superposition.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { experimentalProteins: sampleData, predictedProteins: sampleData }));
            var instance = wrapper.instance();
            expect(instance.state.superpositionStatus).toEqual('NONE');
            wrapper
                .find('a')
                .at(2)
                .simulate('click');
            expect(instance.state.superpositionStatus).toEqual('BOTH');
        });
        it('Should handle centering the camera.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.NGLComponent, { predictedProteins: sampleData }));
            var instance = wrapper.instance();
            var stage = instance.state.stage;
            if (stage) {
                var autoViewSpy = jest.fn();
                stage.autoView = autoViewSpy;
                wrapper
                    .find('a')
                    .at(1)
                    .simulate('click');
                expect(autoViewSpy).toHaveBeenCalled();
            }
            else {
                expect(stage).not.toBeUndefined();
            }
        });
    });
});
//# sourceMappingURL=NGLComponent.test.js.map