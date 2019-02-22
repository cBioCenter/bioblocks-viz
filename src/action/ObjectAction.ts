import { createStandardAction } from 'typesafe-actions';

// tslint:disable-next-line:export-name
export const createObjectActions = <T>(datasetName: string, namespace = 'bioblocks') => {
  const reducerName = `${namespace}/${datasetName}`.toUpperCase();

  return {
    add: createStandardAction(`${reducerName}_ADD`).map((payload: { [key: string]: T }) => ({
      meta: datasetName,
      payload,
    })),
    clear: createStandardAction(`${reducerName}_CLEAR`)(),
    remove: createStandardAction(`${reducerName}_REMOVE`).map((payload: string) => ({
      meta: datasetName,
      payload,
    })),
    removeMultiple: createStandardAction(`${reducerName}_REMOVE_MULTIPLE`).map((payload: string[]) => ({
      meta: datasetName,
      payload,
    })),
    set: createStandardAction(`${reducerName}_SET`).map((payload: { [key: string]: T }) => ({
      meta: datasetName,
      payload,
    })),
    toggle: createStandardAction(`${reducerName}_TOGGLE`).map((payload: { [key: string]: T }) => ({
      meta: datasetName,
      payload,
    })),
  };
};
