import { Set } from 'immutable';

import { ISpringGraphData } from '~chell-viz~/data';
import { ISpringReducerState, RootState } from '~chell-viz~/reducer';

export const selectSpring = (state: RootState, namespace = 'chell') =>
  state[`${namespace}/spring`] as ISpringReducerState;

export const selectCategories = (state: RootState, namespace = 'chell') =>
  selectSpring(state, namespace) ? getCategories(selectSpring(state, namespace).graphData) : Set<string>();

const getCategories = (graphData: ISpringGraphData) => {
  const nodes = graphData ? graphData.nodes : [];
  const categories = Set<string>(nodes.length >= 1 ? Object.keys(nodes[0].labelForCategory) : []);
  const labelsByCategory = new Map<string, Set<string>>();

  categories.forEach(category => {
    if (category) {
      const labels = Set<string>(Array.from(nodes.map(node => node.labelForCategory[category])));
      labelsByCategory.set(category, labels);
    }
  });

  return categories;
};
