import { getType } from 'typesafe-actions';
import { LabelAction } from '~chell-viz~/action';

const initialState = {
  selectedLabel: '',
};

export const LabelReducer = (state = initialState, action: LabelAction) => {
  switch (action.type) {
    case getType(LabelAction.addLabel):
      return {
        ...state,
        selectedLabel: action.payload.label,
      };
    default:
      return state;
  }
};
