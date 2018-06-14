import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import CellContext, { initialCellContext } from '../CellContext';

describe('CellContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = Renderer.create(
      <CellContext.Consumer>{context => React.createElement('div', context)}</CellContext.Consumer>,
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
    expect(wrapper.root.props).toEqual(initialCellContext);
  });

  it('Should have empty initial functions that produce 0 side effects.', () => {
    const wrapper = Renderer.create(
      <CellContext.Consumer>{context => React.createElement('div', context)}</CellContext.Consumer>,
    );
    wrapper.root.props.addCells();
    wrapper.root.props.removeAllCells();
    wrapper.root.props.removeCells();
    expect(wrapper.root.props).toEqual(initialCellContext);
  });
});
