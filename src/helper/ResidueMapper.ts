import { AMINO_ACID_SINGLE_LETTER_CODE } from '../data/AminoAcid';

const UNI_PROT_RESNO_HEADER = 'up_index';
const UNI_PROT_RESNAME_HEADER = 'up_residue';
const PDB_RESNO_HEADER = 'pdb_index';
const PDB_RESNAME_HEADER = 'pdb_residue';

const EXPECTED_HEADERS = [UNI_PROT_RESNO_HEADER, UNI_PROT_RESNAME_HEADER, PDB_RESNO_HEADER, PDB_RESNAME_HEADER];

export interface IResidueMapping {
  /** Name of the residue in the PDB file. */
  pdbResCode: AMINO_ACID_SINGLE_LETTER_CODE;

  /** Number of the residue in the PDB file. */
  pdbResno: number;

  /** Name of the residue from UniProt. */
  uniProtResCode: AMINO_ACID_SINGLE_LETTER_CODE;

  /** Number of the residue from UniProt. */
  uniProtResno: number;
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
  const headers = text.split('\n')[0].split('\t');
  const headerMap: {
    [key: string]: number;
  } = getResidueMappingHeaders(headers);
  return text
    .split('\n')
    .slice(1)
    .reduce((result: IResidueMapping[], line: string) => {
      const splitLine = line.split('\t');
      if (splitLine.length >= EXPECTED_HEADERS.length) {
        result.push({
          pdbResCode: splitLine[headerMap[PDB_RESNAME_HEADER]] as AMINO_ACID_SINGLE_LETTER_CODE,
          pdbResno: parseInt(splitLine[headerMap[PDB_RESNO_HEADER]], 10),
          uniProtResCode: splitLine[headerMap[UNI_PROT_RESNAME_HEADER]] as AMINO_ACID_SINGLE_LETTER_CODE,
          uniProtResno: parseInt(splitLine[headerMap[UNI_PROT_RESNO_HEADER]], 10),
        });
      }
      return result;
    }, new Array<IResidueMapping>());
};

const getResidueMappingHeaders = (headers: string[]) => {
  const headerMap: {
    [key: string]: number;
  } = {};
  if (headers.length >= EXPECTED_HEADERS.length) {
    EXPECTED_HEADERS.map(header => {
      if (!headers.includes(header)) {
        throw new Error(`Missing error ${header} in indextableplus file!`);
      }
      headerMap[header] = headers.indexOf(header);
    });
  }
  return headerMap;
};
