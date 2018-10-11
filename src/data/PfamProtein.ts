// tslint:disable:no-reserved-keywords

export enum PFAM_A_TYPE {
  DOMAIN = 'Domain',
  FAMILY = 'Family',
  MOTIF = 'Motif',
  REPEAT = 'Repeat',
}

export enum PFAM_SEARCH_TYPE {
  P_FAM_A_SEARCH = 'pfamASearch',
  P_FAM_B_SEARCH = 'pfamBSearch',
}

export enum PFAM_MODEL_TYPE {
  FS = 'fs',
  LS = 'ls',
}

export enum PFAM_ELEMENT_TYPE {
  P_FAM_A = 'Pfam-A',
  P_FAM_B = 'Pfam-B',
}

export interface IPfamBaseResponse {
  /** A date, formatted as "YYYY-MM-DD" */
  pfamDate: string;

  /** A date and time, formatted as "YYYY-MM-DD HH:MM:SS" */
  pfamDateTime: string;

  pfamAccession: string;

  pfamId: string;

  pfamAType: PFAM_A_TYPE;

  proteinSequence: string;

  uniprotAccession: string;

  clanAccession: string;

  clanId: string;

  md5: string;

  crc64: string;

  jobId: string;

  goId: string;

  searchType: PFAM_SEARCH_TYPE;

  modelType: PFAM_MODEL_TYPE;
}

export interface IPfamElementResponse extends IPfamBaseResponse {
  match: {
    location: IPfamLocation[];
    id: string;
    class?: PFAM_A_TYPE;
    type: PFAM_ELEMENT_TYPE;
  };
}

export interface IPfamLocation {
  all: {
    hmm: string;
    match_string: string;
    pp: string;
    seq: string;
    raw: string;
  };

  start: number;
  end: number;
  ali_start: number;
  ali_end: number;
  hmm_start: number;
  hmm_end: number;

  bitscore?: number;
  evalue?: number;
  evidence?: string;
  significant?: boolean;
}

export interface IPfamProteinResponse extends IPfamElementResponse {
  release: number;
  release_date: string;
}
