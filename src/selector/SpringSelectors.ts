import { Set } from 'immutable';
import { createSelector } from 'reselect';

import { ISpringReducerState, RootState } from '~bioblocks-viz~/reducer';

export const getSpring = (state: RootState, namespace = 'bioblocks') => {
  return (state === undefined || !state[`${namespace}/spring`]
    ? {
        category: '',
        graphData: { nodes: [] },
      }
    : state[`${namespace}/spring`]) as ISpringReducerState;
};

export const getGraphData = (state: RootState, namespace = 'bioblocks') => getSpring(state, namespace).graphData;

export const getCategories = createSelector(
  [getGraphData],
  graphData => {
    const nodes = graphData && graphData.nodes ? graphData.nodes : [];
    const categories = Set<string>(nodes.length >= 1 ? Object.keys(nodes[0].labelForCategory) : []);
    const labelsByCategory = new Map<string, Set<string>>();

    categories.forEach(category => {
      if (category) {
        const labels = Set<string>(Array.from(nodes.map(node => node.labelForCategory[category])));
        labelsByCategory.set(category, labels);
      }
    });

    return categories;
  },
);

export const getLabels = createSelector(
  [getGraphData],
  graphData => {
    const nodes = graphData && graphData.nodes ? graphData.nodes : [];
    const categories = Set<string>(nodes.length >= 1 ? Object.keys(nodes[0].labelForCategory) : []);
    let labels = Set<string>();

    categories.forEach(category => {
      if (category) {
        labels = labels.merge(Set<string>(Array.from(nodes.map(node => node.labelForCategory[category]))));
      }
    });

    return labels;
  },
);
