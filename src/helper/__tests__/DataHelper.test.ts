// tslint:disable-next-line:no-import-side-effect
import 'jest-fetch-mock';
import { inspect as stringifyCircularJSON } from 'util';

import {
  BioblocksPDB,
  CONTACT_DISTANCE_PROXIMITY,
  CouplingContainer,
  IContactMapData,
  ICouplingScore,
  VIZ_TYPE,
} from '~bioblocks-viz~/data';
import {
  augmentCouplingScoresWithResidueMapping,
  fetchAppropriateData,
  generateResidueMapping,
  getCouplingScoresData,
  getSecondaryStructureData,
} from '~bioblocks-viz~/helper';

describe('DataHelper', () => {
  beforeEach(() => {
    global.fetch.resetMocks();
  });

  it('Should throw an error when attempting to fetch data for an unsupported visualization type.', async () => {
    const badVizType = 'Imagination';
    expect.assertions(1);
    await expect(fetchAppropriateData(badVizType as VIZ_TYPE, '')).rejects.toEqual({
      error: `Currently no appropriate data getter for ${badVizType}`,
    });
  });

  describe('Contact Map', () => {
    const couplingScoresCsv =
      '145,81,0.79312,7.5652,A,A,0.9,2.4,47,1.0,E,R\n\
      179,66,0.78681,3.5872,A,A,0.9,1.3,37,1.0,T,M';
    const secondaryStructureCsv = ',id,sec_struct_3state\n\
      0,30,C\n\
      1,31,C';

    let couplingScoresCsvWithNewline: string;
    let secondaryStructureCsvWithNewline: string;
    beforeEach(() => {
      couplingScoresCsvWithNewline = `${couplingScoresCsv}\n`;
      secondaryStructureCsvWithNewline = `${secondaryStructureCsv}\n`;
    });

    it('Should throw on incorrect location.', async () => {
      const reason = 'Empty path.';
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, '')).rejects.toBe(reason);
    });

    const couplingScoresCsvWithHeaders = `i,j,cn,dist,A_i,A_j,\n
      145,81,0.79312,7.5652,E,R,\n\
      179,66,0.78681,3.5872,T,M,`;

    const residueMappingCsv =
      // tslint:disable-next-line:max-line-length
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
      const expected = await BioblocksPDB.createPDB('sample/protein.pdb');
      const response = {
        couplingScores: new CouplingContainer(),
        pdbData: { known: expected.amendPDBWithCouplingScores([], CONTACT_DISTANCE_PROXIMITY.CLOSEST) },
        secondaryStructures: [],
      };
      fetchMock.mockResponse(stringifyCircularJSON(response));
      fetchMock.mockResponse(residueMappingCsv);

      const result = (await fetchAppropriateData(VIZ_TYPE.CONTACT_MAP, 'sample')) as IContactMapData;
      expect(stringifyCircularJSON(result.pdbData)).toEqual(stringifyCircularJSON({ known: expected }));
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
    it('Should throw on incorrect location.', async () => {
      expect.assertions(1);
      await expect(fetchAppropriateData(VIZ_TYPE.SPRING, '')).rejects.toThrowError();
    });
  });

  describe('T-SNE', () => {
    it('Should return empty data for an incorrect location.', async () => {
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
