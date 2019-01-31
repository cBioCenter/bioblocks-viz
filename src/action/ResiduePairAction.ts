import { createContainerActions, createObjectActions } from '~chell-viz~/action';
import { RESIDUE_TYPE } from '~chell-viz~/data';
import { RESIDUE_PAIR_DATASET_NAME } from '~chell-viz~/reducer';

// tslint:disable-next-line:export-name
export const createResiduePairActions = (namespace = 'chell') => ({
  candidates: createContainerActions<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/candidates`, namespace),
  hovered: createContainerActions<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/hovered`, namespace),
  locked: createObjectActions<RESIDUE_TYPE[]>(`${RESIDUE_PAIR_DATASET_NAME}/locked`, namespace),
});
