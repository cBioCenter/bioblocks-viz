import { Set } from 'immutable';
import { getType } from 'typesafe-actions';

import { LabeledCellsActions, LabeledCellsActionType } from '~chell-viz~/action';
import { AnatomogramMapping, ISpringGraphData, SPECIES_TYPE } from '~chell-viz~/data';

const initialGraphData: ISpringGraphData = { nodes: [] };

const initialState = {
  categories: Set<string>(),
  currentCells: Set<number>(),
  graphData: initialGraphData,
  labelsByCategory: new Map<string, Set<string>>(),
  selectedLabels: Set<string>(['']),
  species: 'homo_sapiens' as SPECIES_TYPE,
};

export type LabeledCellsState = typeof initialState;

export const LabeledCellsReducer = (state = initialState, action: LabeledCellsActionType): LabeledCellsState => {
  switch (action.type) {
    case getType(LabeledCellsActions.addLabel):
      const { label } = action.payload;

      return {
        ...state,
        currentCells: deriveCellsFromLabels(AnatomogramMapping[state.species][label], state),
        selectedLabels: Set<string>([label]),
      };
    case getType(LabeledCellsActions.setCurrentCells):
      const { cells } = action.payload;

      return {
        ...state,
        currentCells: Set<number>(cells),
        selectedLabels: deriveLabelsFromCells(cells, state),
      };
    case getType(LabeledCellsActions.springData.success):
      const { nodes } = action.payload;
      const categories = Set<string>(nodes.length >= 1 ? Object.keys(nodes[0].labelForCategory) : []);
      const labelsByCategory = new Map<string, Set<string>>();

      categories.forEach(category => {
        if (category) {
          const labels = Set<string>(Array.from(nodes.map(node => node.labelForCategory[category])));
          labelsByCategory.set(category, labels);
        }
      });

      return {
        ...state,
        categories,
        graphData: action.payload,
        labelsByCategory,
      };
    default:
      return state;
  }
};

const deriveCellsFromLabels = (candidateLabels: string[], state: LabeledCellsState) => {
  let validCategories = Set<string>();
  candidateLabels.forEach(label => {
    state.categories.forEach(category => {
      if (category) {
        const labels = state.labelsByCategory.get(category);
        if (labels && labels.includes(label)) {
          validCategories = validCategories.add(category);
        }
      }
    });
  });

  let cellIndices = Set<number>();
  for (const node of state.graphData.nodes) {
    validCategories.forEach(category => {
      if (category && candidateLabels.includes(node.labelForCategory[category])) {
        cellIndices = cellIndices.add(node.number);

        return;
      }
    });
  }

  return cellIndices;
};

const deriveLabelsFromCells = (currentCells: number[], state: LabeledCellsState) => {
  const { categories, graphData } = state;
  let result = Set<string>();

  for (const cellIndex of currentCells) {
    for (const category of categories.toArray()) {
      AnatomogramMapping[state.species][graphData.nodes[cellIndex].labelForCategory[category]].forEach(
        label => (result = result.add(label)),
      );
    }
  }

  return result;
};
