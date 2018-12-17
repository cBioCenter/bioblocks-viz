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
  });

  it('Should have empty initial functions that produce 0 side effects.', () => {
    const wrapper = Renderer.create(
      <SpringContext.Consumer>{context => React.createElement('div', context)}</SpringContext.Consumer>,
    );
    expect(wrapper.root.props).toEqual(initialSpringContext);
  });

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

  it('Should allow categories to be toggled on and off.', () => {
    const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      selectedCategory: 'aqua',
    };
    instance.state.changeCategory('aqua');
    expect(instance.state).toEqual(expectedState);
    instance.state.changeCategory('aqua');
    expect(instance.state.categories).toEqual(Set());
  });
});
