import { getType } from 'typesafe-actions';
import { LabelActions, LabelActionType } from '~chell-viz~/action';

const initialState = {
  selectedLabel: '',
};

export const LabelReducer = (state = initialState, action: LabelActionType) => {
  switch (action.type) {
    case getType(LabelActions.addLabel):
      return {
        ...state,
        selectedLabel: action.payload.label,
      };
    default:
      return state;
  }
};
