import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { Icon, Menu, Radio } from 'semantic-ui-react';

import { UMAPVisualization } from '~bioblocks-viz~/component';

describe('UMAPVisualization', () => {
  let dataMatrix: number[][] = [[]];

  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
    dataMatrix = new Array(30);
    for (let i = 0; i < 30; ++i) {
      dataMatrix[i] = new Array(30);
      for (let j = 0; j < 30; ++j) {
        dataMatrix[i][j] = i * 30 + j;
      }
    }
  });

  describe('UMAPVisualization', () => {
    it('Should render when given an empty data matrix.', () => {
      const wrapper = shallow(<UMAPVisualization dataMatrix={[[]]} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('Should render when given some sample data.', () => {
      const wrapper = shallow(<UMAPVisualization dataMatrix={dataMatrix} />);

      jest.runAllTimers();
      expect(wrapper.state('umapEmbedding')).toHaveLength(30);
    });

    it('Should be able to render in 3d.', () => {
      const wrapper = shallow(<UMAPVisualization nComponents={3} dataMatrix={dataMatrix} />);
      jest.runAllTimers();
      const instance = wrapper.instance() as UMAPVisualization;
      expect(instance.state.plotlyData[0].type).toBe('scatter3d');
    });

    it('Should label unannotated data as such.', () => {
      const wrapper = shallow(<UMAPVisualization nComponents={3} dataMatrix={dataMatrix} />);
      jest.runAllTimers();
      const instance = wrapper.instance() as UMAPVisualization;
      expect(instance.state.plotlyData[1].name).toEqual('Unannotated (31)');
    });

    it('Should truncate long data names.', () => {
      const longName = 'supercalifragilisticexpialidocious';
      const wrapper = shallow(
        <UMAPVisualization
          nComponents={3}
          tooltipNames={[longName]}
          dataLabels={[{ name: longName, color: 'red' }]}
          dataMatrix={dataMatrix}
        />,
      );
      jest.runAllTimers();
      const instance = wrapper.instance() as UMAPVisualization;
      const expected = 'supercalifragilist... (1)';
      expect(instance.state.plotlyData[0].name).toEqual(expected);
    });

    it('Should not show 3d camera buttons in 2d mode.', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={[[]]} nComponents={2} />);
      jest.runAllTimers();
      wrapper.update();
      expect(wrapper.find(Menu.Item).length).toBe(4);
    });

    it('Should show 3d camera buttons in 3d mode.', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={dataMatrix} nComponents={3} />);
      jest.runAllTimers();
      wrapper.update();
      expect(wrapper.find('a.item').length).toBe(5);
      expect(
        wrapper
          .find('a.item')
          .at(1)
          .text(),
      ).toBe('Zoom');
      expect(
        wrapper
          .find('a.item')
          .at(2)
          .text(),
      ).toBe('Pan');
      expect(
        wrapper
          .find('a.item')
          .at(3)
          .text(),
      ).toBe('Orbit');
      expect(
        wrapper
          .find('a.item')
          .at(4)
          .text(),
      ).toBe('Turntable');
    });
  });

  describe('Settings callbacks', () => {
    it('Should handle zoom', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={dataMatrix} nComponents={3} />);
      jest.runAllTimers();
      wrapper.update();
      const instance = wrapper.instance() as UMAPVisualization;
      const expected = 'zoom';
      expect(instance.state.dragMode).not.toBe(expected);
      wrapper
        .find('a.item')
        .at(1)
        .simulate('click');
      expect(instance.state.dragMode).toBe(expected);
    });

    it('Should handle pan', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={dataMatrix} nComponents={3} />);
      jest.runAllTimers();
      wrapper.update();
      const instance = wrapper.instance() as UMAPVisualization;
      const expected = 'pan';
      expect(instance.state.dragMode).not.toBe(expected);
      wrapper
        .find('a.item')
        .at(2)
        .simulate('click');
      expect(instance.state.dragMode).toBe(expected);
    });

    it('Should handle orbit', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={dataMatrix} nComponents={3} />);
      jest.runAllTimers();
      wrapper.update();
      const instance = wrapper.instance() as UMAPVisualization;
      const expected = 'orbit';
      expect(instance.state.dragMode).not.toBe(expected);
      wrapper
        .find('a.item')
        .at(3)
        .simulate('click');
      expect(instance.state.dragMode).toBe(expected);
    });

    it('Should handle turntable', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={dataMatrix} nComponents={3} />);
      jest.runAllTimers();
      wrapper.update();
      const instance = wrapper.instance() as UMAPVisualization;
      const expected = 'turntable';
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

    it('Should handle changing minimum distance', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={dataMatrix} nComponents={3} />);
      jest.runAllTimers();
      wrapper.update();
      const instance = wrapper.instance() as UMAPVisualization;
      const expected = 0;
      expect(instance.state.numMinDist).not.toBe(expected);

      wrapper
        .find(Icon)
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-slider-mark-text')
        .at(0)
        .simulate('mousedown');

      expect(instance.state.numMinDist).toBe(expected);
    });

    it('Should handle changing number of neighbors.', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={dataMatrix} nComponents={3} />);
      jest.runAllTimers();
      wrapper.update();
      const instance = wrapper.instance() as UMAPVisualization;
      const expected = 0;
      expect(instance.state.numNeighbors).not.toBe(expected);

      wrapper
        .find(Icon)
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-slider-mark-text')
        .at(2)
        .simulate('mousedown');

      expect(instance.state.numNeighbors).toBe(expected);
    });

    it('Should handle changing spread value.', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={dataMatrix} nComponents={3} />);
      jest.runAllTimers();
      wrapper.update();
      const instance = wrapper.instance() as UMAPVisualization;
      const expected = 0;
      expect(instance.state.numSpread).not.toBe(expected);

      wrapper
        .find(Icon)
        .at(0)
        .simulate('click');
      wrapper
        .find('.rc-slider-mark-text')
        .at(4)
        .simulate('mousedown');

      expect(instance.state.numSpread).toBe(expected);
    });

    it('Should handle changing dimension value.', () => {
      const wrapper = mount(<UMAPVisualization dataMatrix={dataMatrix} nComponents={3} />);
      jest.runAllTimers();
      wrapper.update();
      const instance = wrapper.instance() as UMAPVisualization;
      const expected = 2;
      expect(instance.state.numDimensions).not.toBe(expected);

      wrapper
        .find(Icon)
        .at(0)
        .simulate('click');
      wrapper
        .find(Radio)
        .at(0)
        .simulate('change');

      expect(instance.state.numDimensions).toBe(expected);

      wrapper
        .find(Radio)
        .at(1)
        .simulate('change');

      expect(instance.state.numDimensions).not.toBe(expected);
    });
  });
});
