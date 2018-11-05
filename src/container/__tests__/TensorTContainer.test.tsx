import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { Button } from 'semantic-ui-react';
import { TensorTContainer, TensorTContainerClass } from '~chell-viz~/container';
import { initialCellContext } from '~chell-viz~/context';
import { dispatchPlotlySelectionEvent, genTensorTsneData } from '~chell-viz~/test';

describe('TensorTContainer', () => {
  it('Should match existing snapshot when given no props.', () => {
    const wrapper = mount(<TensorTContainer />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should match existing snapshot when given sample data.', () => {
    const wrapper = mount(<TensorTContainer data={genTensorTsneData()} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should update when the cell context has been updated.', async () => {
    const sampleData = genTensorTsneData();
    const wrapper = shallow(<TensorTContainerClass data={sampleData} />);
    wrapper.update();
    const instance = wrapper.instance() as TensorTContainerClass;
    await instance.componentDidMount();
    const expected = [1];
    expect(instance.state.plotlyCoords).not.toEqual(expected);
    wrapper.setProps({
      cellContext: {
        currentCells: [1],
      },
    });
    await instance.componentDidMount();
    const highlightedCells = instance.state.plotlyCoords[1];
    expect(highlightedCells.x).toEqual([sampleData[1][0]]);
    expect(highlightedCells.y).toEqual([sampleData[1][1]]);
  });

  it('Should handle selection events.', async () => {
    const sampleData = genTensorTsneData();
    const addCellsSpy = jest.fn();
    const wrapper = mount(
      <TensorTContainerClass data={sampleData} cellContext={{ ...initialCellContext, addCells: addCellsSpy }} />,
    );
    wrapper.update();
    const instance = wrapper.instance() as TensorTContainerClass;
    await instance.componentDidMount();
    const expected = [1];
    expect(instance.state.plotlyCoords).not.toEqual(expected);
    await instance.componentDidMount();
    await dispatchPlotlySelectionEvent(wrapper, { points: [{ x: sampleData[1][0], y: sampleData[1][1] }] });
    expect(addCellsSpy).toHaveBeenCalledWith(expected);
  });

  it('Should handle starting playback.', () => {
    const wrapper = shallow(<TensorTContainerClass data={genTensorTsneData()} />);
    const instance = wrapper.instance() as TensorTContainerClass;
    expect(instance.state.isAnimating).toBe(false);
    wrapper
      .find(Button)
      .at(0)
      .simulate('click');
    expect(instance.state.isAnimating).toBe(true);
  });

  it('Should handle pausing playback.', done => {
    const wrapper = shallow(<TensorTContainerClass data={genTensorTsneData()} />);
    const instance = wrapper.instance() as TensorTContainerClass;
    expect(instance.state.isAnimating).toBe(false);
    wrapper
      .find(Button)
      .at(0)
      .simulate('click');
    setInterval(() => {
      wrapper
        .find(Button)
        .at(0)
        .simulate('click');
      expect(instance.state.isAnimating).toBe(false);
      done();
    }, 4000);
  });
});
