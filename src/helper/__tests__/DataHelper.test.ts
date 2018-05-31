import * as fetchMock from 'jest-fetch-mock';
import { VIZ_TYPE } from '../../data/chell-data';
import { fetchAppropriateData, getCouplingScoresData } from '../DataHelper';

describe('DataHelper', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('Should throw an error when attempting to fetch data for an unsupported visualization type.', async () => {
    const badVizType = 'Imagination';
    expect.assertions(1);
    await expect(fetchAppropriateData(badVizType as VIZ_TYPE, '')).rejects.toEqual({
      error: `Currently no appropriate data getter for ${badVizType}`,
    });
  });

  describe('Contact Map', () => {
    test('Should return empty data for an incorrect location.', async () => {
      const expected = {
        couplingScores: [],
      };
      fetchMock.mockResponse(JSON.stringify(expected));
      await expect(fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, '')).resolves.toEqual(expected);
    });

    const couplingScoresCsv =
      'i,A_i,j,A_j,fn,cn,segment_i,segment_j,probability,dist_intra,dist_multimer,dist,precision\n\
    56,N,58,K,0,0.846606,A,A,0.9999062540489566,2.439798557258364,47.877125070329775,2.439798557258364,1.0\n\
    45,L,46,G,0,0.653624,A,A,0.9921059888909092,1.3037864088875917,37.58818230508094,1.3037864088875917,1.0';

    const couplingScoresCsvWithNewline = couplingScoresCsv + '\n';

    const firstScore = {
      i: 56,
      // tslint:disable-next-line:object-literal-sort-keys
      A_i: 'N',
      j: 58,
      A_j: 'K',
      fn: 0,
      cn: 0.846606,
      segment_i: 'A',
      segment_j: 'A',
      probability: 0.9999062540489566,
      dist_intra: 2.439798557258364,
      dist_multimer: 47.877125070329775,
      dist: 2.439798557258364,
      precision: 1.0,
    };

    const secondScore = {
      i: 45,
      // tslint:disable-next-line:object-literal-sort-keys
      A_i: 'L',
      j: 46,
      A_j: 'G',
      fn: 0,
      cn: 0.653624,
      segment_i: 'A',
      segment_j: 'A',
      probability: 0.9921059888909092,
      dist_intra: 1.3037864088875917,
      dist_multimer: 37.58818230508094,
      dist: 1.3037864088875917,
      precision: 1.0,
    };

    test('Should parse contact monomer data correctly.', async () => {
      const data = await getCouplingScoresData(couplingScoresCsv);
      expect(data).toEqual([firstScore, secondScore]);
    });

    test('Should parse contact monomer data correctly when csv file has newline.', async () => {
      const data = await getCouplingScoresData(couplingScoresCsvWithNewline);
      expect(data).toEqual([firstScore, secondScore]);
    });
  });

  describe('NGL', () => {
    test('Should throw on incorrect location.', async () => {
      const reason = 'Empty path.';
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.NGL, '')).rejects.toBe(reason);
    });

    test('Should resolve on nonempty location.', async () => {
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.NGL, 'somewhere-over-the-rainbow')).resolves.toBeTruthy();
    });
  });

  describe('Spring', () => {
    test('Should throw on incorrect location.', async () => {
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.SPRING, '')).rejects.toThrowError();
    });

    test('Should parse spring data.', async () => {
      const expected = { links: [], nodes: [] };
      const sampleColorData = { Sample: { label_colors: [], label_list: [] } };
      fetchMock.mockResponseOnce(',');
      fetchMock.mockResponseOnce(JSON.stringify(expected));
      fetchMock.mockResponseOnce(JSON.stringify(sampleColorData));
      await expect(fetchAppropriateData(VIZ_TYPE.SPRING, 'kanto')).resolves.toEqual(expected);
    });
  });

  describe('T-SNE', () => {
    test('Should return empty data for an incorrect location', async () => {
      const expected = [
        [0.2586516988310038068, -5.607454590334670641],
        [-3.112878150223143958, -3.342860779282196049],
        [5.882927335707632821, 4.215268767108215187],
      ];

      const sampleCsv =
        '2.586516988310038068e-01,-5.607454590334670641e+00\n\
        -3.112878150223143958e+00,-3.342860779282196049e+00\n\
        5.882927335707632821e+00,4.215268767108215187e+00\n';
      fetchMock.mockResponseOnce(sampleCsv);
      await expect(fetchAppropriateData(VIZ_TYPE['T-SNE'], '')).resolves.toEqual(expected);
    });
  });
});
