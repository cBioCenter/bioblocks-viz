import { ActionType, createAction } from 'typesafe-actions';

const addLabel = createAction('ADD_LABEL', resolve => {
  return (label: string) => resolve({ label });
});

const removeLabel = createAction('REMOVE_LABEL', resolve => {
  return (label: string) => resolve({ label });
});

export const LabelActions = {
  addLabel,
  removeLabel,
};

export type LabelActionType = ActionType<typeof LabelActions>;
