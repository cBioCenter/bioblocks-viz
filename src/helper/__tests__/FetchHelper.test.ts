import { fetchCSVFile, fetchJSONFile, readFileAsText } from '~bioblocks-viz~/helper';

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
      const expected = 'Bioblocks-viz error fetching CSV File!';
      fetchMock.mockResponseOnce('error', { status: 400 });
      await expect(fetchCSVFile('foo.csv')).rejects.toThrowError(expected);
    });
  });

  describe('JSON Files', () => {
    it('Should correctly fetch them.', async () => {
      const expected = { nier: 'automata' };
      fetchMock.mockResponseOnce(JSON.stringify(expected));
      const result = await fetchJSONFile('best-game.json');
      expect(result).toEqual(expected);
    });

    it('Should throw errors.', async () => {
      const expected = 'Bioblocks-viz error fetching JSON File!';
      fetchMock.mockResponseOnce('error', { status: 400 });
      await expect(fetchJSONFile('foo.json')).rejects.toThrowError(expected);
    });
  });

  describe('Text Files', () => {
    it('Should allow any file to be read as text', async () => {
      const expected = JSON.stringify({ nier: 'automata' });
      const file = new File([expected], 'file', { type: 'text/html' });
      const result = await readFileAsText(file);
      expect(result).toEqual(expected);
    });

    it('Should catch errors with invalid files.', async () => {
      expect.assertions(1);

      return expect(readFileAsText({} as any)).rejects.toBeTruthy();
    });

    it('Should catch parsing errors with.', async () => {
      expect.assertions(1);
      const expected = JSON.stringify({ nier: 'automata' });
      const file = new File([expected], 'file', { type: 'text/html' });

      FileReader.prototype.readAsText = function() {
        if (this.onerror) {
          this.onerror(new ProgressEvent('error') as ProgressEvent<FileReader>);
        }
      };

      return expect(readFileAsText(file)).rejects.toEqual('Problem parsing input file.');
    });
  });
});
