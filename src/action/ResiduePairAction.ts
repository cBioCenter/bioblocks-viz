// ~bb-viz~
// Residue Pair Action
// Redux actions specifically for residue pair interactions.
// They are composed of the generic action creators from bioblocks-viz/action, serving as an example of their usage.
// ~bb-viz~

import { createContainerActions, createObjectActions } from '~bioblocks-viz~/action';
import { RESIDUE_TYPE } from '~bioblocks-viz~/data';
import { RESIDUE_PAIR_DATASET_NAME } from '~bioblocks-viz~/reducer';

// tslint:disable-next-line:export-name
export const createResiduePairActions = (namespace = 'bioblocks') => ({
  candidates: createContainerActions<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/candidates`, namespace),
  hovered: createContainerActions<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/hovered`, namespace),
  locked: createObjectActions<RESIDUE_TYPE[]>(`${RESIDUE_PAIR_DATASET_NAME}/locked`, namespace),
});
