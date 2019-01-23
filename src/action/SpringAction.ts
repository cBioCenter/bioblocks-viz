import { Dispatch } from 'redux';

import { createDataActions, createValueActions } from '~chell-viz~/action';
import { ISpringGraphData, SPECIES_TYPE } from '~chell-viz~/data';

// tslint:disable-next-line:export-name
export const fetchSpringGraphData = (
  datasetName: string,
  fetchFn: () => Promise<ISpringGraphData>,
  namespace = 'chell',
) => async (dispatch: Dispatch) => {
  const actions = createDataActions<ISpringGraphData>(`${datasetName}/graphData`, namespace);

  dispatch(actions.request());

  try {
    const data = await fetchFn();
    dispatch(actions.success(data));
  } catch (e) {
    dispatch(actions.failure(e as Error));
    console.log(`An error occurred: ${e}`);
  }
};

export const createSpringActions = (namespace = 'chell') => ({
  graphData: { ...createDataActions<ISpringGraphData>('spring/graphData', namespace) },
  species: { ...createValueActions<SPECIES_TYPE>('spring/species', namespace) },
});
