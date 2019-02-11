import { getType } from 'typesafe-actions';

import { createResiduePairActions } from '~chell-viz~/action';

describe('ResiduePairAction', () => {
  it('Should use a default namespace if none is given.', () => {
    const namespace = 'CHELL';

    const allReducerActions = {
      candidates: Object.values(createResiduePairActions().candidates),
      hovered: Object.values(createResiduePairActions().hovered),
      locked: Object.values(createResiduePairActions().locked),
    };

    expect(allReducerActions.candidates).toHaveLength(6);
    expect(allReducerActions.hovered).toHaveLength(6);
    expect(allReducerActions.locked).toHaveLength(6);

    for (const reducerActions of Object.values(allReducerActions)) {
      for (const action of reducerActions) {
        expect(getType(action).startsWith(`${namespace}/`)).toBe(true);
      }
    }
  });

  it('Should use a namespace if provided.', () => {
    const namespace = 'FRATELLIS';

    const allReducerActions = {
      candidates: Object.values(createResiduePairActions(namespace).candidates),
      hovered: Object.values(createResiduePairActions(namespace).hovered),
      locked: Object.values(createResiduePairActions(namespace).locked),
    };

    expect(allReducerActions.candidates).toHaveLength(6);
    expect(allReducerActions.hovered).toHaveLength(6);
    expect(allReducerActions.locked).toHaveLength(6);

    for (const reducerActions of Object.values(allReducerActions)) {
      for (const action of reducerActions) {
        expect(getType(action).startsWith(`${namespace}/`)).toBe(true);
      }
    }
  });
});
