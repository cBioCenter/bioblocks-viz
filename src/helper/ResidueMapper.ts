import { AMINO_ACID_1LETTER_CODE } from '~bioblocks-viz~/data';

const UNI_PROT_RESNO_HEADER = 'up_index';
const UNI_PROT_RESNAME_HEADER = 'up_residue';
const PDB_RESNO_HEADER = 'pdb_index';
const PDB_RESNAME_HEADER = 'pdb_residue';

const EV_SERVER_COUPLING_HEADER = 'id';
const EV_SERVER_STRUCTURE_HEADER = 'coord_id';
const EV_SERVER_STRUCTURE_CODE_HEADER = 'one_letter_code';

const EVFOLD_EXPECTED_HEADERS = [UNI_PROT_RESNO_HEADER, UNI_PROT_RESNAME_HEADER, PDB_RESNO_HEADER, PDB_RESNAME_HEADER];
const EVSERVER_EXPECTED_HEADERS = [
  EV_SERVER_COUPLING_HEADER,
  EV_SERVER_STRUCTURE_HEADER,
  EV_SERVER_STRUCTURE_CODE_HEADER,
];

export interface IResidueMapping {
  /** Name of the residue in the PDB file. */
  pdbResCode: AMINO_ACID_1LETTER_CODE;

  /** Number of the residue in the PDB file. */
  pdbResno: number;

  /** Number of the residue from CouplingScores file. */
  couplingsResno: number;

  /** Single letter code of the residue from CouplingScores file. */
  couplingsResCode: AMINO_ACID_1LETTER_CODE;
}

/**
 * Determines the mapping of residues from a UniProt file to a PDB, given a indextableplus file.
 *
 * @description This file is, semantically, a csv with 4 headers:
 *
 * up_index - UniProt residue number.
 *
 * up_residue - UniProt residue name.
 *
 * pdb_index - PDB residue number.
 *
 * pdb_residue - PDB residue name.
 *
 * @param text The contents of a indextableplus file.
 * @returns Array of all residue mappings.
 */
export const generateResidueMapping = (text: string): IResidueMapping[] => {
  const tabOrCommaRegex: RegExp = /\t|,/;
  const headers = text.split('\n')[0].split(tabOrCommaRegex);
  const isEvServer = isEvServerJob(headers);
  const headerMap: {
    [key: string]: number;
  } = getResidueMappingHeaders(headers, isEvServer);

  const couplingsResnoIndex = isEvServer ? headerMap[EV_SERVER_COUPLING_HEADER] : headerMap[UNI_PROT_RESNO_HEADER];
  const structureResnoIndex = isEvServer ? headerMap[EV_SERVER_STRUCTURE_HEADER] : headerMap[PDB_RESNO_HEADER];
  const structureResCodeIndex = isEvServer ? headerMap[EV_SERVER_STRUCTURE_CODE_HEADER] : headerMap[PDB_RESNAME_HEADER];

  return text
    .split('\n')
    .slice(1)
    .reduce((result: IResidueMapping[], line: string) => {
      const splitLine = line.split(tabOrCommaRegex);
      if (splitLine.length >= EVFOLD_EXPECTED_HEADERS.length) {
        result.push({
          couplingsResCode: isEvServer
            ? splitLine[structureResCodeIndex]
            : splitLine[headerMap[UNI_PROT_RESNAME_HEADER]],
          couplingsResno: parseInt(splitLine[couplingsResnoIndex], 10),
          pdbResCode: splitLine[structureResCodeIndex],
          pdbResno: parseInt(splitLine[structureResnoIndex], 10),
        });
      }

      return result;
    }, new Array<IResidueMapping>());
};

const getResidueMappingHeaders = (headers: string[], isEvServer: boolean) => {
  const headerMap: {
    [key: string]: number;
  } = {};

  const expectedHeaders = isEvServer ? EVSERVER_EXPECTED_HEADERS : EVFOLD_EXPECTED_HEADERS;
  if (headers.length >= EVFOLD_EXPECTED_HEADERS.length) {
    expectedHeaders.map(header => {
      if (!headers.includes(header)) {
        throw new Error(`Missing error ${header} in residue mapping file!`);
      }
      headerMap[header] = headers.indexOf(header);
    });
  }

  return headerMap;
};

const isEvServerJob = (headers: string[]) => {
  for (const header of EVSERVER_EXPECTED_HEADERS) {
    if (!headers.includes(header)) {
      return false;
    }
  }

  return true;
};
