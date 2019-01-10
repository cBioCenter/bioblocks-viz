import * as fetchMock from 'jest-fetch-mock';
import { default as reduxMockStore, MockStoreCreator } from 'redux-mock-store';
import * as thunk from 'redux-thunk';
import { getType } from 'typesafe-actions';
import { fetchLabeledSpringData, LabeledCellsActions } from '~chell-viz~/action';

const middleWares = [thunk.default];
let mockStore: MockStoreCreator;

describe('LabeledCellsActions', () => {
  beforeEach(() => {
    mockStore = reduxMockStore(middleWares);
    fetchMock.resetMocks();
  });

  it('Should handle adding labels.', () => {
    const expectedAction = {
      payload: 'Heart',
      type: getType(LabeledCellsActions.addLabel),
    };
    expect(LabeledCellsActions.addLabel('Heart')).toEqual(expectedAction);
  });

  it('Should handle setting cells.', () => {
    const expectedAction = {
      payload: [0, 1, 2],
      type: getType(LabeledCellsActions.setCurrentCells),
    };
    expect(LabeledCellsActions.setCurrentCells([0, 1, 2])).toEqual(expectedAction);
  });

  it('Should handle successfully fetching SPRING data.', async () => {
    const mockData = {
      Sample: {
        label_colors: {},
        label_list: [],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    const store = mockStore({ labels: [] });
    const expectedActions = [
      {
        type: getType(LabeledCellsActions.springData.request),
      },
      {
        payload: { nodes: [] },
        type: getType(LabeledCellsActions.springData.success),
      },
    ];
    await fetchLabeledSpringData('Gamelon')(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('Should handle failing to fetch SPRING data.', async () => {
    fetchMock.mockRejectOnce(Error('No!'));
    const store = mockStore({ labels: [] });
    const expectedActions = [
      {
        type: getType(LabeledCellsActions.springData.request),
      },
      {
        payload: Error('No!'),
        type: getType(LabeledCellsActions.springData.failure),
      },
    ];
    await fetchLabeledSpringData('Gamelon')(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
