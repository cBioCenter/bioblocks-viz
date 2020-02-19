// ~bb-viz~
// Spring Action
// Redux actions specifically for SPRING.
// They are composed of the generic action creators from bioblocks-viz/action, serving as an example of their usage.
// ~bb-viz~

import { Dispatch } from 'redux';

import { createDataActions, createValueActions } from '~bioblocks-viz~/action';
import { ISpringGraphData, SPECIES_TYPE } from '~bioblocks-viz~/data';

// tslint:disable-next-line:export-name
export const fetchSpringGraphData = (fetchFn: () => Promise<ISpringGraphData>, namespace = 'bioblocks') => async (
  dispatch: Dispatch,
) => {
  const actions = createDataActions<ISpringGraphData>('spring/graphData', namespace);

  dispatch(actions.request());

  try {
    const data = await fetchFn();
    dispatch(actions.success(data));
  } catch (e) {
    dispatch(actions.failure(e as Error));
    console.log(`An error occurred: ${e}`);
  }
};

export const createSpringActions = (namespace = 'bioblocks') => ({
  category: { ...createValueActions<string>('spring/category', namespace) },
  graphData: { ...createDataActions<ISpringGraphData>('spring/graphData', namespace) },
  species: { ...createValueActions<SPECIES_TYPE>('spring/species', namespace) },
});
