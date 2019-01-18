import { createStandardAction } from 'typesafe-actions';
// tslint:disable-next-line:no-submodule-imports
import { PayloadCreator } from 'typesafe-actions/dist/types';

// tslint:disable-next-line:export-name
export function createContainerActions<T>(dataSubscription: string, namespace = 'chell') {
  console.log(dataSubscription);
  console.log(namespace);

  return {
    add: createStandardAction(`${namespace}/${dataSubscription}/ADD`)<T>() as PayloadCreator<string, T>,
    clear: createStandardAction(`${namespace}/${dataSubscription}/CLEAR`)(),
    remove: createStandardAction(`${namespace}/${dataSubscription}/REMOVE`)<T>() as PayloadCreator<string, T>,
    set: createStandardAction(`${namespace}/${dataSubscription}/SET`)<T[]>(),
  };
}
