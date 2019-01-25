import { default as reduxMockStore, MockStoreCreator } from 'redux-mock-store';
import * as thunk from 'redux-thunk';

import { createSpringActions, fetchSpringGraphData } from '~chell-viz~/action';

const middleWares = [thunk.default];
let mockStore: MockStoreCreator;

describe('SpringAction', () => {
  describe('Graph Data Fetch Actions', () => {
    it('Should create error actions.', () => {
      const expectedAction = {
        payload: Error('Party crashed'),
        type: 'CHELL/SPRING/GRAPHDATA_FETCH_DATA_FAILURE',
      };
      expect(createSpringActions().graphData.failure(Error('Party crashed'))).toEqual(expectedAction);
    });

    it('Should create request actions.', () => {
      const expectedAction = {
        type: 'CHELL/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
      };
      expect(createSpringActions().graphData.request()).toEqual(expectedAction);
    });

    it('Should create success actions.', () => {
      const expectedAction = {
        payload: { nodes: [] },
        type: 'CHELL/SPRING/GRAPHDATA_FETCH_DATA_SUCCESS',
      };
      expect(createSpringActions().graphData.success({ nodes: [] })).toEqual(expectedAction);
    });

    it('Should use a namespace if provided.', () => {
      expect(createSpringActions('EMINEM').graphData.failure(Error('No!')).type).toEqual(
        'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_FAILURE',
      );
      expect(createSpringActions('EMINEM').graphData.request().type).toEqual(
        'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
      );
      expect(createSpringActions('EMINEM').graphData.success({ nodes: [] }).type).toEqual(
        'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_SUCCESS',
      );
    });
  });

  describe('Species Actions', () => {
    it('Should create clear actions.', () => {
      const expectedAction = {
        type: 'CHELL/SPRING/SPECIES_CLEAR',
      };
      expect(createSpringActions().species.clear()).toEqual(expectedAction);
    });

    it('Should create set actions.', () => {
      const expectedAction = {
        meta: 'spring/species',
        payload: 'mus_musculus',
        type: 'CHELL/SPRING/SPECIES_SET',
      };
      expect(createSpringActions().species.set('mus_musculus')).toEqual(expectedAction);
    });

    it('Should use a namespace if provided.', () => {
      expect(createSpringActions('EMINEM').species.clear().type).toEqual('EMINEM/SPRING/SPECIES_CLEAR');
      expect(createSpringActions('EMINEM').species.set('homo_sapiens').type).toEqual('EMINEM/SPRING/SPECIES_SET');
    });
  });

  describe('fetchSpringGraphData Callback', () => {
    beforeEach(() => {
      mockStore = reduxMockStore(middleWares);
    });

    it('Should dispatch the right actions for successfully fetching data.', async () => {
      const store = mockStore({});
      await fetchSpringGraphData(async () => Promise.resolve({ nodes: [] }))(store.dispatch);

      const expectedActions = [
        {
          type: 'CHELL/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
        },
        {
          payload: { nodes: [] },
          type: 'CHELL/SPRING/GRAPHDATA_FETCH_DATA_SUCCESS',
        },
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('Should dispatch the right actions for failing to fetch data.', async () => {
      const store = mockStore({});
      await fetchSpringGraphData(async () => Promise.reject('No!'))(store.dispatch);

      const expectedActions = [
        {
          type: 'CHELL/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
        },
        {
          payload: 'No!',
          type: 'CHELL/SPRING/GRAPHDATA_FETCH_DATA_FAILURE',
        },
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('Should use a namespace if provided.', async () => {
      const store = mockStore({});
      await fetchSpringGraphData(async () => Promise.resolve({ nodes: [] }), 'eminem')(store.dispatch);
      await fetchSpringGraphData(async () => Promise.reject('No!'), 'eminem')(store.dispatch);

      const expectedActions = [
        {
          type: 'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
        },
        {
          payload: { nodes: [] },
          type: 'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_SUCCESS',
        },
        {
          type: 'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_REQUEST',
        },
        {
          payload: 'No!',
          type: 'EMINEM/SPRING/GRAPHDATA_FETCH_DATA_FAILURE',
        },
      ];

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
