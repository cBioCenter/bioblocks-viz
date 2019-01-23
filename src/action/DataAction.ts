import { Dispatch } from 'redux';
import { createAsyncAction } from 'typesafe-actions';

// tslint:disable-next-line:export-name
export const createDataActions = <T>(datasetName: string, namespace = 'chell') => {
  const reducerName = `${namespace}/${datasetName}`.toUpperCase();

  return createAsyncAction(
    `${reducerName}_FETCH_DATA_REQUEST`,
    `${reducerName}_FETCH_DATA_SUCCESS`,
    `${reducerName}_FETCH_DATA_FAILURE`,
  )<void, T, Error>();
};

export const fetchDataset = <T>(datasetName: string, fetchFn: () => Promise<T>, namespace = 'chell') => async (
  dispatch: Dispatch,
) => {
  const actions = createDataActions<T>(datasetName, namespace);

  dispatch(actions.request());

  try {
    const data = await fetchFn();
    dispatch(actions.success(data));
  } catch (e) {
    dispatch(actions.failure(e as Error));
    console.log(`An error occurred: ${e}`);
  }
};
