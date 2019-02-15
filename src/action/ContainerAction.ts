import { createStandardAction } from 'typesafe-actions';

// tslint:disable-next-line:export-name
export const createContainerActions = <T>(datasetName: string, namespace = 'bioblocks') => {
  const reducerName = `${namespace}/${datasetName}`.toUpperCase();

  return {
    add: createStandardAction(`${reducerName}_ADD`).map((payload: T) => ({
      meta: datasetName,
      payload,
    })),
    addMultiple: createStandardAction(`${reducerName}_ADD_MULTIPLE`).map((payload: T[]) => ({
      meta: datasetName,
      payload,
    })),
    clear: createStandardAction(`${reducerName}_CLEAR`)(),
    remove: createStandardAction(`${reducerName}_REMOVE`).map((payload: T) => ({
      meta: datasetName,
      payload,
    })),
    removeMultiple: createStandardAction(`${reducerName}_REMOVE_MULTIPLE`).map((payload: T[]) => ({
      meta: datasetName,
      payload,
    })),
    set: createStandardAction(`${reducerName}_SET`).map((payload: T[]) => ({
      meta: datasetName,
      payload,
    })),
  };
};
