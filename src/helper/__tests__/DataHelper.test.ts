import { VIZ_TYPE } from '../../data/chell-data';
import { fetchAppropriateData } from '../DataHelper';

describe('DataHelper', () => {
  test('Should throw an error when attempting to fetch data for an unsupported visualization type.', async () => {
    const badVizType = 'Imagination';
    expect.assertions(1);
    await expect(fetchAppropriateData(badVizType as VIZ_TYPE, '')).rejects.toEqual({
      error: `Currently no appropriate data getter for ${badVizType}`,
    });
  });

  describe('Contact Map', () => {
    test('Should return empty data for an incorrect location', async () => {
      await expect(fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, '')).resolves.toEqual({
        contactMonomer: [],
        couplingScore: [],
      });
    });
  });

  describe('NGL', () => {
    test('Should throw on incorrect location.', async () => {
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.NGL, '')).rejects.toThrowError();
    });
  });

  describe('Spring', () => {
    test('Should throw on incorrect location.', async () => {
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.SPRING, '')).rejects.toThrowError();
    });
  });

  describe('T-SNE', () => {
    test('Should return empty data for an incorrect location', async () => {
      await expect(fetchAppropriateData(VIZ_TYPE['T-SNE'], '')).resolves.toEqual([]);
    });
  });
});
