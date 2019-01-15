import { createStandardAction } from 'typesafe-actions';
// tslint:disable-next-line:no-submodule-imports
import { PayloadCreator } from 'typesafe-actions/dist/types';

// tslint:disable-next-line:export-name
export function createToggleableActions<T>() {
  return {
    add: createStandardAction('ADD')<T>() as PayloadCreator<'ADD', T>,
    clear: createStandardAction('CLEAR')(),
    remove: createStandardAction('REMOVE')<T>() as PayloadCreator<'REMOVE', T>,
    set: createStandardAction('SET')<T[]>(),
  };
}
