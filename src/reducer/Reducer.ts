import { createAction } from 'redux-actions';

const initialState = {
  selectedLabel: '',
};

const ADD_LABEL = 'ADD_LABEL';

export const addLabel = createAction(ADD_LABEL, (label: string) => label);

export const Reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_LABEL:
      console.log(state);
      console.log(action);

      return {
        ...state,
        selectedLabel: '',
      };
    default:
      return state;
  }
};
