import { shallow } from 'enzyme';
import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import { CellContext, CellContextWrapper, initialCellContext } from '~chell-viz~/context';

describe('CellContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = Renderer.create(
      <CellContextWrapper.Consumer>{context => React.createElement('div', context)}</CellContextWrapper.Consumer>,
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
    expect(wrapper.root.props).toEqual(initialCellContext);
  });

  it('Should have empty initial functions that produce 0 side effects.', () => {
    const wrapper = Renderer.create(
      <CellContextWrapper.Consumer>{context => React.createElement('div', context)}</CellContextWrapper.Consumer>,
    );
    wrapper.root.props.addCells();
    wrapper.root.props.removeAllCells();
    wrapper.root.props.removeCells();
    expect(wrapper.root.props).toEqual(initialCellContext);
  });

  describe('Cell Context', () => {
    it('Should correctly add cells.', () => {
      const instance = shallow(<CellContext />).instance() as CellContext;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        currentCells: [1, 2, 3, 4],
      };
      instance.state.addCells([1, 2, 3, 4]);
      expect(instance.state).toEqual(expectedState);
    });

    it('Should remove old cells when new ones are added.', async () => {
      const instance = shallow(<CellContext />).instance() as CellContext;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        currentCells: [1, 4],
      };
      instance.state.addCells([1, 2, 3, 4]);
      instance.state.addCells([1, 4]);
      expect(instance.state).toEqual(expectedState);
    });

    it('Should allow specific cells to be removed', () => {
      const instance = shallow(<CellContext />).instance() as CellContext;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        currentCells: [2],
      };
      instance.state.addCells([1, 2, 3, 4]);
      instance.state.removeCells([1, 3, 4]);
      expect(instance.state).toEqual(expectedState);
    });

    it('Should allow all cells to be removed', () => {
      const instance = shallow(<CellContext />).instance() as CellContext;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        currentCells: [],
      };
      instance.state.addCells([1, 2, 3, 4]);
      instance.state.removeAllCells();
      expect(instance.state).toEqual(expectedState);
    });
  });
});
