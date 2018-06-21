import * as fetchMock from 'jest-fetch-mock';
import { IContactMapData, SPRING_DATA_TYPE, VIZ_TYPE } from '../../data/chell-data';
import { CouplingContainer } from '../../data/CouplingContainer';
import { fetchAppropriateData, getCouplingScoresData, getSecondaryStructureData } from '../DataHelper';

describe('DataHelper', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('Should throw an error when attempting to fetch data for an unsupported visualization type.', async () => {
    const badVizType = 'Imagination';
    expect.assertions(1);
    await expect(fetchAppropriateData(badVizType as VIZ_TYPE, '')).rejects.toEqual({
      error: `Currently no appropriate data getter for ${badVizType}`,
    });
  });

  describe('Contact Map', () => {
    it('Should return empty data for an incorrect location.', async () => {
      const expected = {
        couplingScores: new CouplingContainer(),
        secondaryStructures: [],
      };
      fetchMock.mockResponse(JSON.stringify(expected));
      const result = (await fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, '')) as IContactMapData;
      expect(result.couplingScores.allContacts).toEqual(expected.couplingScores.allContacts);
      expect(result.secondaryStructures).toEqual(expected.secondaryStructures);
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

    it('Should parse contact monomer data correctly.', () => {
      const data = getCouplingScoresData(couplingScoresCsv);
      const expected = new CouplingContainer([firstScore, secondScore]);
      expect(data.allContacts).toEqual(expected.allContacts);
    });

    it('Should parse contact monomer data correctly when csv file has newline.', () => {
      const data = getCouplingScoresData(couplingScoresCsvWithNewline);
      const expected = new CouplingContainer([firstScore, secondScore]);
      expect(data.allContacts).toEqual(expected.allContacts);
    });

    const secondaryStructureCsv = ',id,sec_struct_3state\n\
      0,30,C\n\
      1,31,C';

    const secondaryStructureCsvWithNewline = secondaryStructureCsv + '\n';
    const expectedSecondaryData = [{ resno: 30, structId: 'C' }, { resno: 31, structId: 'C' }];

    it('Should parse secondary structure data correctly.', () => {
      const data = getSecondaryStructureData(secondaryStructureCsv);
      expect(data).toEqual(expectedSecondaryData);
    });

    it('Should parse secondary structure data correctly when csv file has newline.', () => {
      const data = getSecondaryStructureData(secondaryStructureCsvWithNewline);
      expect(data).toEqual(expectedSecondaryData);
    });

    it('Should load pdb data if available.', async () => {
      const expected = {
        couplingScores: new CouplingContainer(),
        secondaryStructures: [],
      };
      fetchMock.mockResponse(JSON.stringify(expected));

      const result = (await fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, '')) as IContactMapData;
      expect(result.pdbData).toEqual('Mock NGL path.');
    });

    it('Should load data even if pdb data if available.', async () => {
      const expected = {
        couplingScores: new CouplingContainer(),
        secondaryStructures: [],
      };
      fetchMock.mockResponse(JSON.stringify(expected));

      const result = (await fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, 'error')) as IContactMapData;
      expect(result.pdbData).toEqual(undefined);
    });
  });

  describe('NGL', () => {
    it('Should throw on incorrect location.', async () => {
      const reason = 'Empty path.';
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.NGL, '')).rejects.toBe(reason);
    });

    it('Should resolve on nonempty location.', async () => {
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.NGL, 'somewhere-over-the-rainbow')).resolves.toBeTruthy();
    });
  });

  describe('Spring', () => {
    const emptySpringInput = {
      colorData: { Sample: { label_colors: [], label_list: [] } },
      coordinateData: ',,,',
      graphData: {
        links: [],
        nodes: [],
      },
    };

    const sampleSpringInput = {
      colorData: { Sample: { label_colors: [], label_list: [] } },
      coordinateData: '0,267.93120,-346.14858\n\
        1,597.35064,520.63422',
      graphData: {
        links: [{ source: 0, target: 1, distance: 0 }],
        nodes: [{ name: 0, number: 0 }, { name: 1, number: 1 }],
      },
    };

    it('Should throw on incorrect location.', async () => {
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.SPRING, '')).rejects.toThrowError();
    });

    it('Should parse graph data.', async () => {
      fetchMock.mockResponseOnce(emptySpringInput.coordinateData);
      fetchMock.mockResponseOnce(JSON.stringify(emptySpringInput.graphData));
      fetchMock.mockResponseOnce(JSON.stringify(emptySpringInput.colorData));
      await expect(fetchAppropriateData(VIZ_TYPE.SPRING, 'kanto')).resolves.toEqual(emptySpringInput.graphData);
    });

    it('Should parse coordinate data.', async () => {
      fetchMock.mockResponseOnce(sampleSpringInput.coordinateData);
      fetchMock.mockResponseOnce(JSON.stringify(sampleSpringInput.graphData));
      fetchMock.mockResponseOnce(JSON.stringify(sampleSpringInput.colorData));
      const springData = (await fetchAppropriateData(VIZ_TYPE.SPRING, 'hoenn')) as SPRING_DATA_TYPE;
      const nodes = springData.nodes;
      expect(nodes[0].x).toBe(267.9312);
      expect(nodes[0].y).toBe(-346.14858);
      expect(nodes[1].x).toBe(597.35064);
      expect(nodes[1].y).toBe(520.63422);
    });

    it('Should parse coordinate data that ends on a newline.', async () => {
      fetchMock.mockResponseOnce(sampleSpringInput.coordinateData + '\n');
      fetchMock.mockResponseOnce(JSON.stringify(sampleSpringInput.graphData));
      fetchMock.mockResponseOnce(JSON.stringify(sampleSpringInput.colorData));
      const springData = (await fetchAppropriateData(VIZ_TYPE.SPRING, 'hoenn')) as SPRING_DATA_TYPE;
      const nodes = springData.nodes;
      expect(nodes[0].x).toBe(267.9312);
      expect(nodes[0].y).toBe(-346.14858);
      expect(nodes[1].x).toBe(597.35064);
      expect(nodes[1].y).toBe(520.63422);
    });

    it('Should parse color data using actual numbers.', async () => {
      const sampleColorData = { Sample: { label_colors: { P11B: 424242 }, label_list: ['P11B', 'P11B'] } };
      fetchMock.mockResponseOnce(sampleSpringInput.coordinateData);
      fetchMock.mockResponseOnce(JSON.stringify(sampleSpringInput.graphData));
      fetchMock.mockResponseOnce(JSON.stringify(sampleColorData));
      const springData = (await fetchAppropriateData(VIZ_TYPE.SPRING, 'hoenn')) as SPRING_DATA_TYPE;
      const nodes = springData.nodes;
      // #00007f === 127
      expect(nodes[0].colorHex).toBe(424242);
      expect(nodes[1].colorHex).toBe(424242);
    });

    it("Should parse color data starting with '#'", async () => {
      const sampleColorData = { Sample: { label_colors: { P11B: '#00007f' }, label_list: ['P11B', 'P11B'] } };
      fetchMock.mockResponseOnce(sampleSpringInput.coordinateData);
      fetchMock.mockResponseOnce(JSON.stringify(sampleSpringInput.graphData));
      fetchMock.mockResponseOnce(JSON.stringify(sampleColorData));
      const springData = (await fetchAppropriateData(VIZ_TYPE.SPRING, 'hoenn')) as SPRING_DATA_TYPE;
      const nodes = springData.nodes;
      // #00007f === 127
      expect(nodes[0].colorHex).toBe(127);
      expect(nodes[1].colorHex).toBe(127);
    });

    it("Should parse color data starting with '0x'", async () => {
      const sampleColorData = { Sample: { label_colors: { P11B: '0x0080ff' }, label_list: ['P11B', 'P11B'] } };
      fetchMock.mockResponseOnce(sampleSpringInput.coordinateData);
      fetchMock.mockResponseOnce(JSON.stringify(sampleSpringInput.graphData));
      fetchMock.mockResponseOnce(JSON.stringify(sampleColorData));
      const springData = (await fetchAppropriateData(VIZ_TYPE.SPRING, 'hoenn')) as SPRING_DATA_TYPE;
      const nodes = springData.nodes;
      // #00007f === 127
      expect(nodes[0].colorHex).toBe(0x0080ff);
      expect(nodes[1].colorHex).toBe(0x0080ff);
    });

    it('Should throw an error on invalid color data.', async () => {
      const expected = "Unable to parse color data - does it have keys named 'label_colors' and 'label_list'";
      const sampleColorData = { rival: 'silver' };
      fetchMock.mockResponseOnce(emptySpringInput.coordinateData);
      fetchMock.mockResponseOnce(JSON.stringify(emptySpringInput.graphData));
      fetchMock.mockResponseOnce(JSON.stringify(sampleColorData));
      await expect(fetchAppropriateData(VIZ_TYPE.SPRING, 'johto')).rejects.toThrowError(expected);
    });

    it('Should throw an error on invalid coordinate data.', async () => {
      const expected = 'Unable to parse coordinate data - Row 0 does not have at least 3 columns!';
      fetchMock.mockResponseOnce('ThisIsNotACsv');
      fetchMock.mockResponseOnce(JSON.stringify(emptySpringInput.graphData));
      fetchMock.mockResponseOnce(JSON.stringify(emptySpringInput.colorData));
      await expect(fetchAppropriateData(VIZ_TYPE.SPRING, 'johto')).rejects.toThrowError(expected);
    });

    it('Should throw an error on invalid graph data.', async () => {
      const expected = "Unable to parse graph data - does it have keys named 'nodes' and 'links'";
      const graphData = { starter: 'cyndaquil' };
      fetchMock.mockResponseOnce(emptySpringInput.coordinateData);
      fetchMock.mockResponseOnce(JSON.stringify(graphData));
      fetchMock.mockResponseOnce(JSON.stringify(emptySpringInput.colorData));
      await expect(fetchAppropriateData(VIZ_TYPE.SPRING, 'johto')).rejects.toThrowError(expected);
    });
  });

  describe('T-SNE', () => {
    it('Should return empty data for an incorrect location', async () => {
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
