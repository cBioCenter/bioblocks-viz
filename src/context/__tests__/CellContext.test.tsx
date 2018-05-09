import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import CellContext from '../CellContext';

describe('CellContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = Renderer.create(
      <CellContext.Consumer>
        {({ addCells, currentCells, removeAllCells, removeCells }) => <div />}
      </CellContext.Consumer>,
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
