import { Set } from 'immutable';
import { ISpringGraphData } from '~bioblocks-viz~/data';
import { getCategories, getGraphData, getLabels, getSpecies, getSpring } from '~bioblocks-viz~/selector';

describe('SpringSelector', () => {
  it('Should create a new spring state if one does not exist.', () => {
    const expectedState = {
      category: '',
      graphData: { nodes: [] },
      species: 'mus_musculus',
    };
    expect(getSpring(undefined as any)).toMatchObject(expectedState);
    expect(getSpring({})).toMatchObject(expectedState);
  });

  it('Should allow selecting SPRING.', () => {
    const expectedState = {
      category: 'tissue',
      graphData: { nodes: [] },
      species: 'mus_musculus',
    };
    expect(
      getSpring({
        ['bioblocks/spring']: {
          category: 'tissue',
          graphData: { nodes: [] },
          species: 'mus_musculus',
        },
      }),
    ).toMatchObject(expectedState);
  });

  it('Should select basic data from SPRING.', () => {
    const state = {
      ['sample/spring']: {
        category: ',',
        graphData: { nodes: [] },
        species: 'mus_musculus',
      },
    };
    expect(getGraphData(state, 'sample')).toEqual({ nodes: [] });
    expect(getSpecies(state, 'sample')).toEqual('mus_musculus');
  });

  it('Should allow selection of categories based off the graph data.', () => {
    const graphData: ISpringGraphData = {
      nodes: [{ number: 1, labelForCategory: { tissue: 'liver', sample: '#1' } }],
    };

    const state = {
      ['sample/spring']: {
        category: ',',
        graphData,
        species: 'mus_musculus',
      },
    };
    expect(getCategories({}, 'sample')).toEqual(Set());
    expect(getCategories({ ['sample/spring']: { graphData: {} } }, 'sample')).toEqual(Set());
    expect(getCategories(state, 'sample')).toEqual(Set(['tissue', 'sample']));
  });

  it('Should allow selection of labels based off the graph data.', () => {
    const graphData: ISpringGraphData = {
      nodes: [
        { number: 1, labelForCategory: { tissue: 'liver', sample: '#1' } },
        { number: 2, labelForCategory: { tissue: 'brain', sample: '#2' } },
      ],
    };

    const state = {
      ['sample/spring']: {
        category: ',',
        graphData,
        species: 'mus_musculus',
      },
    };
    expect(getLabels({}, 'sample')).toEqual(Set());
    expect(getLabels({ ['sample/spring']: { graphData: {} } }, 'sample')).toEqual(Set());
    expect(getLabels(state, 'sample')).toEqual(Set(['liver', '#1', 'brain', '#2']));
  });
});
