import { shallow } from 'enzyme';
import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import { Set } from 'immutable';
import { initialSpringContext, SpringContext, SpringContextProvider } from '~chell-viz~/context';

describe('SpringContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = Renderer.create(
      <SpringContext.Consumer>{context => React.createElement('div', context)}</SpringContext.Consumer>,
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
    expect(wrapper.root.props).toEqual(initialSpringContext);

    for (const propKey of Object.keys(wrapper.root.props)) {
      const prop = wrapper.root.props[propKey];
      if (typeof prop === 'function') {
        expect((prop as () => any)()).toBe(undefined);
        expect(wrapper.root.props).toEqual(initialSpringContext);
      }
    }
  });

  it('Should have empty initial functions that produce 0 side effects.', () => {
    const wrapper = Renderer.create(
      <SpringContext.Consumer>{context => React.createElement('div', context)}</SpringContext.Consumer>,
    );
    expect(wrapper.root.props).toEqual(initialSpringContext);
  });

  it('Should allow the whole context to be updated.', () => {
    const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      currentCells: Set([1, 2, 3]),
      selectedCategory: 'A22B',
    };
    initialState.update([1, 2, 3], 'A22B');
    expect(instance.state).toEqual(expectedState);
  });

  describe('Categories', () => {
    it('Should allow categories to be added as unique entries.', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        selectedLabels: Set(['muse']),
      };
      instance.state.addLabel('muse');
      instance.state.addLabel('muse');
      expect(instance.state).toEqual(expectedState);
      expect(instance.state.selectedLabels.size).toBe(1);
    });

    it('Should allow multiple categories to be added as unique entries.', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        selectedLabels: Set(['LttP', 'OoT', 'MM']),
      };
      instance.state.addLabels(['LttP', 'OoT', 'MM']);
      expect(instance.state).toEqual(expectedState);
    });

    it('Should allow categories to be removed.', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        selectedCategory: 'link',
      };
      instance.state.changeCategory('skull');
      instance.state.changeCategory('link');
      instance.state.changeCategory('ocarina');
      expect(instance.state).not.toEqual(expectedState);

      instance.state.changeCategory('link');
      expect(instance.state).toEqual(expectedState);
    });
  });

  describe('Cells', () => {
    it('Should allow current cells for the context to be updated.', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        currentCells: Set([1, 2, 3]),
      };
      initialState.update([1, 2, 3]);
      expect(instance.state).toEqual(expectedState);
    });

    it('Should allow current cells to be explicitly set.', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        currentCells: Set([4, 5, 6]),
      };
      initialState.setCells([4, 5, 6]);
      expect(instance.state).toEqual(expectedState);
    });

    it('Should allow all cells to be removed', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        currentCells: Set(),
      };
      initialState.setCells([5, 6, 7, 8, 9]);
      expect(instance.state).not.toEqual(expectedState);
      initialState.removeAllCells();
      expect(instance.state).toEqual(expectedState);
    });

    it('Should allow certain cells to be removed', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        currentCells: Set([5, 8, 9]),
      };
      initialState.setCells([5, 6, 7, 8, 9]);
      expect(instance.state).not.toEqual(expectedState);
      initialState.removeCells([6, 7]);
      expect(instance.state).toEqual(expectedState);
    });
  });

  describe('Labels', () => {
    it('Should allow labels to be toggled.', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        selectedLabels: Set(['OoA', 'OoS', 'OoT', 'MM']),
      };
      instance.state.toggleLabels(['OoA', 'OoS', 'LttP']);
      instance.state.toggleLabels(['LttP', 'OoT', 'MM']);
      expect(instance.state).toEqual(expectedState);
    });

    it('Should allow a label to be removed.', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        selectedLabels: Set(['Arm', 'Nose']),
      };
      instance.state.toggleLabels(['Arm', 'Leg', 'Nose']);
      instance.state.removeLabel('Leg');
      expect(instance.state).toEqual(expectedState);
    });

    it('Should allow several labels to be removed.', () => {
      const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
      const initialState = instance.state;
      const expectedState = {
        ...initialState,
        selectedLabels: Set(['Nose']),
      };
      instance.state.toggleLabels(['Arm', 'Leg', 'Nose']);
      instance.state.removeLabels(['Arm', 'Leg']);
      expect(instance.state).toEqual(expectedState);
    });
  });
});
