import { createStandardAction } from 'typesafe-actions';

// tslint:disable-next-line:export-name
export const createValueActions = <T>(datasetName: string, namespace = 'bioblocks') => {
  const reducerName = `${namespace}/${datasetName}`.toUpperCase();

  return {
    clear: createStandardAction(`${reducerName}_CLEAR`)(),
    set: createStandardAction(`${reducerName}_SET`).map((payload: T) => ({
      meta: datasetName,
      payload,
    })),
  };
};
