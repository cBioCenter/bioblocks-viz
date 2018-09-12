import { shallow } from 'enzyme';
import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import { initialResidueContext, ResidueContext, ResidueContextHandler } from '../ResidueContext';

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
    wrapper.root.props.removeHoveredResidues();
    wrapper.root.props.removeLockedResiduePair();
    wrapper.root.props.removeNonLockedResidues();
    wrapper.root.props.toggleLockedResiduePair();
    expect(wrapper.root.props).toEqual(initialResidueContext);
  });

  it('Should add the candidate residue correctly.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      candidateResidues: [3],
    };
    instance.state.addCandidateResidues([3]);
    expect(instance.state).toEqual(expectedState);
  });

  it('Should remove the candidate residue correctly.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      candidateResidues: [],
    };
    instance.state.addCandidateResidues([3]);
    instance.state.removeCandidateResidues();
    expect(instance.state).toEqual(expectedState);
  });

  it('Should add a single hovered residue.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      hoveredResidues: [7],
    };
    instance.state.addHoveredResidues([7]);
    expect(instance.state).toEqual(expectedState);
  });

  it('Should add multiple residues as hovered residues.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      hoveredResidues: [7, 9],
    };
    instance.state.addHoveredResidues([9, 7]);
    expect(instance.state).toEqual(expectedState);
  });

  it('Should remove the hovered residue correctly.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      hoveredResidues: [],
    };
    instance.state.addHoveredResidues([7]);
    instance.state.removeHoveredResidues();
    expect(instance.state).toEqual(expectedState);
  });

  it('Should add a locked residue pair correctly.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      lockedResiduePairs: new Map(
        Object.entries({
          '1,2': [1, 2],
        }),
      ),
    };
    instance.state.addLockedResiduePair([1, 2]);
    expect(instance.state).toEqual(expectedState);
  });

  it('Should allow multiple locked residues to be added in various dimensions correctly.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      lockedResiduePairs: new Map(
        Object.entries({
          '1,2': [1, 2],
          '5': [5],
          '6,7,8,9': [6, 7, 8, 9],
        }),
      ),
    };
    instance.state.addLockedResiduePair([1, 2]);
    instance.state.addLockedResiduePair([5]);
    instance.state.addLockedResiduePair([6, 7, 8, 9]);
    expect(instance.state).toEqual(expectedState);
  });

  it('Should map identical residue pairs regardless of the order they are supplied.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      lockedResiduePairs: new Map(
        Object.entries({
          '1,2': [1, 2],
        }),
      ),
    };
    instance.state.addLockedResiduePair([1, 2]);
    instance.state.addLockedResiduePair([2, 1]);
    expect(instance.state).toEqual(expectedState);
  });

  it('Should allow locked residues to be removed while preserving the other pairs.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      lockedResiduePairs: new Map(
        Object.entries({
          '1,2': [1, 2],
          '6,7,8,9': [6, 7, 8, 9],
        }),
      ),
    };
    instance.state.addLockedResiduePair([5]);
    instance.state.addLockedResiduePair([1, 2]);
    instance.state.addLockedResiduePair([6, 7, 8, 9]);
    instance.state.removeLockedResiduePair([5]);
    expect(instance.state).toEqual(expectedState);
  });

  it('Should not alter current state if non-existing residue pair is requested to be removed.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      lockedResiduePairs: new Map(
        Object.entries({
          '1,2': [1, 2],
          '5': [5],
          '6,7,8,9': [6, 7, 8, 9],
        }),
      ),
    };
    instance.state.addLockedResiduePair([5]);
    instance.state.addLockedResiduePair([1, 2]);
    instance.state.addLockedResiduePair([6, 7, 8, 9]);
    instance.state.removeLockedResiduePair([666]);
    expect(instance.state).toEqual(expectedState);
  });

  it('Should allow all locked residues to be removed.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      lockedResiduePairs: new Map(),
    };
    instance.state.addLockedResiduePair([5]);
    instance.state.addLockedResiduePair([1, 2]);
    instance.state.addLockedResiduePair([9, 8, 7, 6]);
    instance.state.removeAllLockedResiduePairs();
    expect(instance.state).toEqual(expectedState);
  });

  it('Should allow all residues to be removed.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      candidateResidues: [],
      hoveredResidues: [],
      lockedResiduePairs: new Map(),
    };
    instance.state.addCandidateResidues([1]);
    instance.state.addHoveredResidues([2, 3]);
    instance.state.addLockedResiduePair([4, 5]);

    expect(instance.state).toEqual({
      ...initialState,
      candidateResidues: [1],
      hoveredResidues: [2, 3],
      lockedResiduePairs: new Map(Object.entries({ '4,5': [4, 5] })),
    });

    instance.state.clearAllResidues();
    expect(instance.state).toEqual(expectedState);
  });

  it('Should allow all non-locked residue pairs to be removed.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const lockedPairs = new Map(Object.entries({ '4,5': [4, 5] }));
    const expectedState = {
      ...initialState,
      candidateResidues: [],
      hoveredResidues: [],
      lockedResiduePairs: lockedPairs,
    };
    instance.state.addCandidateResidues([1]);
    instance.state.addHoveredResidues([2, 3]);
    instance.state.addLockedResiduePair([4, 5]);

    expect(instance.state).toEqual({
      ...initialState,
      candidateResidues: [1],
      hoveredResidues: [2, 3],
      lockedResiduePairs: lockedPairs,
    });

    instance.state.removeNonLockedResidues();
    expect(instance.state).toEqual(expectedState);
  });

  it('Should allow a locked residue pair to be toggled.', () => {
    const instance = shallow(<ResidueContextHandler />).instance() as ResidueContextHandler;
    const initialState = instance.state;
    const expectedState = {
      ...initialState,
      lockedResiduePairs: new Map(),
    };
    instance.state.toggleLockedResiduePair([5]);
    expect(instance.state).toEqual({
      ...initialState,
      lockedResiduePairs: new Map([['5', [5]]]),
    });

    instance.state.toggleLockedResiduePair([5]);
    expect(instance.state).toEqual(expectedState);
  });
});
