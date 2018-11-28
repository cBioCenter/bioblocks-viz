import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { Radio } from 'semantic-ui-react';
import { TensorTContainer, TensorTContainerClass } from '~chell-viz~/container';
import { initialCellContext } from '~chell-viz~/context';
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

  it('Should handle selection events.', async () => {
    const sampleData = genTensorTsneData();
    const addCellsSpy = jest.fn();
    const wrapper = mount(<TensorTContainerClass cellContext={{ ...initialCellContext, addCells: addCellsSpy }} />);
    wrapper.update();
    const instance = wrapper.instance() as TensorTContainerClass;
    await instance.componentDidMount();
    await instance.componentDidMount();
    await dispatchPlotlySelectionEvent(wrapper, { points: [{ x: sampleData[1][0], y: sampleData[1][1] }] });
    expect(addCellsSpy).toHaveBeenCalled();
  });

  it('Should handle starting playback.', () => {
    const wrapper = shallow(<TensorTContainerClass />);
    const instance = wrapper.instance() as TensorTContainerClass;
    expect(instance.state.isAnimating).toBe(false);
    wrapper
      .find(Radio)
      .at(0)
      .simulate('click');
    expect(instance.state.isAnimating).toBe(true);
  });

  it('Should handle pausing playback.', done => {
    const wrapper = shallow(<TensorTContainerClass />);
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
