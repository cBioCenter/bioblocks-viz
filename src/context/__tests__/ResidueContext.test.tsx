import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import ResidueContext, { initialResidueContext } from '../ResidueContext';

describe('ResidueContext', () => {
  it('Should match the default snapshot.', () => {
    const wrapper = Renderer.create(
      <ResidueContext.Consumer>{context => React.createElement('div', context)}</ResidueContext.Consumer>,
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
    expect(wrapper.root.props).toEqual(initialResidueContext);
  });

  it('Should have empty initial functions that produce 0 side effects.', () => {
    const wrapper = Renderer.create(
      <ResidueContext.Consumer>{context => React.createElement('div', context)}</ResidueContext.Consumer>,
    );
    wrapper.root.props.addCandidateResidues();
    wrapper.root.props.addHoveredResidues();
    wrapper.root.props.addLockedResiduePair();
    wrapper.root.props.clearAllResidues();
    wrapper.root.props.removeAllLockedResiduePairs();
    wrapper.root.props.removeLockedResiduePair();
    wrapper.root.props.toggleLockedResiduePair();
    expect(wrapper.root.props).toEqual(initialResidueContext);
  });
});
