import { VIZ_TYPE } from 'chell';
import { fetchAppropriateData } from '../DataHelper';

describe('DataHelper', () => {
  test('Should throw an error when attempting to fetch data for an unsupported visualization type.', async () => {
    const badVizType = 'Imagination';
    expect.assertions(1);
    await expect(fetchAppropriateData(badVizType as VIZ_TYPE, '')).rejects.toEqual({
      error: `Currently no appropriate data getter for ${badVizType}`,
    });
  });
});
