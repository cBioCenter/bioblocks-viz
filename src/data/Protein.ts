// ~bb-viz~
// Protein
// Enums and Interfaces for data stored in [EMBL-ebi](https://www.ebi.ac.uk/)
// ~bb-viz~

// cSpell:disable
// tslint:disable:max-line-length no-reserved-keywords

export interface IProteinInfo {
  created: string;
  modified: string;
  type: string;
  version: number;
}

export interface IName {
  type: string;
  value: string;
}

export const enum LINEAGE_TYPES {
  'Catarrhini',
  'Chordata',
  'Craniata',
  'Euarchontoglires',
  'Eukaryota',
  'Euteleostomi',
  'Eutheria',
  'Haplorrhini',
  'Hominidae',
  'Homo',
  'Mammalia',
  'Metazoa',
  'Primates',
  'Vertebrata',
}

export interface IOrganism {
  lineage: Array<keyof typeof LINEAGE_TYPES>;
  names: IName[];
  taxonomy: number;
}

export interface INamePair {
  fullName: ITextValue;
  shortName?: ITextValue[];
}

export interface IProteinName {
  alternativeName: INamePair[];
  recommendedName: INamePair;
}

export interface IGene {
  name: ITextValue;
  synonyms: ITextValue[];
}

export const enum INTERACTION_TYPE {
  'BINARY',
  'SELF',
  'XENO',
}
export interface IInteraction {
  experiments: number;
  gene: string;
  id: string;
  interactionType: keyof typeof INTERACTION_TYPE;
  interactor1: string;
  interactor2: string;
  organismDiffer: boolean;
}

export interface ISource {
  alternativeUrl: string;
  id: string;
  name: string;
  tissue: ITextValue[];
  url: string;
}

export interface IEvidence {
  code: string;
  source: Partial<ISource>;
}

export interface ICommentLocation {
  location: Partial<ILocationDescription>;
}

export const enum DB_REFERENCE_TYPE {
  'Bgee',
  'BioGrid',
  'BioMuta',
  'CCDS',
  'CORUM',
  'CTD',
  'ChiTaRS',
  'CleanEx',
  'ComplexPortal',
  'DIP',
  'DMDM',
  'DNASU',
  'DOI',
  'DisGeNET',
  'DisProt',
  'EMBL',
  'EPD',
  'Ensembl',
  'EuPathDB',
  'EvolutionaryTrace',
  'ExpressionAtlas',
  'GO',
  'Gene3D',
  'GeneCards',
  'GeneID',
  'GeneReviews',
  'GeneTree',
  'GeneWiki',
  'Genevisible',
  'GenomeRNAi',
  'HGNC',
  'HOGENOM',
  'HOVERGEN',
  'HPA',
  'InParanoid',
  'IntAct',
  'InterPro',
  'KEGG',
  'KO',
  'MIM',
  'MINT',
  'MalaCards',
  'MaxQB',
  'OMA',
  'OpenTargets',
  'Orphanet',
  'OrthoDB',
  'PANTHER',
  'PDB',
  'PDBsum',
  'PIR',
  'PRIDE',
  'PRO',
  'PROSITE',
  'PaxDb',
  'PeptideAtlas',
  'Pfam',
  'PharmGKB',
  'PhosphoSitePlus',
  'PhylomeDB',
  'ProteinModelPortal',
  'Proteomes',
  'ProteomicsDB',
  'PubMed',
  'Reactome',
  'RefSeq',
  'SIGNOR',
  'SMART',
  'SMR',
  'STRING',
  'SUPFAM',
  'SignaLink',
  'TreeFam',
  'UCSC',
  'UniGene',
  'eggNOG',
  'iPTMnet',
  'neXtProt',
}

export interface IDbReference {
  evidences: Array<Partial<IEvidence>>;
  id: string;
  properties: Partial<IProperties>;
  type: keyof typeof DB_REFERENCE_TYPE;
}

export interface ILocationDescription {
  value: string;
  evidences: Array<Partial<IEvidence>>;
}

export enum PROTEIN_COMMENT_TYPE {
  'DISEASE',
  'DOMAIN',
  'FUNCTION',
  'INTERACTION',
  'MIM',
  'PTM',
  'SIMILARITY',
  'SUBCELLULAR_LOCATION',
  'SUBUNIT',
  'WEBRESOURCE',
}

export interface IComment {
  type: keyof typeof PROTEIN_COMMENT_TYPE;
  text: any;
  interactions: Array<Partial<IInteraction>>;
  locations: Array<Partial<ICommentLocation>>;
  diseaseId: string;
  acronym: string;
  dbReference: Partial<IDbReference>;
  description: Partial<ILocationDescription>;
  name: string;
  url: string;
}

export const enum FEATURE_TYPES {
  'CHAIN',
  'COMPBIAS',
  'CROSSLNK',
  'DOMAIN',
  'HELIX',
  'METAL',
  'MOD_RES',
  'MUTAGEN',
  'REGION',
  'SITE',
  'STRAND',
  'TURN',
  'VARIANT',
}

export interface IFeature {
  type: keyof typeof FEATURE_TYPES;
  category: string;
  ftId: string;
  description: string;
  begin: string;
  end: string;
  evidences: Array<Partial<IEvidence>>;
  alternativeSequence: string;
}

export const enum DB_REFERENCE_PROPERTY_TYPE {
  'gene',
  'phenotype',
}

export interface IProperties {
  'entry name': string;
  'expression patterns': string;
  'gene ID': string;
  'gene designation': string;
  'match status': string;
  'molecule type': string;
  'nucleotide sequence ID': string;
  'organism name': string;
  'pathway name': string;
  'protein sequence ID': string;
  'taxonomic scope': string;
  Description: string;
  chains: string;
  component: string;
  disease: string;
  entryName: string;
  interactions: string;
  method: string;
  resolution: string;
  source: string;
  status: string;
  term: string;
  type: keyof typeof DB_REFERENCE_PROPERTY_TYPE;
}

export interface ITextValue {
  value: string;
}

export interface IPublication {
  journalName: string;
  submissionDatabase: string;
}

export interface IPublicationLocation {
  firstPage: string;
  lastPage: string;
  volume: string;
}

export const enum CITATION_TYPE {
  'journal article',
  'submission',
}

export interface ICitation {
  authors: string[];
  consortiums: string[];
  dbReferences: Array<Partial<IDbReference>>;
  location: Partial<IPublicationLocation>;
  publication: Partial<IPublication>;
  publicationDate: string;
  title: string;
  type: keyof typeof CITATION_TYPE;
}

export interface IReference {
  citation: Partial<ICitation>;
  scope: string[];
  source: Partial<ISource>;
}

export interface ISequence {
  length: number;
  mass: number;
  modified: string;
  sequence: string;
  version: number;
}

export interface IProtein {
  [key: string]: any;
  accession: string;
  comments: Array<Partial<IComment>>;
  dbReferences: Array<Partial<IDbReference>>;
  features: Array<Partial<IFeature>>;
  gene: Array<Partial<IGene>>;
  id: string;
  info: IProteinInfo;
  keywords: Array<Partial<ITextValue>>;
  organism: Partial<IOrganism>;
  protein: Partial<IProteinName>;
  proteinExistence: string;
  references: Array<Partial<IReference>>;
  secondaryAccession: string[];
  sequence: ISequence;
}
