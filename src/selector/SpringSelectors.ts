import { Set } from 'immutable';

import { ISpringGraphData, SPECIES_TYPE } from '~chell-viz~/data';
import { ISpringReducerState, RootState } from '~chell-viz~/reducer';

export const selectSpring = (state: RootState, namespace = 'chell') =>
  state[`${namespace}/spring`] as ISpringReducerState;

export const selectCategories = (state: RootState, namespace = 'chell') =>
  selectSpring(state, namespace) ? getCategories(selectSpring(state, namespace).graphData) : Set<string>();

export const selectSpecies = (state: RootState, namespace = 'chell'): SPECIES_TYPE =>
  selectSpring(state, namespace) ? selectSpring(state, namespace).species : 'mus_musculus';

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

export const getLabels = (graphData: ISpringGraphData) => {
  const nodes = graphData ? graphData.nodes : [];
  const categories = Set<string>(nodes.length >= 1 ? Object.keys(nodes[0].labelForCategory) : []);
  let labels = Set<string>();

  categories.forEach(category => {
    if (category) {
      labels = labels.merge(Set<string>(Array.from(nodes.map(node => node.labelForCategory[category]))));
    }
  });

  console.log(`labels: ${JSON.stringify(labels)}`);

  return labels;
};
