import { default as reduxMockStore, MockStoreCreator } from 'redux-mock-store';
import * as thunk from 'redux-thunk';
import { getType } from 'typesafe-actions';

import { createDataActions, fetchDataset } from '~chell-viz~/action';

const middleWares = [thunk.default];
let mockStore: MockStoreCreator;

describe('DataAction', () => {
  describe('Fetch Actions', () => {
    it('Should create error actions.', () => {
      const expectedAction = {
        payload: Error('Party crashed'),
        type: 'CHELL/EXAMPLE_FETCH_DATA_FAILURE',
      };
      expect(createDataActions('example').failure(Error('Party crashed'))).toEqual(expectedAction);
    });

    it('Should create request actions.', () => {
      const expectedAction = {
        type: 'CHELL/EXAMPLE_FETCH_DATA_REQUEST',
      };
      expect(createDataActions('example').request()).toEqual(expectedAction);
    });

    it('Should create success actions.', () => {
      const expectedAction = {
        payload: 'party',
        type: 'CHELL/EXAMPLE_FETCH_DATA_SUCCESS',
      };
      expect(createDataActions('example').success('party')).toEqual(expectedAction);
    });

    it('Should use a namespace if provided.', () => {
      const namespace = 'FRATELLIS';

      expect(createDataActions('music', namespace).failure(Error('Nina')).type).toEqual(
        'FRATELLIS/MUSIC_FETCH_DATA_FAILURE',
      );
      expect(createDataActions('music', namespace).request().type).toEqual('FRATELLIS/MUSIC_FETCH_DATA_REQUEST');
      expect(createDataActions('music', namespace).success('Vince').type).toEqual('FRATELLIS/MUSIC_FETCH_DATA_SUCCESS');
    });
  });

  describe('Fetch Callback', () => {
    beforeEach(() => {
      mockStore = reduxMockStore(middleWares);
    });

    it('Should dispatch the right actions for successfully fetching data.', async () => {
      const store = mockStore({});
      await fetchDataset('example', () => Promise.resolve('A Sentence of Sorts'))(store.dispatch);

      const expectedActions = [
        {
          type: getType(createDataActions('example').request),
        },
        {
          payload: 'A Sentence of Sorts',
          type: getType(createDataActions('example').success),
        },
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('Should dispatch the right actions for failing to fetch data.', async () => {
      const store = mockStore({ labels: [] });
      await fetchDataset('example', () => Promise.reject('No!'))(store.dispatch);

      const expectedActions = [
        {
          type: getType(createDataActions('example').request),
        },
        {
          payload: 'No!',
          type: getType(createDataActions('example').failure),
        },
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
