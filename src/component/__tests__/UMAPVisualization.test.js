"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
var React = require("react");
var semantic_ui_react_1 = require("semantic-ui-react");
var component_1 = require("~bioblocks-viz~/component");
describe('UMAPVisualization', function () {
    var dataMatrix = [[]];
    beforeEach(function () {
        jest.clearAllTimers();
        jest.useFakeTimers();
        dataMatrix = new Array(30);
        for (var i = 0; i < 30; ++i) {
            dataMatrix[i] = new Array(30);
            for (var j = 0; j < 30; ++j) {
                dataMatrix[i][j] = i * 30 + j;
            }
        }
    });
    describe('UMAPVisualization', function () {
        it('Should render when given an empty data matrix.', function () {
            var wrapper = enzyme_1.shallow(React.createElement(component_1.UMAPVisualization, { dataMatrix: [[]] }));
            expect(wrapper).toMatchSnapshot();
        });
        it('Should render when given some sample data.', function () {
            var wrapper = enzyme_1.shallow(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix }));
            jest.runAllTimers();
            expect(wrapper.state('umapEmbedding')).toHaveLength(30);
        });
        it('Should be able to render in 3d.', function () {
            var wrapper = enzyme_1.shallow(React.createElement(component_1.UMAPVisualization, { nComponents: 3, dataMatrix: dataMatrix }));
            jest.runAllTimers();
            var instance = wrapper.instance();
            expect(instance.state.plotlyData[0].type).toBe('scatter3d');
        });
        it('Should label unannotated data as such.', function () {
            var wrapper = enzyme_1.shallow(React.createElement(component_1.UMAPVisualization, { nComponents: 3, dataMatrix: dataMatrix }));
            jest.runAllTimers();
            var instance = wrapper.instance();
            expect(instance.state.plotlyData[0].name).toEqual('Unannotated (31)');
        });
        it('Should truncate long data names.', function () {
            var longName = 'supercalifragilisticexpialidocious';
            var wrapper = enzyme_1.shallow(React.createElement(component_1.UMAPVisualization, { nComponents: 3, tooltipNames: [longName], dataLabels: [{ name: longName, color: 'red' }], dataMatrix: dataMatrix }));
            jest.runAllTimers();
            var instance = wrapper.instance();
            var expected = 'supercalifragilist... (1)';
            expect(instance.state.plotlyData[1].name).toEqual(expected);
        });
        it('Should not show 3d camera buttons in 2d mode.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: [[]], nComponents: 2 }));
            jest.runAllTimers();
            wrapper.update();
            expect(wrapper.find('a.item').length).toBe(1);
        });
        it('Should show 3d camera buttons in 3d mode.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix, nComponents: 3 }));
            jest.runAllTimers();
            wrapper.update();
            expect(wrapper.find('a.item').length).toBe(5);
            expect(wrapper
                .find('a.item')
                .at(1)
                .text()).toBe('Zoom');
            expect(wrapper
                .find('a.item')
                .at(2)
                .text()).toBe('Pan');
            expect(wrapper
                .find('a.item')
                .at(3)
                .text()).toBe('Orbit');
            expect(wrapper
                .find('a.item')
                .at(4)
                .text()).toBe('Turntable');
        });
    });
    describe('Settings callbacks', function () {
        it('Should handle zoom', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix, nComponents: 3 }));
            jest.runAllTimers();
            wrapper.update();
            var instance = wrapper.instance();
            var expected = 'zoom';
            expect(instance.state.dragMode).not.toBe(expected);
            wrapper
                .find('a.item')
                .at(1)
                .simulate('click');
            expect(instance.state.dragMode).toBe(expected);
        });
        it('Should handle pan', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix, nComponents: 3 }));
            jest.runAllTimers();
            wrapper.update();
            var instance = wrapper.instance();
            var expected = 'pan';
            expect(instance.state.dragMode).not.toBe(expected);
            wrapper
                .find('a.item')
                .at(2)
                .simulate('click');
            expect(instance.state.dragMode).toBe(expected);
        });
        it('Should handle orbit', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix, nComponents: 3 }));
            jest.runAllTimers();
            wrapper.update();
            var instance = wrapper.instance();
            var expected = 'orbit';
            expect(instance.state.dragMode).not.toBe(expected);
            wrapper
                .find('a.item')
                .at(3)
                .simulate('click');
            expect(instance.state.dragMode).toBe(expected);
        });
        it('Should handle turntable', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix, nComponents: 3 }));
            jest.runAllTimers();
            wrapper.update();
            var instance = wrapper.instance();
            var expected = 'turntable';
            expect(instance.state.dragMode).toBe(expected);
            wrapper
                .find('a.item')
                .at(3)
                .simulate('click');
            expect(instance.state.dragMode).not.toBe(expected);
            wrapper
                .find('a.item')
                .at(4)
                .simulate('click');
            expect(instance.state.dragMode).toBe(expected);
        });
        it('Should handle changing minimum distance', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix, nComponents: 3 }));
            jest.runAllTimers();
            wrapper.update();
            var instance = wrapper.instance();
            var expected = 0;
            expect(instance.state.numMinDist).not.toBe(expected);
            wrapper
                .find(semantic_ui_react_1.Icon)
                .at(0)
                .simulate('click');
            wrapper
                .find('.rc-slider-mark-text')
                .at(0)
                .simulate('mousedown');
            expect(instance.state.numMinDist).toBe(expected);
        });
        it('Should handle changing number of neighbors.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix, nComponents: 3 }));
            jest.runAllTimers();
            wrapper.update();
            var instance = wrapper.instance();
            var expected = 0;
            expect(instance.state.numNeighbors).not.toBe(expected);
            wrapper
                .find(semantic_ui_react_1.Icon)
                .at(0)
                .simulate('click');
            wrapper
                .find('.rc-slider-mark-text')
                .at(2)
                .simulate('mousedown');
            expect(instance.state.numNeighbors).toBe(expected);
        });
        it('Should handle changing spread value.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix, nComponents: 3 }));
            jest.runAllTimers();
            wrapper.update();
            var instance = wrapper.instance();
            var expected = 0;
            expect(instance.state.numSpread).not.toBe(expected);
            wrapper
                .find(semantic_ui_react_1.Icon)
                .at(0)
                .simulate('click');
            wrapper
                .find('.rc-slider-mark-text')
                .at(4)
                .simulate('mousedown');
            expect(instance.state.numSpread).toBe(expected);
        });
        it('Should handle changing dimension value.', function () {
            var wrapper = enzyme_1.mount(React.createElement(component_1.UMAPVisualization, { dataMatrix: dataMatrix, nComponents: 3 }));
            jest.runAllTimers();
            wrapper.update();
            var instance = wrapper.instance();
            var expected = 2;
            expect(instance.state.numDimensions).not.toBe(expected);
            wrapper
                .find(semantic_ui_react_1.Icon)
                .at(0)
                .simulate('click');
            wrapper
                .find(semantic_ui_react_1.Radio)
                .at(0)
                .simulate('change');
            expect(instance.state.numDimensions).toBe(expected);
            wrapper
                .find(semantic_ui_react_1.Radio)
                .at(1)
                .simulate('change');
            expect(instance.state.numDimensions).not.toBe(expected);
        });
    });
});
//# sourceMappingURL=UMAPVisualization.test.js.map