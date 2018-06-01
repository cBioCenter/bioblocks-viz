import * as fetchMock from 'jest-fetch-mock';

import { fetchCSVFile, fetchJSONFile } from '../FetchHelper';

describe('FetchHelper', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('CSV Files', () => {
    it('Should correctly fetch them.', async () => {
      const expected = '1,2,3';
      fetchMock.mockResponseOnce(expected);
      const result = await fetchCSVFile('foo.csv');
      expect(result).toBe(expected);
    });

    it('Should throw errors.', async () => {
      const expected = 'Chell-viz error fetching CSV File!';
      fetchMock.mockResponseOnce('error', { status: 400 });
      await expect(fetchCSVFile('foo.csv')).rejects.toThrowError(expected);
    });
  });

  describe('JSON Files', () => {
    it('Should correctly fetch them.', async () => {
      const expected = { nier: 'automata' };
      (fetch as any).mockResponseOnce(JSON.stringify(expected));
      const result = await fetchJSONFile('best-game.json');
      expect(result).toEqual(expected);
    });

    it('Should throw errors.', async () => {
      const expected = 'Chell-viz error fetching JSON File!';
      fetchMock.mockResponseOnce('error', { status: 400 });
      await expect(fetchJSONFile('foo.csv')).rejects.toThrowError(expected);
    });
  });
});
