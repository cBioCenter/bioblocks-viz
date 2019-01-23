import { Dispatch } from 'redux';

import { createDataActions } from '~chell-viz~/action';
import { ISpringGraphData } from '~chell-viz~/data';

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
