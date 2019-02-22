import { createContainerActions, createObjectActions } from '~bioblocks-viz~/action';
import { RESIDUE_TYPE } from '~bioblocks-viz~/data';
import { RESIDUE_PAIR_DATASET_NAME } from '~bioblocks-viz~/reducer';

// tslint:disable-next-line:export-name
export const createResiduePairActions = (namespace = 'bioblocks') => ({
  candidates: createContainerActions<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/candidates`, namespace),
  hovered: createContainerActions<RESIDUE_TYPE>(`${RESIDUE_PAIR_DATASET_NAME}/hovered`, namespace),
  locked: createObjectActions<RESIDUE_TYPE[]>(`${RESIDUE_PAIR_DATASET_NAME}/locked`, namespace),
});
