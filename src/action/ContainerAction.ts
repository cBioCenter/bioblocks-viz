import { createStandardAction } from 'typesafe-actions';

// tslint:disable-next-line:export-name
export const createContainerActions = <T>(datasetName: string, namespace = 'chell') => {
  const reducerName = `${namespace}/${datasetName}`.toUpperCase();

  return {
    add: createStandardAction(`${reducerName}/ADD`).map((payload: T) => ({
      meta: datasetName,
      payload,
    })),
    clear: createStandardAction(`${reducerName}/CLEAR`)(),
    remove: createStandardAction(`${reducerName}/REMOVE`).map((payload: T) => ({
      meta: datasetName,
      payload,
    })),
    set: createStandardAction(`${reducerName}/SET`)<T[]>(),
  };
};
