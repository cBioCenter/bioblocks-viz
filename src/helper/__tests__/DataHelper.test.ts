import * as fetchMock from 'jest-fetch-mock';
import { inspect as stringifyCircularJSON } from 'util';
import { IContactMapData, ICouplingScore, SPRING_DATA_TYPE, VIZ_TYPE } from '../../data/chell-data';
import { ChellPDB } from '../../data/ChellPDB';
import { CouplingContainer } from '../../data/CouplingContainer';
import {
  augmentCouplingScoresWithResidueMapping,
  fetchAppropriateData,
  getCouplingScoresData,
  getSecondaryStructureData,
} from '../DataHelper';
import { generateResidueMapping } from '../ResidueMapper';

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
    it('Should throw on incorrect location.', async () => {
      const reason = 'Empty path.';
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, '')).rejects.toBe(reason);
    });

    const couplingScoresCsv =
      '145,81,0.79312,7.5652,A,A,0.9,2.4,47,1.0,E,R\n\
      179,66,0.78681,3.5872,A,A,0.9,1.3,37,1.0,T,M';

    const couplingScoresCsvWithNewline = couplingScoresCsv + '\n';

    const couplingScoresCsvWithHeaders =
      'i,j,cn,dist,A_i,A_j,segment_i,segment_j,probability,dist_intra,dist_multimer,dist,precision,\n' +
      '145,81,0.79312,7.5652,E,R,0,0,0,0,1.0,14,18\n\
      179,66,0.78681,3.5872,T,M,0,0,0,1.0,24,51';

    const residueMappingCsv =
      'up_index	up_residue	ss_pred	ss_conf	msa_index	msa_cons%	msa_cons	in_const	pdb_atom	pdb_chain	pdb_index	pdb_residue	pdb_x_pos	pdb_y_pos	pdb_z_pos\n\
      66	M	H	1	66	51	*	*	340	A	68	M	11.714	0.502	32.231\n\
      81	R	H	2	81	18	*	*	448	A	83	R	-4.075	-8.650	45.662\n\
      145	E	H	8	145	14	*	*	936	A	147	E	7.560	-10.561	44.062\n\
      179	T	C	8	179	24	*	*	1219	A	181	T	12.019	-5.034	29.684';

    const firstScore: ICouplingScore = {
      A_i: 'E',
      A_j: 'R',
      cn: 0.79312,
      dist: 7.5652,
      i: 145,
      j: 81,
    };

    const firstScorePDB: ICouplingScore = {
      A_i: 'E',
      A_j: 'R',
      cn: 0.79312,
      dist: 7.5652,
      i: 147,
      j: 83,
    };

    const secondScore: ICouplingScore = {
      A_i: 'T',
      A_j: 'M',
      cn: 0.78681,
      dist: 3.5872,
      i: 179,
      j: 66,
    };

    const secondScorePDB: ICouplingScore = {
      A_i: 'T',
      A_j: 'M',
      cn: 0.78681,
      dist: 3.5872,
      i: 181,
      j: 68,
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

    it('Should parse contact monomer data correctly when csv file has headers.', () => {
      const data = getCouplingScoresData(couplingScoresCsvWithHeaders);
      const expected = new CouplingContainer([firstScore, secondScore]);
      expect(data.allContacts).toEqual(expected.allContacts);
    });

    it('Should allow the residue mapping and coupling score csv to be combined to generate the CouplingContainer.', () => {
      const residueMapping = generateResidueMapping(residueMappingCsv);
      const data = getCouplingScoresData(couplingScoresCsvWithHeaders, residueMapping);
      const expected = new CouplingContainer([firstScorePDB, secondScorePDB]);
      expect(data.allContacts).toEqual(expected.allContacts);
    });

    it('Should allow a previously created coupling score csv to be augmented with a residue mapping csv.', () => {
      const data = getCouplingScoresData(couplingScoresCsvWithHeaders);
      const residueMapping = generateResidueMapping(residueMappingCsv);
      const result = augmentCouplingScoresWithResidueMapping(data, residueMapping);
      const expected = new CouplingContainer([firstScorePDB, secondScorePDB]);
      expect(result.allContacts).toEqual(expected.allContacts);
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

    it('Should parse secondary structure data correctly when the csv file has newline.', () => {
      const data = getSecondaryStructureData(secondaryStructureCsvWithNewline);
      expect(data).toEqual(expectedSecondaryData);
    });

    it('Should load pdb data if available.', async () => {
      const expected = await ChellPDB.createPDB('sample/protein.pdb');
      const response = {
        couplingScores: new CouplingContainer(),
        pdbData: expected,
        secondaryStructures: [],
      };
      fetchMock.mockResponse(stringifyCircularJSON(response));

      const result = (await fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, 'sample')) as IContactMapData;
      expect(stringifyCircularJSON(result.pdbData)).toEqual(stringifyCircularJSON(expected));
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
