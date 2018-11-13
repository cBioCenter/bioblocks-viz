import { shallow } from 'enzyme';
import * as React from 'react';
import * as Renderer from 'react-test-renderer';

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
      selectedCategories: ['muse'],
    };
    instance.state.addCategory('muse');
    instance.state.addCategory('muse');
    expect(instance.state).toEqual(expectedState);
    expect(instance.state.selectedCategories).toHaveLength(1);
  });

  it('Should allow categories to be removed.', () => {
    const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      selectedCategories: ['skull', 'ocarina'],
    };
    instance.state.addCategory('skull');
    instance.state.addCategory('link');
    instance.state.addCategory('ocarina');
    expect(instance.state).not.toEqual(expectedState);

    instance.state.removeCategory('link');
    expect(instance.state).toEqual(expectedState);
  });

  it('Should allow categories to be toggled on and off.', () => {
    const instance = shallow(<SpringContextProvider />).instance() as SpringContextProvider;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      selectedCategories: ['aqua'],
    };
    instance.state.toggleCategory('aqua');
    expect(instance.state).toEqual(expectedState);
    instance.state.toggleCategory('aqua');
    expect(instance.state.selectedCategories).toEqual([]);
  });
});
