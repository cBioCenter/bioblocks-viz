import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { Radio } from 'semantic-ui-react';
import { TensorTContainer, TensorTContainerClass } from '~chell-viz~/container';
import { dispatchPlotlySelectionEvent, genTensorTsneData } from '~chell-viz~/test';

describe('TensorTContainer', () => {
  it('Should match existing snapshot when given no props.', () => {
    const wrapper = shallow(<TensorTContainer />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data.', () => {
    const wrapper = shallow(<TensorTContainer />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should handle selection events.', done => {
    const sampleData = genTensorTsneData();
    const setCellsSpy = jest.fn();
    const wrapper = mount(<TensorTContainerClass setCurrentCells={setCellsSpy} />);
    setInterval(async () => {
      await dispatchPlotlySelectionEvent(wrapper, { points: [{ x: sampleData[1][0], y: sampleData[1][1] }] });
      expect(setCellsSpy).toHaveBeenCalled();
      done();
    }, 4000);
  });

  it('Should handle starting playback.', () => {
    const wrapper = shallow(<TensorTContainerClass setCurrentCells={jest.fn()} />);
    const instance = wrapper.instance() as TensorTContainerClass;
    expect(instance.state.isAnimating).toBe(false);
    wrapper
      .find(Radio)
      .at(0)
      .simulate('click');
    expect(instance.state.isAnimating).toBe(true);
  });

  it('Should handle pausing playback.', done => {
    const wrapper = shallow(<TensorTContainerClass setCurrentCells={jest.fn()} />);
    const instance = wrapper.instance() as TensorTContainerClass;
    expect(instance.state.isAnimating).toBe(false);
    wrapper
      .find(Radio)
      .at(0)
      .simulate('click');
    setInterval(() => {
      wrapper
        .find(Radio)
        .at(0)
        .simulate('click');
      expect(instance.state.isAnimating).toBe(false);
      done();
    }, 4000);
  });
});
