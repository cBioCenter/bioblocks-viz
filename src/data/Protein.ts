/* cSpell:disable */

export interface Info {
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
  info: Info;
  keywords: Array<Partial<ITextValue>>;
  organism: Partial<IOrganism>;
  protein: Partial<IProteinName>;
  proteinExistence: string;
  references: Array<Partial<IReference>>;
  secondaryAccession: string[];
  sequence: ISequence;
}

// tslint:disable:object-literal-sort-keys
export const exampleProteinResponse: IProtein = {
  accession: 'Q13485',
  id: 'SMAD4_HUMAN',
  proteinExistence: 'Evidence at protein level',
  info: {
    type: 'Swiss-Prot',
    created: '2001-05-04',
    modified: '2018-09-12',
    version: 212,
  },
  organism: {
    taxonomy: 9606,
    names: [
      {
        type: 'scientific',
        value: 'Homo sapiens',
      },
      {
        type: 'common',
        value: 'Human',
      },
    ],
    lineage: [
      'Eukaryota',
      'Metazoa',
      'Chordata',
      'Craniata',
      'Vertebrata',
      'Euteleostomi',
      'Mammalia',
      'Eutheria',
      'Euarchontoglires',
      'Primates',
      'Haplorrhini',
      'Catarrhini',
      'Hominidae',
      'Homo',
    ],
  },
  secondaryAccession: ['A8K405'],
  protein: {
    recommendedName: {
      fullName: {
        value: 'Mothers against decapentaplegic homolog 4',
      },
      shortName: [
        {
          value: 'MAD homolog 4',
        },
        {
          value: 'Mothers against DPP homolog 4',
        },
      ],
    },
    alternativeName: [
      {
        fullName: {
          value: 'Deletion target in pancreatic carcinoma 4',
        },
      },
      {
        fullName: {
          value: 'SMAD family member 4',
        },
        shortName: [
          {
            value: 'SMAD 4',
          },
          {
            value: 'Smad4',
          },
          {
            value: 'hSMAD4',
          },
        ],
      },
    ],
  },
  gene: [
    {
      name: {
        value: 'SMAD4',
      },
      synonyms: [
        {
          value: 'DPC4',
        },
        {
          value: 'MADH4',
        },
      ],
    },
  ],
  comments: [
    {
      type: 'FUNCTION',
      text: [
        {
          value:
            "In muscle physiology, plays a central role in the balance between atrophy and hypertrophy. When recruited by MSTN, promotes atrophy response via phosphorylated SMAD2/4. MSTN decrease causes SMAD4 release and subsequent recruitment by the BMP pathway to promote hypertrophy via phosphorylated SMAD1/5/8. Acts synergistically with SMAD1 and YY1 in bone morphogenetic protein (BMP)-mediated cardiac-specific gene expression. Binds to SMAD binding elements (SBEs) (5'-GTCT/AGAC-3') within BMP response element (BMPRE) of cardiac activating regions (By similarity). Common SMAD (co-SMAD) is the coactivator and mediator of signal transduction by TGF-beta (transforming growth factor). Component of the heterotrimeric SMAD2/SMAD3-SMAD4 complex that forms in the nucleus and is required for the TGF-mediated signaling. Promotes binding of the SMAD2/SMAD4/FAST-1 complex to DNA and provides an activation function required for SMAD1 or SMAD2 to stimulate transcription. Component of the multimeric SMAD3/SMAD4/JUN/FOS complex which forms at the AP1 promoter site; required for synergistic transcriptional activity in response to TGF-beta. May act as a tumor suppressor. Positively regulates PDPK1 kinase activity by stimulating its dissociation from the 14-3-3 protein YWHAQ which acts as a negative regulator",
          evidences: [
            {
              code: 'ECO:0000250',
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '17327236',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/17327236',
                alternativeUrl: 'https://europepmc.org/abstract/MED/17327236',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '9389648',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/9389648',
                alternativeUrl: 'https://europepmc.org/abstract/MED/9389648',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'SUBUNIT',
      text: [
        {
          value:
            'Found in a complex with SMAD1 and YY1 (By similarity). Interacts with CITED2 (By similarity). Monomer; in the absence of TGF-beta activation. Heterodimer; on TGF-beta activation. Composed of two molecules of a C-terminally phosphorylated R-SMAD molecule, SMAD2 or SMAD3, and one molecule of SMAD4 to form the transcriptional active SMAD2/SMAD3-SMAD4 complex. Found in a ternary complex composed of SMAD4, STK11/LKB1 and STK11IP. Interacts with ATF2, COPS5, DACH1, MSG1, SKI, STK11/LKB1, STK11IP and TRIM33. Interacts with ZNF423; the interaction takes place in response to BMP2 leading to activation of transcription of BMP target genes. Interacts with ZNF521; the interaction takes place in response to BMP2 leading to activation of transcription of BMP target genes. Interacts with USP9X. Interacts (via the MH1 and MH2 domains) with RBPMS. Interacts with WWTR1 (via coiled-coil domain). Component of the multimeric complex SMAD3/SMAD4/JUN/FOS which forms at the AP1 promoter site; required for synergistic transcriptional activity in response to TGF-beta. Interacts with CITED1. Interacts with PDPK1 (via PH domain) (By similarity). Interacts with VPS39; this interaction affects heterodimer formation with SMAD3, but not with SMAD2, and leads to inhibition of SMAD3-dependent transcription activation. Interactions with VPS39 and SMAD2 may be mutually exclusive. Interacts with ZC3H3 (By similarity). Interacts (via MH2 domain) with ZNF451 (via N-terminal zinc-finger domains) (PubMed:24324267). Identified in a complex that contains at least ZNF451, SMAD2, SMAD3 and SMAD4 (PubMed:24324267). Interacts weakly with ZNF8 (PubMed:12370310). Interacts with NUP93 and IPO7; translocates SMAD4 to the nucleus through the NPC upon BMP7 stimulation resulting in activation of SMAD4 signaling (PubMed:26878725). Interacts with CREB3L1, the interaction takes place upon TGFB1 induction and SMAD4 acts as CREB3L1 coactivator to induce the expression of genes involved in the assembly of collagen extracellular matrix (PubMed:25310401). Interacts with DLX1 (PubMed:14671321)',
          evidences: [
            {
              code: 'ECO:0000250',
              source: {
                name: 'UniProtKB',
                id: 'O70437',
                url: 'https://www.uniprot.org/uniprot/O70437',
              },
            },
            {
              code: 'ECO:0000250',
              source: {
                name: 'UniProtKB',
                id: 'P97471',
                url: 'https://www.uniprot.org/uniprot/P97471',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '10660046',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/10660046',
                alternativeUrl: 'https://europepmc.org/abstract/MED/10660046',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '11224571',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/11224571',
                alternativeUrl: 'https://europepmc.org/abstract/MED/11224571',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '11741830',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/11741830',
                alternativeUrl: 'https://europepmc.org/abstract/MED/11741830',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '11818334',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/11818334',
                alternativeUrl: 'https://europepmc.org/abstract/MED/11818334',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '12370310',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/12370310',
                alternativeUrl: 'https://europepmc.org/abstract/MED/12370310',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '12941698',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/12941698',
                alternativeUrl: 'https://europepmc.org/abstract/MED/12941698',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '14525983',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/14525983',
                alternativeUrl: 'https://europepmc.org/abstract/MED/14525983',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '14630787',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/14630787',
                alternativeUrl: 'https://europepmc.org/abstract/MED/14630787',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '14671321',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/14671321',
                alternativeUrl: 'https://europepmc.org/abstract/MED/14671321',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '15350224',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/15350224',
                alternativeUrl: 'https://europepmc.org/abstract/MED/15350224',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '15799969',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/15799969',
                alternativeUrl: 'https://europepmc.org/abstract/MED/15799969',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '15820681',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/15820681',
                alternativeUrl: 'https://europepmc.org/abstract/MED/15820681',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '17099224',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/17099224',
                alternativeUrl: 'https://europepmc.org/abstract/MED/17099224',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '17327236',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/17327236',
                alternativeUrl: 'https://europepmc.org/abstract/MED/17327236',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '18568018',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/18568018',
                alternativeUrl: 'https://europepmc.org/abstract/MED/18568018',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '19135894',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/19135894',
                alternativeUrl: 'https://europepmc.org/abstract/MED/19135894',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '24324267',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/24324267',
                alternativeUrl: 'https://europepmc.org/abstract/MED/24324267',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '25310401',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/25310401',
                alternativeUrl: 'https://europepmc.org/abstract/MED/25310401',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '26878725',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/26878725',
                alternativeUrl: 'https://europepmc.org/abstract/MED/26878725',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '9670020',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/9670020',
                alternativeUrl: 'https://europepmc.org/abstract/MED/9670020',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '9707553',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/9707553',
                alternativeUrl: 'https://europepmc.org/abstract/MED/9707553',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'INTERACTION',
      interactions: [
        {
          interactionType: 'SELF',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-347263',
          organismDiffer: false,
          experiments: 3,
        },
        {
          interactionType: 'BINARY',
          id: 'P31749',
          gene: 'AKT1',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-296087',
          organismDiffer: false,
          experiments: 2,
        },
        {
          interactionType: 'BINARY',
          id: 'Q9UI36',
          gene: 'DACH1',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-347111',
          organismDiffer: false,
          experiments: 3,
        },
        {
          interactionType: 'BINARY',
          id: 'Q9NPI6',
          gene: 'DCP1A',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-374238',
          organismDiffer: false,
          experiments: 4,
        },
        {
          interactionType: 'BINARY',
          id: 'Q92988',
          gene: 'DLX4',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-1752755',
          organismDiffer: false,
          experiments: 5,
        },
        {
          interactionType: 'XENO',
          id: 'P70056',
          gene: 'foxh1',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-9969973',
          organismDiffer: true,
          experiments: 2,
        },
        {
          interactionType: 'BINARY',
          id: 'O43524',
          gene: 'FOXO3',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-1644164',
          organismDiffer: false,
          experiments: 9,
        },
        {
          interactionType: 'BINARY',
          id: 'P98177',
          gene: 'FOXO4',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-4481939',
          organismDiffer: false,
          experiments: 2,
        },
        {
          interactionType: 'BINARY',
          id: 'P23769',
          gene: 'GATA2',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-2806671',
          organismDiffer: false,
          experiments: 2,
        },
        {
          interactionType: 'BINARY',
          id: 'P61968',
          gene: 'LMO4',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-2798728',
          organismDiffer: false,
          experiments: 5,
        },
        {
          interactionType: 'BINARY',
          id: 'Q9UBE8',
          gene: 'NLK',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-366978',
          organismDiffer: false,
          experiments: 6,
        },
        {
          interactionType: 'BINARY',
          id: 'P24468',
          gene: 'NR2F2',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-2795198',
          organismDiffer: false,
          experiments: 4,
        },
        {
          interactionType: 'BINARY',
          id: 'Q8WWW0',
          gene: 'RASSF5',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-367390',
          organismDiffer: false,
          experiments: 3,
        },
        {
          interactionType: 'BINARY',
          id: 'P12755',
          gene: 'SKI',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-347281',
          organismDiffer: false,
          experiments: 13,
        },
        {
          interactionType: 'BINARY',
          id: 'P12757',
          gene: 'SKIL',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-2902468',
          organismDiffer: false,
          experiments: 3,
        },
        {
          interactionType: 'BINARY',
          id: 'Q15797',
          gene: 'SMAD1',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-1567153',
          organismDiffer: false,
          experiments: 9,
        },
        {
          interactionType: 'BINARY',
          id: 'Q15796',
          gene: 'SMAD2',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-1040141',
          organismDiffer: false,
          experiments: 20,
        },
        {
          interactionType: 'BINARY',
          id: 'P84022',
          gene: 'SMAD3',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-347161',
          organismDiffer: false,
          experiments: 24,
        },
        {
          interactionType: 'BINARY',
          id: 'P08047',
          gene: 'SP1',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-298336',
          organismDiffer: false,
          experiments: 2,
        },
        {
          interactionType: 'BINARY',
          id: 'Q9UPN9',
          gene: 'TRIM33',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-2214398',
          organismDiffer: false,
          experiments: 6,
        },
        {
          interactionType: 'BINARY',
          id: 'P63279',
          gene: 'UBE2I',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-80168',
          organismDiffer: false,
          experiments: 4,
        },
        {
          interactionType: 'BINARY',
          id: 'Q93008',
          gene: 'USP9X',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-302524',
          organismDiffer: false,
          experiments: 2,
        },
        {
          interactionType: 'XENO',
          id: 'P70398',
          gene: 'Usp9x',
          interactor1: 'EBI-347263',
          interactor2: 'EBI-2214043',
          organismDiffer: true,
          experiments: 4,
        },
      ],
    },
    {
      type: 'SUBCELLULAR_LOCATION',
      locations: [
        {
          location: {
            value: 'Cytoplasm',
            evidences: [
              {
                code: 'ECO:0000269',
                source: {
                  name: 'PubMed',
                  id: '15799969',
                  url: 'http://www.ncbi.nlm.nih.gov/pubmed/15799969',
                  alternativeUrl: 'https://europepmc.org/abstract/MED/15799969',
                },
              },
              {
                code: 'ECO:0000269',
                source: {
                  name: 'PubMed',
                  id: '17327236',
                  url: 'http://www.ncbi.nlm.nih.gov/pubmed/17327236',
                  alternativeUrl: 'https://europepmc.org/abstract/MED/17327236',
                },
              },
            ],
          },
        },
        {
          location: {
            value: 'Nucleus',
            evidences: [
              {
                code: 'ECO:0000269',
                source: {
                  name: 'PubMed',
                  id: '15799969',
                  url: 'http://www.ncbi.nlm.nih.gov/pubmed/15799969',
                  alternativeUrl: 'https://europepmc.org/abstract/MED/15799969',
                },
              },
            ],
          },
        },
      ],
      text: [
        {
          value:
            'Cytoplasmic in the absence of ligand. Migrates to the nucleus when complexed with R-SMAD (PubMed:15799969). PDPK1 prevents its nuclear translocation in response to TGF-beta (PubMed:17327236)',
          evidences: [
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '15799969',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/15799969',
                alternativeUrl: 'https://europepmc.org/abstract/MED/15799969',
              },
            },
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '17327236',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/17327236',
                alternativeUrl: 'https://europepmc.org/abstract/MED/17327236',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'DOMAIN',
      text: [
        {
          value: 'The MH1 domain is required for DNA binding',
        },
      ],
    },
    {
      type: 'DOMAIN',
      text: [
        {
          value:
            'The MH2 domain is required for both homomeric and heteromeric interactions and for transcriptional regulation. Sufficient for nuclear import',
        },
      ],
    },
    {
      type: 'PTM',
      text: [
        {
          value: 'Phosphorylated by PDPK1',
          evidences: [
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '17327236',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/17327236',
                alternativeUrl: 'https://europepmc.org/abstract/MED/17327236',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'PTM',
      text: [
        {
          value:
            'Monoubiquitinated on Lys-519 by E3 ubiquitin-protein ligase TRIM33. Monoubiquitination hampers its ability to form a stable complex with activated SMAD2/3 resulting in inhibition of TGF-beta/BMP signaling cascade. Deubiquitination by USP9X restores its competence to mediate TGF-beta signaling',
          evidences: [
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '19135894',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/19135894',
                alternativeUrl: 'https://europepmc.org/abstract/MED/19135894',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'DISEASE',
      diseaseId: 'Pancreatic cancer',
      acronym: 'PNCA',
      dbReference: {
        type: 'MIM',
        id: '260350',
      },
      description: {
        value:
          'A malignant neoplasm of the pancreas. Tumors can arise from both the exocrine and endocrine portions of the pancreas, but 95% of them develop from the exocrine portion, including the ductal epithelium, acinar cells, connective tissue, and lymphatic tissue.',
        evidences: [
          {
            code: 'ECO:0000269',
            source: {
              name: 'PubMed',
              id: '8553070',
              url: 'http://www.ncbi.nlm.nih.gov/pubmed/8553070',
              alternativeUrl: 'https://europepmc.org/abstract/MED/8553070',
            },
          },
        ],
      },
      text: [
        {
          value: 'The gene represented in this entry may be involved in disease pathogenesis',
        },
      ],
    },
    {
      type: 'DISEASE',
      diseaseId: 'Juvenile polyposis syndrome',
      acronym: 'JPS',
      dbReference: {
        type: 'MIM',
        id: '174900',
      },
      description: {
        value:
          'Autosomal dominant gastrointestinal hamartomatous polyposis syndrome in which patients are at risk for developing gastrointestinal cancers. The lesions are typified by a smooth histological appearance, predominant stroma, cystic spaces and lack of a smooth muscle core. Multiple juvenile polyps usually occur in a number of Mendelian disorders. Sometimes, these polyps occur without associated features as in JPS; here, polyps tend to occur in the large bowel and are associated with an increased risk of colon and other gastrointestinal cancers.',
        evidences: [
          {
            code: 'ECO:0000269',
            source: {
              name: 'PubMed',
              id: '12417513',
              url: 'http://www.ncbi.nlm.nih.gov/pubmed/12417513',
              alternativeUrl: 'https://europepmc.org/abstract/MED/12417513',
            },
          },
          {
            code: 'ECO:0000269',
            source: {
              name: 'PubMed',
              id: '9811934',
              url: 'http://www.ncbi.nlm.nih.gov/pubmed/9811934',
              alternativeUrl: 'https://europepmc.org/abstract/MED/9811934',
            },
          },
        ],
      },
      text: [
        {
          value: 'The disease is caused by mutations affecting the gene represented in this entry',
        },
      ],
    },
    {
      type: 'DISEASE',
      diseaseId: 'Juvenile polyposis/hereditary hemorrhagic telangiectasia syndrome',
      acronym: 'JP/HHT',
      dbReference: {
        type: 'MIM',
        id: '175050',
      },
      description: {
        value:
          'JP/HHT syndrome phenotype consists of the coexistence of juvenile polyposis (JIP) and hereditary hemorrhagic telangiectasia (HHT) [MIM:187300] in a single individual. JIP and HHT are autosomal dominant disorders with distinct and non-overlapping clinical features. The former, an inherited gastrointestinal malignancy predisposition, is caused by mutations in SMAD4 or BMPR1A, and the latter is a vascular malformation disorder caused by mutations in ENG or ACVRL1. All four genes encode proteins involved in the transforming-growth-factor-signaling pathway. Although there are reports of patients and families with phenotypes of both disorders combined, the genetic etiology of this association is unknown.',
        evidences: [
          {
            code: 'ECO:0000269',
            source: {
              name: 'PubMed',
              id: '15031030',
              url: 'http://www.ncbi.nlm.nih.gov/pubmed/15031030',
              alternativeUrl: 'https://europepmc.org/abstract/MED/15031030',
            },
          },
        ],
      },
      text: [
        {
          value: 'The disease is caused by mutations affecting the gene represented in this entry',
        },
      ],
    },
    {
      type: 'DISEASE',
      diseaseId: 'Colorectal cancer',
      acronym: 'CRC',
      dbReference: {
        type: 'MIM',
        id: '114500',
      },
      description: {
        value:
          'A complex disease characterized by malignant lesions arising from the inner wall of the large intestine (the colon) and the rectum. Genetic alterations are often associated with progression from premalignant lesion (adenoma) to invasive adenocarcinoma. Risk factors for cancer of the colon and rectum include colon polyps, long-standing ulcerative colitis, and genetic family history.',
        evidences: [
          {
            code: 'ECO:0000269',
            source: {
              name: 'PubMed',
              id: '16959974',
              url: 'http://www.ncbi.nlm.nih.gov/pubmed/16959974',
              alternativeUrl: 'https://europepmc.org/abstract/MED/16959974',
            },
          },
        ],
      },
      text: [
        {
          value: 'The disease may be caused by mutations affecting the gene represented in this entry',
        },
      ],
    },
    {
      type: 'DISEASE',
      text: [
        {
          value:
            'SMAD4 variants may be associated with susceptibility to pulmonary hypertension, a disorder characterized by plexiform lesions of proliferating endothelial cells in pulmonary arterioles. The lesions lead to elevated pulmonary arterial pression, right ventricular failure, and death. The disease can occur from infancy throughout life and it has a mean age at onset of 36 years. Penetrance is reduced. Although familial pulmonary hypertension is rare, cases secondary to known etiologies are more common and include those associated with the appetite-suppressant drugs',
          evidences: [
            {
              code: 'ECO:0000269',
              source: {
                name: 'PubMed',
                id: '21898662',
                url: 'http://www.ncbi.nlm.nih.gov/pubmed/21898662',
                alternativeUrl: 'https://europepmc.org/abstract/MED/21898662',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'DISEASE',
      diseaseId: 'Myhre syndrome',
      acronym: 'MYHRS',
      dbReference: {
        type: 'MIM',
        id: '139210',
      },
      description: {
        value:
          'A syndrome characterized by pre- and postnatal growth deficiency, mental retardation, generalized muscle hypertrophy and striking muscular build, decreased joint mobility, cryptorchidism, and unusual facies. Dysmorphic facial features include microcephaly, midface hypoplasia, prognathism, and blepharophimosis. Typical skeletal anomalies are short stature, square body shape, broad ribs, iliac hypoplasia, brachydactyly, flattened vertebrae, and thickened calvaria. Other features, such as congenital heart disease, may also occur.',
        evidences: [
          {
            code: 'ECO:0000269',
            source: {
              name: 'PubMed',
              id: '22158539',
              url: 'http://www.ncbi.nlm.nih.gov/pubmed/22158539',
              alternativeUrl: 'https://europepmc.org/abstract/MED/22158539',
            },
          },
          {
            code: 'ECO:0000269',
            source: {
              name: 'PubMed',
              id: '22243968',
              url: 'http://www.ncbi.nlm.nih.gov/pubmed/22243968',
              alternativeUrl: 'https://europepmc.org/abstract/MED/22243968',
            },
          },
        ],
      },
      text: [
        {
          value: 'The disease is caused by mutations affecting the gene represented in this entry',
        },
      ],
    },
    {
      type: 'SIMILARITY',
      text: [
        {
          value: 'Belongs to the dwarfin/SMAD family',
          evidences: [
            {
              code: 'ECO:0000305',
            },
          ],
        },
      ],
    },
    {
      type: 'WEBRESOURCE',
      name: 'Atlas of Genetics and Cytogenetics in Oncology and Haematology',
      url: 'http://atlasgeneticsoncology.org/Genes/SMAD4ID371.html',
    },
    {
      type: 'WEBRESOURCE',
      name: 'Mendelian genes SMAD family member 4 (SMAD4)',
      url: 'http://www.lovd.nl/SMAD4',
      text: 'Leiden Open Variation Database (LOVD)',
    },
  ],
  features: [
    {
      type: 'CHAIN',
      category: 'MOLECULE_PROCESSING',
      ftId: 'PRO_0000090861',
      description: 'Mothers against decapentaplegic homolog 4',
      begin: '1',
      end: '552',
    },
    {
      type: 'DOMAIN',
      category: 'DOMAINS_AND_SITES',
      description: 'MH1',
      begin: '18',
      end: '142',
      evidences: [
        {
          code: 'ECO:0000255',
          source: {
            name: 'PROSITE-ProRule',
            id: 'PRU00438',
            url: 'https://prosite.expasy.org/unirule/PRU00438',
          },
        },
      ],
    },
    {
      type: 'DOMAIN',
      category: 'DOMAINS_AND_SITES',
      description: 'MH2',
      begin: '323',
      end: '552',
      evidences: [
        {
          code: 'ECO:0000255',
          source: {
            name: 'PROSITE-ProRule',
            id: 'PRU00439',
            url: 'https://prosite.expasy.org/unirule/PRU00439',
          },
        },
      ],
    },
    {
      type: 'REGION',
      category: 'DOMAINS_AND_SITES',
      description: 'SAD',
      begin: '275',
      end: '320',
    },
    {
      type: 'COMPBIAS',
      category: 'SEQUENCE_INFORMATION',
      description: 'Poly-Ala',
      begin: '451',
      end: '466',
    },
    {
      type: 'METAL',
      category: 'DOMAINS_AND_SITES',
      description: 'Zinc',
      begin: '71',
      end: '71',
      evidences: [
        {
          code: 'ECO:0000250',
        },
      ],
    },
    {
      type: 'METAL',
      category: 'DOMAINS_AND_SITES',
      description: 'Zinc',
      begin: '115',
      end: '115',
      evidences: [
        {
          code: 'ECO:0000250',
        },
      ],
    },
    {
      type: 'METAL',
      category: 'DOMAINS_AND_SITES',
      description: 'Zinc',
      begin: '127',
      end: '127',
      evidences: [
        {
          code: 'ECO:0000250',
        },
      ],
    },
    {
      type: 'METAL',
      category: 'DOMAINS_AND_SITES',
      description: 'Zinc',
      begin: '132',
      end: '132',
      evidences: [
        {
          code: 'ECO:0000250',
        },
      ],
    },
    {
      type: 'SITE',
      category: 'DOMAINS_AND_SITES',
      description: 'Necessary for heterotrimerization',
      begin: '515',
      end: '515',
    },
    {
      type: 'MOD_RES',
      category: 'PTM',
      description: 'N6-acetyllysine',
      begin: '37',
      end: '37',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PubMed',
            id: '19608861',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/19608861',
            alternativeUrl: 'https://europepmc.org/abstract/MED/19608861',
          },
        },
      ],
    },
    {
      type: 'MOD_RES',
      category: 'PTM',
      description: 'N6-acetyllysine',
      begin: '428',
      end: '428',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PubMed',
            id: '19608861',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/19608861',
            alternativeUrl: 'https://europepmc.org/abstract/MED/19608861',
          },
        },
      ],
    },
    {
      type: 'MOD_RES',
      category: 'PTM',
      description: 'N6-acetyllysine',
      begin: '507',
      end: '507',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PubMed',
            id: '19608861',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/19608861',
            alternativeUrl: 'https://europepmc.org/abstract/MED/19608861',
          },
        },
      ],
    },
    {
      type: 'CROSSLNK',
      category: 'PTM',
      description: 'Glycyl lysine isopeptide (Lys-Gly) (interchain with G-Cter in SUMO2)',
      begin: '113',
      end: '113',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PubMed',
            id: '25218447',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/25218447',
            alternativeUrl: 'https://europepmc.org/abstract/MED/25218447',
          },
        },
        {
          code: 'ECO:0000244',
          source: {
            name: 'PubMed',
            id: '25755297',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/25755297',
            alternativeUrl: 'https://europepmc.org/abstract/MED/25755297',
          },
        },
        {
          code: 'ECO:0000244',
          source: {
            name: 'PubMed',
            id: '28112733',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/28112733',
            alternativeUrl: 'https://europepmc.org/abstract/MED/28112733',
          },
        },
      ],
    },
    {
      type: 'CROSSLNK',
      category: 'PTM',
      description: 'Glycyl lysine isopeptide (Lys-Gly) (interchain with G-Cter in ubiquitin)',
      begin: '519',
      end: '519',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '19135894',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/19135894',
            alternativeUrl: 'https://europepmc.org/abstract/MED/19135894',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_066870',
      description:
        'rare variant; found in a patient with pulmonary hypertension; unknown pathological significance; dbSNP:rs281875323',
      alternativeSequence: 'S',
      begin: '13',
      end: '13',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '21898662',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/21898662',
            alternativeUrl: 'https://europepmc.org/abstract/MED/21898662',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_036475',
      description: 'in a colorectal cancer sample; somatic mutation',
      alternativeSequence: 'S',
      begin: '130',
      end: '130',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '16959974',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/16959974',
            alternativeUrl: 'https://europepmc.org/abstract/MED/16959974',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_022833',
      description: 'in JPS; dbSNP:rs281875324',
      alternativeSequence: 'G',
      begin: '330',
      end: '330',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '12417513',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/12417513',
            alternativeUrl: 'https://europepmc.org/abstract/MED/12417513',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_036476',
      description: 'in a colorectal cancer sample; somatic mutation',
      alternativeSequence: 'N',
      begin: '351',
      end: '351',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '16959974',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/16959974',
            alternativeUrl: 'https://europepmc.org/abstract/MED/16959974',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_019571',
      description: 'in JP/HHT and JPS; dbSNP:rs121912581',
      alternativeSequence: 'R',
      begin: '352',
      end: '352',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '12417513',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/12417513',
            alternativeUrl: 'https://europepmc.org/abstract/MED/12417513',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '15031030',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/15031030',
            alternativeUrl: 'https://europepmc.org/abstract/MED/15031030',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_019572',
      description: 'in JPS; dbSNP:rs80338963',
      alternativeSequence: 'C',
      begin: '361',
      end: '361',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9811934',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9811934',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9811934',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_036477',
      description: 'in a colorectal cancer sample; somatic mutation; dbSNP:rs377767347',
      alternativeSequence: 'H',
      begin: '361',
      end: '361',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '16959974',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/16959974',
            alternativeUrl: 'https://europepmc.org/abstract/MED/16959974',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_019573',
      description: 'in JP/HHT; dbSNP:rs121912580',
      alternativeSequence: 'D',
      begin: '386',
      end: '386',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '15031030',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/15031030',
            alternativeUrl: 'https://europepmc.org/abstract/MED/15031030',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_011380',
      description: 'in pancreatic carcinoma; dbSNP:rs121912578',
      alternativeSequence: 'H',
      begin: '493',
      end: '493',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '8553070',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/8553070',
            alternativeUrl: 'https://europepmc.org/abstract/MED/8553070',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_067602',
      description: 'in MYHRS; dbSNP:rs281875320',
      alternativeSequence: 'M',
      begin: '500',
      end: '500',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '22158539',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/22158539',
            alternativeUrl: 'https://europepmc.org/abstract/MED/22158539',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_067603',
      description:
        'in MYHRS; there is an enhanced levels of SMAD4 protein with lower levels of ubiquitinated SMAD4 fibroblasts compared to controls suggesting stabilization of the mutant protein; 8-fold increase in phosphorylated SMAD2 and SMAD3; 11-fold increase in phosphorylated SMAD1, SMAD5 and SMAD8 in cell nuclei compared to controls; dbSNP:rs281875321',
      alternativeSequence: 'T',
      begin: '500',
      end: '500',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '22158539',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/22158539',
            alternativeUrl: 'https://europepmc.org/abstract/MED/22158539',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '22243968',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/22243968',
            alternativeUrl: 'https://europepmc.org/abstract/MED/22243968',
          },
        },
      ],
    },
    {
      type: 'VARIANT',
      category: 'VARIANTS',
      ftId: 'VAR_067604',
      description: 'in MYHRS; dbSNP:rs281875322',
      alternativeSequence: 'V',
      begin: '500',
      end: '500',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '22158539',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/22158539',
            alternativeUrl: 'https://europepmc.org/abstract/MED/22158539',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '22243968',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/22243968',
            alternativeUrl: 'https://europepmc.org/abstract/MED/22243968',
          },
        },
      ],
    },
    {
      type: 'MUTAGEN',
      category: 'MUTAGENESIS',
      description: 'No effect on heterotrimerization. Partially diminished transcriptional activation',
      alternativeSequence: 'S',
      begin: '416',
      end: '416',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '11224571',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/11224571',
            alternativeUrl: 'https://europepmc.org/abstract/MED/11224571',
          },
        },
      ],
    },
    {
      type: 'MUTAGEN',
      category: 'MUTAGENESIS',
      description: 'No effect on heterotrimerization. Partially diminished transcriptional activation',
      alternativeSequence: 'S',
      begin: '496',
      end: '496',
    },
    {
      type: 'MUTAGEN',
      category: 'MUTAGENESIS',
      description: 'No effect on heterotrimerization. Greatly reduced transcriptional activation',
      alternativeSequence: 'S',
      begin: '502',
      end: '502',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '11224571',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/11224571',
            alternativeUrl: 'https://europepmc.org/abstract/MED/11224571',
          },
        },
      ],
    },
    {
      type: 'MUTAGEN',
      category: 'MUTAGENESIS',
      description: 'Reduced heterotrimerization',
      alternativeSequence: 'S',
      begin: '515',
      end: '515',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '11224571',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/11224571',
            alternativeUrl: 'https://europepmc.org/abstract/MED/11224571',
          },
        },
      ],
    },
    {
      type: 'MUTAGEN',
      category: 'MUTAGENESIS',
      description: 'Abolishes ubiquitination',
      alternativeSequence: 'R',
      begin: '519',
      end: '519',
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '19135894',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/19135894',
            alternativeUrl: 'https://europepmc.org/abstract/MED/19135894',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '16',
      end: '24',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '29',
      end: '31',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '33',
      end: '47',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '51',
      end: '62',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'TURN',
      category: 'STRUCTURAL',
      begin: '63',
      end: '65',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '73',
      end: '75',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '78',
      end: '80',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '82',
      end: '84',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '87',
      end: '89',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '91',
      end: '99',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '109',
      end: '111',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '119',
      end: '121',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '124',
      end: '127',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '130',
      end: '132',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '133',
      end: '135',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5MEY',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5MEY',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '143',
      end: '145',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '5UWU',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/5UWU',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '288',
      end: '291',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1DD1',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1DD1',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '321',
      end: '330',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '333',
      end: '342',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '346',
      end: '353',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '359',
      end: '363',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '364',
      end: '366',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1U7F',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1U7F',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '374',
      end: '380',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'TURN',
      category: 'STRUCTURAL',
      begin: '381',
      end: '385',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '387',
      end: '392',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'TURN',
      category: 'STRUCTURAL',
      begin: '393',
      end: '395',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '396',
      end: '401',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '403',
      end: '405',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '407',
      end: '410',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '412',
      end: '416',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'TURN',
      category: 'STRUCTURAL',
      begin: '417',
      end: '419',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '427',
      end: '429',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '434',
      end: '438',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '440',
      end: '454',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'TURN',
      category: 'STRUCTURAL',
      begin: '455',
      end: '458',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1DD1',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1DD1',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '461',
      end: '464',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1DD1',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1DD1',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '493',
      end: '497',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '500',
      end: '506',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '518',
      end: '520',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'STRAND',
      category: 'STRUCTURAL',
      begin: '521',
      end: '529',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
    {
      type: 'HELIX',
      category: 'STRUCTURAL',
      begin: '530',
      end: '541',
      evidences: [
        {
          code: 'ECO:0000244',
          source: {
            name: 'PDB',
            id: '1YGS',
            url: 'https://www.ebi.ac.uk/pdbe-srv/view/entry/1YGS',
          },
        },
      ],
    },
  ],
  dbReferences: [
    {
      type: 'EMBL',
      id: 'AF045447',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
      },
    },
    {
      type: 'EMBL',
      id: 'AF045438',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
        status: 'JOINED',
      },
    },
    {
      type: 'EMBL',
      id: 'AF045439',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
        status: 'JOINED',
      },
    },
    {
      type: 'EMBL',
      id: 'AF045440',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
        status: 'JOINED',
      },
    },
    {
      type: 'EMBL',
      id: 'AF045441',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
        status: 'JOINED',
      },
    },
    {
      type: 'EMBL',
      id: 'AF045442',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
        status: 'JOINED',
      },
    },
    {
      type: 'EMBL',
      id: 'AF045443',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
        status: 'JOINED',
      },
    },
    {
      type: 'EMBL',
      id: 'AF045444',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
        status: 'JOINED',
      },
    },
    {
      type: 'EMBL',
      id: 'AF045445',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
        status: 'JOINED',
      },
    },
    {
      type: 'EMBL',
      id: 'AF045446',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'AAC03051.1',
        status: 'JOINED',
      },
    },
    {
      type: 'EMBL',
      id: 'U44378',
      properties: {
        'molecule type': 'mRNA',
        'protein sequence ID': 'AAA91041.1',
      },
    },
    {
      type: 'EMBL',
      id: 'AK290770',
      properties: {
        'molecule type': 'mRNA',
        'protein sequence ID': 'BAF83459.1',
      },
    },
    {
      type: 'EMBL',
      id: 'CH471096',
      properties: {
        'molecule type': 'Genomic_DNA',
        'protein sequence ID': 'EAW62985.1',
      },
    },
    {
      type: 'EMBL',
      id: 'BC002379',
      properties: {
        'molecule type': 'mRNA',
        'protein sequence ID': 'AAH02379.1',
      },
    },
    {
      type: 'CCDS',
      id: 'CCDS11950.1',
    },
    {
      type: 'PIR',
      id: 'S71811',
      properties: {
        'entry name': 'S71811',
      },
    },
    {
      type: 'RefSeq',
      id: 'NP_005350.1',
      properties: {
        'nucleotide sequence ID': 'NM_005359.5',
      },
    },
    {
      type: 'UniGene',
      id: 'Hs.75862',
    },
    {
      type: 'PDB',
      id: '1DD1',
      properties: {
        method: 'X-ray',
        chains: 'A/B/C=285-552',
        resolution: '2.62 A',
      },
    },
    {
      type: 'PDB',
      id: '1G88',
      properties: {
        method: 'X-ray',
        chains: 'A/B/C=285-552',
        resolution: '3.00 A',
      },
    },
    {
      type: 'PDB',
      id: '1MR1',
      properties: {
        method: 'X-ray',
        chains: 'A/B=319-552',
        resolution: '2.85 A',
      },
    },
    {
      type: 'PDB',
      id: '1U7F',
      properties: {
        method: 'X-ray',
        chains: 'B=314-552',
        resolution: '2.60 A',
      },
    },
    {
      type: 'PDB',
      id: '1U7V',
      properties: {
        method: 'X-ray',
        chains: 'B=314-549',
        resolution: '2.70 A',
      },
    },
    {
      type: 'PDB',
      id: '1YGS',
      properties: {
        method: 'X-ray',
        chains: 'A=319-552',
        resolution: '2.10 A',
      },
    },
    {
      type: 'PDB',
      id: '5C4V',
      properties: {
        method: 'X-ray',
        chains: 'A/C/E=314-549',
        resolution: '2.60 A',
      },
    },
    {
      type: 'PDB',
      id: '5MEY',
      properties: {
        method: 'X-ray',
        chains: 'A=10-140',
        resolution: '2.05 A',
      },
    },
    {
      type: 'PDB',
      id: '5MEZ',
      properties: {
        method: 'X-ray',
        chains: 'A/B=10-140',
        resolution: '2.98 A',
      },
    },
    {
      type: 'PDB',
      id: '5MF0',
      properties: {
        method: 'X-ray',
        chains: 'A/B=10-140',
        resolution: '3.03 A',
      },
    },
    {
      type: 'PDB',
      id: '5UWU',
      properties: {
        method: 'X-ray',
        chains: 'D=133-149',
        resolution: '2.24 A',
      },
    },
    {
      type: 'PDBsum',
      id: '1DD1',
    },
    {
      type: 'PDBsum',
      id: '1G88',
    },
    {
      type: 'PDBsum',
      id: '1MR1',
    },
    {
      type: 'PDBsum',
      id: '1U7F',
    },
    {
      type: 'PDBsum',
      id: '1U7V',
    },
    {
      type: 'PDBsum',
      id: '1YGS',
    },
    {
      type: 'PDBsum',
      id: '5C4V',
    },
    {
      type: 'PDBsum',
      id: '5MEY',
    },
    {
      type: 'PDBsum',
      id: '5MEZ',
    },
    {
      type: 'PDBsum',
      id: '5MF0',
    },
    {
      type: 'PDBsum',
      id: '5UWU',
    },
    {
      type: 'DisProt',
      id: 'DP00464',
    },
    {
      type: 'ProteinModelPortal',
      id: 'Q13485',
    },
    {
      type: 'SMR',
      id: 'Q13485',
    },
    {
      type: 'BioGrid',
      id: '110264',
      properties: {
        interactions: '225',
      },
    },
    {
      type: 'ComplexPortal',
      id: 'CPX-1',
      properties: {
        entryName: 'SMAD2-SMAD3-SMAD4 complex',
      },
    },
    {
      type: 'ComplexPortal',
      id: 'CPX-3208',
      properties: {
        entryName: 'SMAD2-SMAD4 complex',
      },
    },
    {
      type: 'ComplexPortal',
      id: 'CPX-3252',
      properties: {
        entryName: 'SMAD3-SMAD4 complex',
      },
    },
    {
      type: 'ComplexPortal',
      id: 'CPX-54',
      properties: {
        entryName: 'SMAD1-SMAD4 complex',
      },
    },
    {
      type: 'CORUM',
      id: 'Q13485',
    },
    {
      type: 'DIP',
      id: 'DIP-31512N',
    },
    {
      type: 'IntAct',
      id: 'Q13485',
      properties: {
        interactions: '122',
      },
    },
    {
      type: 'MINT',
      id: 'Q13485',
    },
    {
      type: 'STRING',
      id: '9606.ENSP00000341551',
    },
    {
      type: 'iPTMnet',
      id: 'Q13485',
    },
    {
      type: 'PhosphoSitePlus',
      id: 'Q13485',
    },
    {
      type: 'BioMuta',
      id: 'SMAD4',
    },
    {
      type: 'DMDM',
      id: '13959561',
    },
    {
      type: 'EPD',
      id: 'Q13485',
    },
    {
      type: 'MaxQB',
      id: 'Q13485',
    },
    {
      type: 'PaxDb',
      id: 'Q13485',
    },
    {
      type: 'PeptideAtlas',
      id: 'Q13485',
    },
    {
      type: 'PRIDE',
      id: 'Q13485',
    },
    {
      type: 'ProteomicsDB',
      id: '59479',
    },
    {
      type: 'DNASU',
      id: '4089',
    },
    {
      type: 'Ensembl',
      id: 'ENST00000342988',
      properties: {
        'gene ID': 'ENSG00000141646',
        'protein sequence ID': 'ENSP00000341551',
      },
    },
    {
      type: 'Ensembl',
      id: 'ENST00000398417',
      properties: {
        'gene ID': 'ENSG00000141646',
        'protein sequence ID': 'ENSP00000381452',
      },
    },
    {
      type: 'GeneID',
      id: '4089',
    },
    {
      type: 'KEGG',
      id: 'hsa:4089',
    },
    {
      type: 'UCSC',
      id: 'uc010xdp.3',
      properties: {
        'organism name': 'human',
      },
    },
    {
      type: 'CTD',
      id: '4089',
    },
    {
      type: 'DisGeNET',
      id: '4089',
    },
    {
      type: 'EuPathDB',
      id: 'HostDB:ENSG00000141646.13',
    },
    {
      type: 'GeneCards',
      id: 'SMAD4',
    },
    {
      type: 'GeneReviews',
      id: 'SMAD4',
    },
    {
      type: 'HGNC',
      id: 'HGNC:6770',
      properties: {
        'gene designation': 'SMAD4',
      },
    },
    {
      type: 'HPA',
      id: 'HPA019154',
    },
    {
      type: 'MalaCards',
      id: 'SMAD4',
    },
    {
      type: 'MIM',
      id: '114500',
      properties: {
        type: 'phenotype',
      },
    },
    {
      type: 'MIM',
      id: '139210',
      properties: {
        type: 'phenotype',
      },
    },
    {
      type: 'MIM',
      id: '174900',
      properties: {
        type: 'phenotype',
      },
    },
    {
      type: 'MIM',
      id: '175050',
      properties: {
        type: 'phenotype',
      },
    },
    {
      type: 'MIM',
      id: '260350',
      properties: {
        type: 'phenotype',
      },
    },
    {
      type: 'MIM',
      id: '600993',
      properties: {
        type: 'gene',
      },
    },
    {
      type: 'neXtProt',
      id: 'NX_Q13485',
    },
    {
      type: 'OpenTargets',
      id: 'ENSG00000141646',
    },
    {
      type: 'Orphanet',
      id: '1333',
      properties: {
        disease: 'Familial pancreatic carcinoma',
      },
    },
    {
      type: 'Orphanet',
      id: '329971',
      properties: {
        disease: 'Generalized juvenile polyposis/juvenile polyposis coli',
      },
    },
    {
      type: 'Orphanet',
      id: '774',
      properties: {
        disease: 'Hereditary hemorrhagic telangiectasia',
      },
    },
    {
      type: 'Orphanet',
      id: '2588',
      properties: {
        disease: 'Myhre syndrome',
      },
    },
    {
      type: 'PharmGKB',
      id: 'PA30527',
    },
    {
      type: 'eggNOG',
      id: 'KOG3701',
      properties: {
        'taxonomic scope': 'Eukaryota',
      },
    },
    {
      type: 'eggNOG',
      id: 'ENOG410XQKU',
      properties: {
        'taxonomic scope': 'LUCA',
      },
    },
    {
      type: 'GeneTree',
      id: 'ENSGT00760000119091',
    },
    {
      type: 'HOGENOM',
      id: 'HOG000286019',
    },
    {
      type: 'HOVERGEN',
      id: 'HBG053353',
    },
    {
      type: 'InParanoid',
      id: 'Q13485',
    },
    {
      type: 'KO',
      id: 'K04501',
    },
    {
      type: 'OMA',
      id: 'PQMGPGT',
    },
    {
      type: 'OrthoDB',
      id: 'EOG091G05Z9',
    },
    {
      type: 'PhylomeDB',
      id: 'Q13485',
    },
    {
      type: 'TreeFam',
      id: 'TF314923',
    },
    {
      type: 'Reactome',
      id: 'R-HSA-1181150',
      properties: {
        'pathway name': 'Signaling by NODAL',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-1502540',
      properties: {
        'pathway name': 'Signaling by Activin',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-201451',
      properties: {
        'pathway name': 'Signaling by BMP',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-2173789',
      properties: {
        'pathway name': 'TGF-beta receptor signaling activates SMADs',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-2173795',
      properties: {
        'pathway name': 'Downregulation of SMAD2/3:SMAD4 transcriptional activity',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-2173796',
      properties: {
        'pathway name': 'SMAD2/SMAD3:SMAD4 heterotrimer regulates transcription',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-3311021',
      properties: {
        'pathway name': 'SMAD4 MH2 Domain Mutants in Cancer',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-3315487',
      properties: {
        'pathway name': 'SMAD2/3 MH2 Domain Mutants in Cancer',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-452723',
      properties: {
        'pathway name': 'Transcriptional regulation of pluripotent stem cells',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-5689880',
      properties: {
        'pathway name': 'Ub-specific processing proteases',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-8941326',
      properties: {
        'pathway name': 'RUNX2 regulates bone development',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-8941855',
      properties: {
        'pathway name': 'RUNX3 regulates CDKN1A transcription',
      },
    },
    {
      type: 'Reactome',
      id: 'R-HSA-8952158',
      properties: {
        'pathway name': 'RUNX3 regulates BCL2L11 (BIM) transcription',
      },
    },
    {
      type: 'SignaLink',
      id: 'Q13485',
    },
    {
      type: 'SIGNOR',
      id: 'Q13485',
    },
    {
      type: 'ChiTaRS',
      id: 'SMAD4',
      properties: {
        'organism name': 'human',
      },
    },
    {
      type: 'EvolutionaryTrace',
      id: 'Q13485',
    },
    {
      type: 'GeneWiki',
      id: 'Mothers_against_decapentaplegic_homolog_4',
    },
    {
      type: 'GenomeRNAi',
      id: '4089',
    },
    {
      type: 'PRO',
      id: 'PR:Q13485',
    },
    {
      type: 'Proteomes',
      id: 'UP000005640',
      properties: {
        component: 'Chromosome 18',
      },
    },
    {
      type: 'Bgee',
      id: 'ENSG00000141646',
      properties: {
        'expression patterns': 'Expressed in 224 organ(s), highest expression level in kidney',
      },
    },
    {
      type: 'CleanEx',
      id: 'HS_SMAD4',
    },
    {
      type: 'ExpressionAtlas',
      id: 'Q13485',
      properties: {
        'expression patterns': 'baseline and differential',
      },
    },
    {
      type: 'Genevisible',
      id: 'Q13485',
      properties: {
        Description: 'HS',
      },
    },
    {
      type: 'GO',
      id: 'GO:0032444',
      properties: {
        term: 'C:activin responsive factor complex',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9389648',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9389648',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9389648',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0005813',
      properties: {
        term: 'C:centrosome',
        source: 'IDA:HPA',
      },
    },
    {
      type: 'GO',
      id: 'GO:0005737',
      properties: {
        term: 'C:cytoplasm',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '12161428',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/12161428',
            alternativeUrl: 'https://europepmc.org/abstract/MED/12161428',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9311995',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9311995',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9311995',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9389648',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9389648',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9389648',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0005829',
      properties: {
        term: 'C:cytosol',
        source: 'IDA:HPA',
      },
    },
    {
      type: 'GO',
      id: 'GO:0000790',
      properties: {
        term: 'C:nuclear chromatin',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '21828274',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/21828274',
            alternativeUrl: 'https://europepmc.org/abstract/MED/21828274',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0005654',
      properties: {
        term: 'C:nucleoplasm',
        source: 'IDA:HPA',
      },
    },
    {
      type: 'GO',
      id: 'GO:0005634',
      properties: {
        term: 'C:nucleus',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '12161428',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/12161428',
            alternativeUrl: 'https://europepmc.org/abstract/MED/12161428',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '16007207',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/16007207',
            alternativeUrl: 'https://europepmc.org/abstract/MED/16007207',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9311995',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9311995',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9311995',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9389648',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9389648',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9389648',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0071141',
      properties: {
        term: 'C:SMAD protein complex',
        source: 'IDA:UniProtKB',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '18832382',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/18832382',
            alternativeUrl: 'https://europepmc.org/abstract/MED/18832382',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0005667',
      properties: {
        term: 'C:transcription factor complex',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '17438144',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/17438144',
            alternativeUrl: 'https://europepmc.org/abstract/MED/17438144',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0003682',
      properties: {
        term: 'F:chromatin binding',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0005518',
      properties: {
        term: 'F:collagen binding',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0070411',
      properties: {
        term: 'F:I-SMAD binding',
        source: 'IPI:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9256479',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9256479',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9256479',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0042802',
      properties: {
        term: 'F:identical protein binding',
        source: 'IMP:CAFA',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '10647180',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/10647180',
            alternativeUrl: 'https://europepmc.org/abstract/MED/10647180',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0046872',
      properties: {
        term: 'F:metal ion binding',
        source: 'IEA:UniProtKB-KW',
      },
    },
    {
      type: 'GO',
      id: 'GO:0046982',
      properties: {
        term: 'F:protein heterodimerization activity',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0042803',
      properties: {
        term: 'F:protein homodimerization activity',
        source: 'IPI:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '8774881',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/8774881',
            alternativeUrl: 'https://europepmc.org/abstract/MED/8774881',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0000987',
      properties: {
        term: 'F:proximal promoter sequence-specific DNA binding',
        source: 'IDA:UniProtKB',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '18832382',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/18832382',
            alternativeUrl: 'https://europepmc.org/abstract/MED/18832382',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0070412',
      properties: {
        term: 'F:R-SMAD binding',
        source: 'IPI:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '8774881',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/8774881',
            alternativeUrl: 'https://europepmc.org/abstract/MED/8774881',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9111321',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9111321',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9111321',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9311995',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9311995',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9311995',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9732876',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9732876',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9732876',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0000978',
      properties: {
        term: 'F:RNA polymerase II proximal promoter sequence-specific DNA binding',
        source: 'IDA:NTNU_SB',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9389648',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9389648',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9389648',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0000981',
      properties: {
        term: 'F:RNA polymerase II transcription factor activity, sequence-specific DNA binding',
        source: 'ISA:NTNU_SB',
      },
    },
    {
      type: 'GO',
      id: 'GO:0001085',
      properties: {
        term: 'F:RNA polymerase II transcription factor binding',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0043199',
      properties: {
        term: 'F:sulfate binding',
        source: 'IMP:CAFA',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '10647180',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/10647180',
            alternativeUrl: 'https://europepmc.org/abstract/MED/10647180',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0003712',
      properties: {
        term: 'F:transcription coregulator activity',
        source: 'IDA:UniProtKB',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '18832382',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/18832382',
            alternativeUrl: 'https://europepmc.org/abstract/MED/18832382',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0044212',
      properties: {
        term: 'F:transcription regulatory region DNA binding',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '17438144',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/17438144',
            alternativeUrl: 'https://europepmc.org/abstract/MED/17438144',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0001077',
      properties: {
        term: 'F:transcriptional activator activity, RNA polymerase II proximal promoter sequence-specific DNA binding',
        source: 'IDA:NTNU_SB',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9389648',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9389648',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9389648',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0030616',
      properties: {
        term: 'F:transforming growth factor beta receptor, common-partner cytoplasmic mediator activity',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9389648',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9389648',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9389648',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0036302',
      properties: {
        term: 'P:atrioventricular canal development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0003190',
      properties: {
        term: 'P:atrioventricular valve formation',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0007411',
      properties: {
        term: 'P:axon guidance',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0030509',
      properties: {
        term: 'P:BMP signaling pathway',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9389648',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9389648',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9389648',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0003360',
      properties: {
        term: 'P:brainstem development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0001658',
      properties: {
        term: 'P:branching involved in ureteric bud morphogenesis',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0008283',
      properties: {
        term: 'P:cell proliferation',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0006879',
      properties: {
        term: 'P:cellular iron ion homeostasis',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0071773',
      properties: {
        term: 'P:cellular response to BMP stimulus',
        source: 'NAS:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '14687659',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/14687659',
            alternativeUrl: 'https://europepmc.org/abstract/MED/14687659',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0048589',
      properties: {
        term: 'P:developmental growth',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0042733',
      properties: {
        term: 'P:embryonic digit morphogenesis',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0060956',
      properties: {
        term: 'P:endocardial cell differentiation',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0007492',
      properties: {
        term: 'P:endoderm development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0042118',
      properties: {
        term: 'P:endothelial cell activation',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0003198',
      properties: {
        term: 'P:epithelial to mesenchymal transition involved in endocardial cushion formation',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0061040',
      properties: {
        term: 'P:female gonad morphogenesis',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0048859',
      properties: {
        term: 'P:formation of anatomical boundary',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0001702',
      properties: {
        term: 'P:gastrulation with mouth forming second',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0001701',
      properties: {
        term: 'P:in utero embryonic development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0070102',
      properties: {
        term: 'P:interleukin-6-mediated signaling pathway',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0035556',
      properties: {
        term: 'P:intracellular signal transduction',
        source: 'IMP:CACAO',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '22316667',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/22316667',
            alternativeUrl: 'https://europepmc.org/abstract/MED/22316667',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0003220',
      properties: {
        term: 'P:left ventricular cardiac muscle tissue morphogenesis',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0007498',
      properties: {
        term: 'P:mesoderm development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0072133',
      properties: {
        term: 'P:metanephric mesenchyme morphogenesis',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0010614',
      properties: {
        term: 'P:negative regulation of cardiac muscle hypertrophy',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:1905305',
      properties: {
        term: 'P:negative regulation of cardiac myofibril assembly',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0060548',
      properties: {
        term: 'P:negative regulation of cell death',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0030308',
      properties: {
        term: 'P:negative regulation of cell growth',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '8774881',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/8774881',
            alternativeUrl: 'https://europepmc.org/abstract/MED/8774881',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0008285',
      properties: {
        term: 'P:negative regulation of cell proliferation',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0070373',
      properties: {
        term: 'P:negative regulation of ERK1 and ERK2 cascade',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0000122',
      properties: {
        term: 'P:negative regulation of transcription by RNA polymerase II',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0045892',
      properties: {
        term: 'P:negative regulation of transcription, DNA-templated',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '8774881',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/8774881',
            alternativeUrl: 'https://europepmc.org/abstract/MED/8774881',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0072134',
      properties: {
        term: 'P:nephrogenic mesenchyme morphogenesis',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0014033',
      properties: {
        term: 'P:neural crest cell differentiation',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0048663',
      properties: {
        term: 'P:neuron fate commitment',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0003148',
      properties: {
        term: 'P:outflow tract septum morphogenesis',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0001541',
      properties: {
        term: 'P:ovarian follicle development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0030513',
      properties: {
        term: 'P:positive regulation of BMP signaling pathway',
        source: 'IMP:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '19366699',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/19366699',
            alternativeUrl: 'https://europepmc.org/abstract/MED/19366699',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0003251',
      properties: {
        term: 'P:positive regulation of cell proliferation involved in heart valve morphogenesis',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0010718',
      properties: {
        term: 'P:positive regulation of epithelial to mesenchymal transition',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0046881',
      properties: {
        term: 'P:positive regulation of follicle-stimulating hormone secretion',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0051571',
      properties: {
        term: 'P:positive regulation of histone H3-K4 methylation',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:2000617',
      properties: {
        term: 'P:positive regulation of histone H3-K9 acetylation',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0033686',
      properties: {
        term: 'P:positive regulation of luteinizing hormone secretion',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0010862',
      properties: {
        term: 'P:positive regulation of pathway-restricted SMAD protein phosphorylation',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0060391',
      properties: {
        term: 'P:positive regulation of SMAD protein signal transduction',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0045944',
      properties: {
        term: 'P:positive regulation of transcription by RNA polymerase II',
        source: 'IDA:UniProtKB',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '18832382',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/18832382',
            alternativeUrl: 'https://europepmc.org/abstract/MED/18832382',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:1901522',
      properties: {
        term:
          'P:positive regulation of transcription from RNA polymerase II promoter involved in cellular response to chemical stimulus',
        source: 'TAS:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '14687659',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/14687659',
            alternativeUrl: 'https://europepmc.org/abstract/MED/14687659',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0045893',
      properties: {
        term: 'P:positive regulation of transcription, DNA-templated',
        source: 'IDA:UniProtKB',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9707553',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9707553',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9707553',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0030511',
      properties: {
        term: 'P:positive regulation of transforming growth factor beta receptor signaling pathway',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '19328798',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/19328798',
            alternativeUrl: 'https://europepmc.org/abstract/MED/19328798',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0061614',
      properties: {
        term: 'P:pri-miRNA transcription by RNA polymerase II',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0016579',
      properties: {
        term: 'P:protein deubiquitination',
        source: 'TAS:Reactome',
      },
    },
    {
      type: 'GO',
      id: 'GO:0070207',
      properties: {
        term: 'P:protein homotrimerization',
        source: 'IMP:CAFA',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '10647180',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/10647180',
            alternativeUrl: 'https://europepmc.org/abstract/MED/10647180',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0051098',
      properties: {
        term: 'P:regulation of binding',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0051797',
      properties: {
        term: 'P:regulation of hair follicle development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0017015',
      properties: {
        term: 'P:regulation of transforming growth factor beta receptor signaling pathway',
        source: 'IMP:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '8774881',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/8774881',
            alternativeUrl: 'https://europepmc.org/abstract/MED/8774881',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0032909',
      properties: {
        term: 'P:regulation of transforming growth factor beta2 production',
        source: 'IMP:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '12411310',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/12411310',
            alternativeUrl: 'https://europepmc.org/abstract/MED/12411310',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0001666',
      properties: {
        term: 'P:response to hypoxia',
        source: 'IMP:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '12411310',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/12411310',
            alternativeUrl: 'https://europepmc.org/abstract/MED/12411310',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0071559',
      properties: {
        term: 'P:response to transforming growth factor beta',
        source: 'IDA:UniProtKB',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9707553',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9707553',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9707553',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0048733',
      properties: {
        term: 'P:sebaceous gland development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0062009',
      properties: {
        term: 'P:secondary palate development',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'GO',
      id: 'GO:0072520',
      properties: {
        term: 'P:seminiferous tubule development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0007338',
      properties: {
        term: 'P:single fertilization',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0007183',
      properties: {
        term: 'P:SMAD protein complex assembly',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '10823886',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/10823886',
            alternativeUrl: 'https://europepmc.org/abstract/MED/10823886',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0060395',
      properties: {
        term: 'P:SMAD protein signal transduction',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9707553',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9707553',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9707553',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9732876',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9732876',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9732876',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0035019',
      properties: {
        term: 'P:somatic stem cell population maintenance',
        source: 'TAS:Reactome',
      },
    },
    {
      type: 'GO',
      id: 'GO:0032525',
      properties: {
        term: 'P:somite rostral/caudal axis specification',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0007283',
      properties: {
        term: 'P:spermatogenesis',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0007179',
      properties: {
        term: 'P:transforming growth factor beta receptor signaling pathway',
        source: 'IDA:BHF-UCL',
      },
      evidences: [
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9389648',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9389648',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9389648',
          },
        },
        {
          code: 'ECO:0000269',
          source: {
            name: 'PubMed',
            id: '9732876',
            url: 'http://www.ncbi.nlm.nih.gov/pubmed/9732876',
            alternativeUrl: 'https://europepmc.org/abstract/MED/9732876',
          },
        },
      ],
    },
    {
      type: 'GO',
      id: 'GO:0060065',
      properties: {
        term: 'P:uterus development',
        source: 'IEA:Ensembl',
      },
    },
    {
      type: 'GO',
      id: 'GO:0060412',
      properties: {
        term: 'P:ventricular septum morphogenesis',
        source: 'ISS:BHF-UCL',
      },
    },
    {
      type: 'Gene3D',
      id: '2.60.200.10',
      properties: {
        'match status': '1',
      },
    },
    {
      type: 'Gene3D',
      id: '3.90.520.10',
      properties: {
        'match status': '1',
      },
    },
    {
      type: 'InterPro',
      id: 'IPR013790',
      properties: {
        'entry name': 'Dwarfin',
      },
    },
    {
      type: 'InterPro',
      id: 'IPR003619',
      properties: {
        'entry name': 'MAD_homology1_Dwarfin-type',
      },
    },
    {
      type: 'InterPro',
      id: 'IPR013019',
      properties: {
        'entry name': 'MAD_homology_MH1',
      },
    },
    {
      type: 'InterPro',
      id: 'IPR017855',
      properties: {
        'entry name': 'SMAD-like_dom_sf',
      },
    },
    {
      type: 'InterPro',
      id: 'IPR001132',
      properties: {
        'entry name': 'SMAD_dom_Dwarfin-type',
      },
    },
    {
      type: 'InterPro',
      id: 'IPR008984',
      properties: {
        'entry name': 'SMAD_FHA_dom_sf',
      },
    },
    {
      type: 'InterPro',
      id: 'IPR036578',
      properties: {
        'entry name': 'SMAD_MH1_sf',
      },
    },
    {
      type: 'PANTHER',
      id: 'PTHR13703',
      properties: {
        'match status': '1',
        'entry name': 'PTHR13703',
      },
    },
    {
      type: 'Pfam',
      id: 'PF03165',
      properties: {
        'match status': '1',
        'entry name': 'MH1',
      },
    },
    {
      type: 'Pfam',
      id: 'PF03166',
      properties: {
        'match status': '1',
        'entry name': 'MH2',
      },
    },
    {
      type: 'SMART',
      id: 'SM00523',
      properties: {
        'match status': '1',
        'entry name': 'DWA',
      },
    },
    {
      type: 'SMART',
      id: 'SM00524',
      properties: {
        'match status': '1',
        'entry name': 'DWB',
      },
    },
    {
      type: 'SUPFAM',
      id: 'SSF49879',
      properties: {
        'match status': '1',
        'entry name': 'SSF49879',
      },
    },
    {
      type: 'SUPFAM',
      id: 'SSF56366',
      properties: {
        'match status': '1',
        'entry name': 'SSF56366',
      },
    },
    {
      type: 'PROSITE',
      id: 'PS51075',
      properties: {
        'match status': '1',
        'entry name': 'MH1',
      },
    },
    {
      type: 'PROSITE',
      id: 'PS51076',
      properties: {
        'match status': '1',
        'entry name': 'MH2',
      },
    },
  ],
  keywords: [
    {
      value: '3D-structure',
    },
    {
      value: 'Acetylation',
    },
    {
      value: 'Complete proteome',
    },
    {
      value: 'Cytoplasm',
    },
    {
      value: 'Disease mutation',
    },
    {
      value: 'DNA-binding',
    },
    {
      value: 'Isopeptide bond',
    },
    {
      value: 'Metal-binding',
    },
    {
      value: 'Nucleus',
    },
    {
      value: 'Phosphoprotein',
    },
    {
      value: 'Polymorphism',
    },
    {
      value: 'Reference proteome',
    },
    {
      value: 'Transcription',
    },
    {
      value: 'Transcription regulation',
    },
    {
      value: 'Ubl conjugation',
    },
    {
      value: 'Zinc',
    },
  ],
  references: [
    {
      citation: {
        type: 'journal article',
        publicationDate: '1996',
        title: 'DPC4, a candidate tumor suppressor gene at human chromosome 18q21.1.',
        authors: [
          'Hahn S.A.',
          'Schutte M.',
          'Shamsul Hoque A.T.M.',
          'Moskaluk C.A.',
          'da Costa L.T.',
          'Rozenblum E.',
          'Weinstein C.L.',
          'Fischer A.',
          'Yeo C.J.',
          'Hruban R.H.',
          'Kern S.E.',
        ],
        publication: {
          journalName: 'Science',
        },
        location: {
          volume: '271',
          firstPage: '350',
          lastPage: '353',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '8553070',
          },
          {
            type: 'DOI',
            id: '10.1126/science.271.5247.350',
          },
        ],
      },
      source: {
        tissue: [
          {
            value: 'Fetal brain',
          },
        ],
      },
      scope: ['NUCLEOTIDE SEQUENCE [GENOMIC DNA / MRNA]', 'VARIANT PANCREATIC CARCINOMA HIS-493'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '1996',
        title: 'Receptor-associated Mad homologues synergize as effectors of the TGF-beta response.',
        authors: ['Zhang Y.', 'Feng X.-H.', 'Wu R.-Y.', 'Derynck R.'],
        publication: {
          journalName: 'Nature',
        },
        location: {
          volume: '383',
          firstPage: '168',
          lastPage: '172',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '8774881',
          },
          {
            type: 'DOI',
            id: '10.1038/383168a0',
          },
        ],
      },
      source: {
        tissue: [
          {
            value: 'Placenta',
          },
        ],
      },
      scope: ['NUCLEOTIDE SEQUENCE [GENOMIC DNA]'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '1997',
        title: 'Genomic sequencing of DPC4 in the analysis of familial pancreatic carcinoma.',
        authors: [
          'Moskaluk C.A.',
          'Hruban R.H.',
          'Schutte M.',
          'Lietman A.S.',
          'Smyrk T.',
          'Fusaro L.',
          'Fusaro R.',
          'Lynch J.',
          'Yeo C.J.',
          'Jackson C.E.',
          'Lynch H.T.',
          'Kern S.E.',
        ],
        publication: {
          journalName: 'Diagn. Mol. Pathol.',
        },
        location: {
          volume: '6',
          firstPage: '85',
          lastPage: '90',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '9098646',
          },
          {
            type: 'DOI',
            id: '10.1097/00019606-199704000-00003',
          },
        ],
      },
      scope: ['NUCLEOTIDE SEQUENCE [GENOMIC DNA]'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2004',
        title: 'Complete sequencing and characterization of 21,243 full-length human cDNAs.',
        authors: [
          'Ota T.',
          'Suzuki Y.',
          'Nishikawa T.',
          'Otsuki T.',
          'Sugiyama T.',
          'Irie R.',
          'Wakamatsu A.',
          'Hayashi K.',
          'Sato H.',
          'Nagai K.',
          'Kimura K.',
          'Makita H.',
          'Sekine M.',
          'Obayashi M.',
          'Nishi T.',
          'Shibahara T.',
          'Tanaka T.',
          'Ishii S.',
          'Yamamoto J.',
          'Saito K.',
          'Kawai Y.',
          'Isono Y.',
          'Nakamura Y.',
          'Nagahari K.',
          'Murakami K.',
          'Yasuda T.',
          'Iwayanagi T.',
          'Wagatsuma M.',
          'Shiratori A.',
          'Sudo H.',
          'Hosoiri T.',
          'Kaku Y.',
          'Kodaira H.',
          'Kondo H.',
          'Sugawara M.',
          'Takahashi M.',
          'Kanda K.',
          'Yokoi T.',
          'Furuya T.',
          'Kikkawa E.',
          'Omura Y.',
          'Abe K.',
          'Kamihara K.',
          'Katsuta N.',
          'Sato K.',
          'Tanikawa M.',
          'Yamazaki M.',
          'Ninomiya K.',
          'Ishibashi T.',
          'Yamashita H.',
          'Murakawa K.',
          'Fujimori K.',
          'Tanai H.',
          'Kimata M.',
          'Watanabe M.',
          'Hiraoka S.',
          'Chiba Y.',
          'Ishida S.',
          'Ono Y.',
          'Takiguchi S.',
          'Watanabe S.',
          'Yosida M.',
          'Hotuta T.',
          'Kusano J.',
          'Kanehori K.',
          'Takahashi-Fujii A.',
          'Hara H.',
          'Tanase T.-O.',
          'Nomura Y.',
          'Togiya S.',
          'Komai F.',
          'Hara R.',
          'Takeuchi K.',
          'Arita M.',
          'Imose N.',
          'Musashino K.',
          'Yuuki H.',
          'Oshima A.',
          'Sasaki N.',
          'Aotsuka S.',
          'Yoshikawa Y.',
          'Matsunawa H.',
          'Ichihara T.',
          'Shiohata N.',
          'Sano S.',
          'Moriya S.',
          'Momiyama H.',
          'Satoh N.',
          'Takami S.',
          'Terashima Y.',
          'Suzuki O.',
          'Nakagawa S.',
          'Senoh A.',
          'Mizoguchi H.',
          'Goto Y.',
          'Shimizu F.',
          'Wakebe H.',
          'Hishigaki H.',
          'Watanabe T.',
          'Sugiyama A.',
          'Takemoto M.',
          'Kawakami B.',
          'Yamazaki M.',
          'Watanabe K.',
          'Kumagai A.',
          'Itakura S.',
          'Fukuzumi Y.',
          'Fujimori Y.',
          'Komiyama M.',
          'Tashiro H.',
          'Tanigami A.',
          'Fujiwara T.',
          'Ono T.',
          'Yamada K.',
          'Fujii Y.',
          'Ozaki K.',
          'Hirao M.',
          'Ohmori Y.',
          'Kawabata A.',
          'Hikiji T.',
          'Kobatake N.',
          'Inagaki H.',
          'Ikema Y.',
          'Okamoto S.',
          'Okitani R.',
          'Kawakami T.',
          'Noguchi S.',
          'Itoh T.',
          'Shigeta K.',
          'Senba T.',
          'Matsumura K.',
          'Nakajima Y.',
          'Mizuno T.',
          'Morinaga M.',
          'Sasaki M.',
          'Togashi T.',
          'Oyama M.',
          'Hata H.',
          'Watanabe M.',
          'Komatsu T.',
          'Mizushima-Sugano J.',
          'Satoh T.',
          'Shirai Y.',
          'Takahashi Y.',
          'Nakagawa K.',
          'Okumura K.',
          'Nagase T.',
          'Nomura N.',
          'Kikuchi H.',
          'Masuho Y.',
          'Yamashita R.',
          'Nakai K.',
          'Yada T.',
          'Nakamura Y.',
          'Ohara O.',
          'Isogai T.',
          'Sugano S.',
        ],
        publication: {
          journalName: 'Nat. Genet.',
        },
        location: {
          volume: '36',
          firstPage: '40',
          lastPage: '45',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '14702039',
          },
          {
            type: 'DOI',
            id: '10.1038/ng1285',
          },
        ],
      },
      scope: ['NUCLEOTIDE SEQUENCE [LARGE SCALE MRNA]'],
    },
    {
      citation: {
        type: 'submission',
        publicationDate: 'JUL-2005',
        authors: [
          'Mural R.J.',
          'Istrail S.',
          'Sutton G.G.',
          'Florea L.',
          'Halpern A.L.',
          'Mobarry C.M.',
          'Lippert R.',
          'Walenz B.',
          'Shatkay H.',
          'Dew I.',
          'Miller J.R.',
          'Flanigan M.J.',
          'Edwards N.J.',
          'Bolanos R.',
          'Fasulo D.',
          'Halldorsson B.V.',
          'Hannenhalli S.',
          'Turner R.',
          'Yooseph S.',
          'Lu F.',
          'Nusskern D.R.',
          'Shue B.C.',
          'Zheng X.H.',
          'Zhong F.',
          'Delcher A.L.',
          'Huson D.H.',
          'Kravitz S.A.',
          'Mouchard L.',
          'Reinert K.',
          'Remington K.A.',
          'Clark A.G.',
          'Waterman M.S.',
          'Eichler E.E.',
          'Adams M.D.',
          'Hunkapiller M.W.',
          'Myers E.W.',
          'Venter J.C.',
        ],
        publication: {
          submissionDatabase: 'EMBL/GenBank/DDBJ databases',
        },
      },
      scope: ['NUCLEOTIDE SEQUENCE [LARGE SCALE GENOMIC DNA]'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2004',
        title:
          'The status, quality, and expansion of the NIH full-length cDNA project: the Mammalian Gene Collection (MGC).',
        consortiums: ['The MGC Project Team'],
        publication: {
          journalName: 'Genome Res.',
        },
        location: {
          volume: '14',
          firstPage: '2121',
          lastPage: '2127',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '15489334',
          },
          {
            type: 'DOI',
            id: '10.1101/gr.2596504',
          },
        ],
      },
      source: {
        tissue: [
          {
            value: 'Muscle',
          },
        ],
      },
      scope: ['NUCLEOTIDE SEQUENCE [LARGE SCALE MRNA]'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '1997',
        title: 'Dual role of the Smad4/DPC4 tumor suppressor in TGFbeta-inducible transcriptional complexes.',
        authors: ['Liu F.', 'Pouponnot C.', 'Massague J.'],
        publication: {
          journalName: 'Genes Dev.',
        },
        location: {
          volume: '11',
          firstPage: '3157',
          lastPage: '3167',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '9389648',
          },
          {
            type: 'DOI',
            id: '10.1101/gad.11.23.3157',
          },
        ],
      },
      scope: ['FUNCTION'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '1998',
        title:
          'Smad proteins exist as monomers in vivo and undergo homo- and hetero-oligomerization upon activation by serine/threonine kinase receptors.',
        authors: ['Kawabata M.', 'Inoue H.', 'Hanyu A.', 'Imamura T.', 'Miyazono K.'],
        publication: {
          journalName: 'EMBO J.',
        },
        location: {
          volume: '17',
          firstPage: '4056',
          lastPage: '4065',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '9670020',
          },
          {
            type: 'DOI',
            id: '10.1093/emboj/17.14.4056',
          },
        ],
      },
      scope: ['SUBUNIT'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '1998',
        title:
          'Transcriptional activating activity of Smad4: roles of SMAD hetero-oligomerization and enhancement by an associating transactivator.',
        authors: [
          'Shioda T.',
          'Lechleider R.J.',
          'Dunwoodie S.L.',
          'Li H.',
          'Yahata T.',
          'de Caestecker M.P.',
          'Fenner M.H.',
          'Roberts A.B.',
          'Isselbacher K.J.',
        ],
        publication: {
          journalName: 'Proc. Natl. Acad. Sci. U.S.A.',
        },
        location: {
          volume: '95',
          firstPage: '9785',
          lastPage: '9790',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '9707553',
          },
          {
            type: 'DOI',
            id: '10.1073/pnas.95.17.9785',
          },
        ],
      },
      scope: ['INTERACTION WITH CITED1'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2000',
        title:
          'OAZ uses distinct DNA- and protein-binding zinc fingers in separate BMP-Smad and Olf signaling pathways.',
        authors: ['Hata A.', 'Seoane J.', 'Lagna G.', 'Montalvo E.', 'Hemmati-Brivanlou A.', 'Massague J.'],
        publication: {
          journalName: 'Cell',
        },
        location: {
          volume: '100',
          firstPage: '229',
          lastPage: '240',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '10660046',
          },
          {
            type: 'DOI',
            id: '10.1016/S0092-8674(00)81561-5',
          },
        ],
      },
      scope: ['INTERACTION WITH ZNF423'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2000',
        title: 'The Smad4 activation domain (SAD) is a proline-rich, p300-dependent transcriptional activation domain.',
        authors: [
          'de Caestecker M.P.',
          'Yahata T.',
          'Wang D.',
          'Parks W.T.',
          'Huang S.',
          'Hill C.S.',
          'Shioda T.',
          'Roberts A.B.',
          'Lechleider R.J.',
        ],
        publication: {
          journalName: 'J. Biol. Chem.',
        },
        location: {
          volume: '275',
          firstPage: '2115',
          lastPage: '2122',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '10636916',
          },
          {
            type: 'DOI',
            id: '10.1074/jbc.275.3.2115',
          },
        ],
      },
      scope: ['CHARACTERIZATION OF SAD DOMAIN'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2001',
        title: 'LIP1, a cytoplasmic protein functionally linked to the Peutz-Jeghers syndrome kinase LKB1.',
        authors: ['Smith D.P.', 'Rayter S.I.', 'Niederlander C.', 'Spicer J.', 'Jones C.M.', 'Ashworth A.'],
        publication: {
          journalName: 'Hum. Mol. Genet.',
        },
        location: {
          volume: '10',
          firstPage: '2869',
          lastPage: '2877',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '11741830',
          },
          {
            type: 'DOI',
            id: '10.1093/hmg/10.25.2869',
          },
        ],
      },
      scope: [
        'IDENTIFICATION IN A TERNARY COMPLEX COMPOSED OF STK11/LKB1 AND STK11IP',
        'INTERACTION WITH STK11/LKB1 AND STK11IP',
      ],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2002',
        title: 'Jab1 antagonizes TGF-beta signaling by inducing Smad4 degradation.',
        authors: ['Wan M.', 'Cao X.', 'Wu Y.', 'Bai S.', 'Wu L.', 'Shi X.', 'Wang N.', 'Cao X.'],
        publication: {
          journalName: 'EMBO Rep.',
        },
        location: {
          volume: '3',
          firstPage: '171',
          lastPage: '176',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '11818334',
          },
          {
            type: 'DOI',
            id: '10.1093/embo-reports/kvf024',
          },
        ],
      },
      scope: ['INTERACTION WITH COPS5'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2002',
        title:
          'Identification of mZnf8, a mouse Kruppel-like transcriptional repressor, as a novel nuclear interaction partner of Smad1.',
        authors: ['Jiao K.', 'Zhou Y.', 'Hogan B.L.M.'],
        publication: {
          journalName: 'Mol. Cell. Biol.',
        },
        location: {
          volume: '22',
          firstPage: '7633',
          lastPage: '7644',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '12370310',
          },
          {
            type: 'DOI',
            id: '10.1128/MCB.22.21.7633-7644.2002',
          },
        ],
      },
      scope: ['INTERACTION WITH ZNF8'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2003',
        title:
          'TLP, a novel modulator of TGF-beta signaling, has opposite effects on Smad2- and Smad3-dependent signaling.',
        authors: [
          'Felici A.',
          'Wurthner J.U.',
          'Parks W.T.',
          'Giam L.R.',
          'Reiss M.',
          'Karpova T.S.',
          'McNally J.G.',
          'Roberts A.B.',
        ],
        publication: {
          journalName: 'EMBO J.',
        },
        location: {
          volume: '22',
          firstPage: '4465',
          lastPage: '4477',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '12941698',
          },
          {
            type: 'DOI',
            id: '10.1093/emboj/cdg428',
          },
        ],
      },
      scope: ['INTERACTION WITH VPS39'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2003',
        title: 'DACH1 inhibits transforming growth factor-beta signaling through binding Smad4.',
        authors: [
          'Wu K.',
          'Yang Y.',
          'Wang C.',
          'Davoli M.A.',
          "D'Amico M.",
          'Li A.',
          'Cveklova K.',
          'Kozmik Z.',
          'Lisanti M.P.',
          'Russell R.G.',
          'Cvekl A.',
          'Pestell R.G.',
        ],
        publication: {
          journalName: 'J. Biol. Chem.',
        },
        location: {
          volume: '278',
          firstPage: '51673',
          lastPage: '51684',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '14525983',
          },
          {
            type: 'DOI',
            id: '10.1074/jbc.M310021200',
          },
        ],
      },
      scope: ['INTERACTION WITH DACH1'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2003',
        title:
          'Homeoprotein DLX-1 interacts with Smad4 and blocks a signaling pathway from activin A in hematopoietic cells.',
        authors: [
          'Chiba S.',
          'Takeshita K.',
          'Imai Y.',
          'Kumano K.',
          'Kurokawa M.',
          'Masuda S.',
          'Shimizu K.',
          'Nakamura S.',
          'Ruddle F.H.',
          'Hirai H.',
        ],
        publication: {
          journalName: 'Proc. Natl. Acad. Sci. U.S.A.',
        },
        location: {
          volume: '100',
          firstPage: '15577',
          lastPage: '15582',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '14671321',
          },
          {
            type: 'DOI',
            id: '10.1073/pnas.2536757100',
          },
        ],
      },
      scope: ['INTERACTION WITH DLX1'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2004',
        title:
          'Early hematopoietic zinc finger protein (EHZF), the human homolog to mouse Evi3, is highly expressed in primitive human hematopoietic cells.',
        authors: [
          'Bond H.M.',
          'Mesuraca M.',
          'Carbone E.',
          'Bonelli P.',
          'Agosti V.',
          'Amodio N.',
          'De Rosa G.',
          'Di Nicola M.',
          'Gianni A.M.',
          'Moore M.A.',
          'Hata A.',
          'Grieco M.',
          'Morrone G.',
          'Venuta S.',
        ],
        publication: {
          journalName: 'Blood',
        },
        location: {
          volume: '103',
          firstPage: '2062',
          lastPage: '2070',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '14630787',
          },
          {
            type: 'DOI',
            id: '10.1182/blood-2003-07-2388',
          },
        ],
      },
      scope: ['INTERACTION WITH ZNF521'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2005',
        title: 'Germ-layer specification and control of cell growth by Ectodermin, a Smad4 ubiquitin ligase.',
        authors: ['Dupont S.', 'Zacchigna L.', 'Cordenonsi M.', 'Soligo S.', 'Adorno M.', 'Rugge M.', 'Piccolo S.'],
        publication: {
          journalName: 'Cell',
        },
        location: {
          volume: '121',
          firstPage: '87',
          lastPage: '99',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '15820681',
          },
          {
            type: 'DOI',
            id: '10.1016/j.cell.2005.01.033',
          },
        ],
      },
      scope: ['INTERACTION WITH TRIM33'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2005',
        title: 'Nuclear targeting of transforming growth factor-beta-activated Smad complexes.',
        authors: ['Chen H.B.', 'Rud J.G.', 'Lin K.', 'Xu L.'],
        publication: {
          journalName: 'J. Biol. Chem.',
        },
        location: {
          volume: '280',
          firstPage: '21329',
          lastPage: '21336',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '15799969',
          },
          {
            type: 'DOI',
            id: '10.1074/jbc.M500362200',
          },
        ],
      },
      scope: ['SUBUNIT', 'SUBCELLULAR LOCATION'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2006',
        title: 'Potentiation of Smad-mediated transcriptional activation by the RNA-binding protein RBPMS.',
        authors: [
          'Sun Y.',
          'Ding L.',
          'Zhang H.',
          'Han J.',
          'Yang X.',
          'Yan J.',
          'Zhu Y.',
          'Li J.',
          'Song H.',
          'Ye Q.',
        ],
        publication: {
          journalName: 'Nucleic Acids Res.',
        },
        location: {
          volume: '34',
          firstPage: '6314',
          lastPage: '6326',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '17099224',
          },
          {
            type: 'DOI',
            id: '10.1093/nar/gkl914',
          },
        ],
      },
      scope: ['INTERACTION WITH RBPMS'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2007',
        title:
          '3-Phosphoinositide-dependent PDK1 negatively regulates transforming growth factor-beta-induced signaling in a kinase-dependent manner through physical interaction with Smad proteins.',
        authors: ['Seong H.A.', 'Jung H.', 'Kim K.T.', 'Ha H.'],
        publication: {
          journalName: 'J. Biol. Chem.',
        },
        location: {
          volume: '282',
          firstPage: '12272',
          lastPage: '12289',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '17327236',
          },
          {
            type: 'DOI',
            id: '10.1074/jbc.M609279200',
          },
        ],
      },
      scope: ['FUNCTION', 'SUBCELLULAR LOCATION', 'PHOSPHORYLATION BY PDPK1', 'INTERACTION WITH PDPK1'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2008',
        title: 'TAZ controls Smad nucleocytoplasmic shuttling and regulates human embryonic stem-cell self-renewal.',
        authors: [
          'Varelas X.',
          'Sakuma R.',
          'Samavarchi-Tehrani P.',
          'Peerani R.',
          'Rao B.M.',
          'Dembowy J.',
          'Yaffe M.B.',
          'Zandstra P.W.',
          'Wrana J.L.',
        ],
        publication: {
          journalName: 'Nat. Cell Biol.',
        },
        location: {
          volume: '10',
          firstPage: '837',
          lastPage: '848',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '18568018',
          },
          {
            type: 'DOI',
            id: '10.1038/ncb1748',
          },
        ],
      },
      scope: ['INTERACTION WITH WWTR1'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2009',
        title:
          'FAM/USP9x, a deubiquitinating enzyme essential for TGFbeta signaling, controls Smad4 monoubiquitination.',
        authors: [
          'Dupont S.',
          'Mamidi A.',
          'Cordenonsi M.',
          'Montagner M.',
          'Zacchigna L.',
          'Adorno M.',
          'Martello G.',
          'Stinchfield M.J.',
          'Soligo S.',
          'Morsut L.',
          'Inui M.',
          'Moro S.',
          'Modena N.',
          'Argenton F.',
          'Newfeld S.J.',
          'Piccolo S.',
        ],
        publication: {
          journalName: 'Cell',
        },
        location: {
          volume: '136',
          firstPage: '123',
          lastPage: '135',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '19135894',
          },
          {
            type: 'DOI',
            id: '10.1016/j.cell.2008.10.051',
          },
        ],
      },
      scope: ['INTERACTION WITH USP9X', 'UBIQUITINATION', 'MUTAGENESIS OF LYS-519'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2009',
        title: 'Lysine acetylation targets protein complexes and co-regulates major cellular functions.',
        authors: [
          'Choudhary C.',
          'Kumar C.',
          'Gnad F.',
          'Nielsen M.L.',
          'Rehman M.',
          'Walther T.C.',
          'Olsen J.V.',
          'Mann M.',
        ],
        publication: {
          journalName: 'Science',
        },
        location: {
          volume: '325',
          firstPage: '834',
          lastPage: '840',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '19608861',
          },
          {
            type: 'DOI',
            id: '10.1126/science.1175371',
          },
        ],
      },
      scope: [
        'ACETYLATION [LARGE SCALE ANALYSIS] AT LYS-37; LYS-428 AND LYS-507',
        'IDENTIFICATION BY MASS SPECTROMETRY [LARGE SCALE ANALYSIS]',
      ],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2011',
        title: 'Initial characterization of the human central proteome.',
        authors: [
          'Burkard T.R.',
          'Planyavsky M.',
          'Kaupe I.',
          'Breitwieser F.P.',
          'Buerckstuemmer T.',
          'Bennett K.L.',
          'Superti-Furga G.',
          'Colinge J.',
        ],
        publication: {
          journalName: 'BMC Syst. Biol.',
        },
        location: {
          volume: '5',
          firstPage: '17',
          lastPage: '17',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '21269460',
          },
          {
            type: 'DOI',
            id: '10.1186/1752-0509-5-17',
          },
        ],
      },
      scope: ['IDENTIFICATION BY MASS SPECTROMETRY [LARGE SCALE ANALYSIS]'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2011',
        title: 'Molecular genetic characterization of SMAD signaling molecules in pulmonary arterial hypertension.',
        authors: [
          'Nasim M.T.',
          'Ogo T.',
          'Ahmed M.',
          'Randall R.',
          'Chowdhury H.M.',
          'Snape K.M.',
          'Bradshaw T.Y.',
          'Southgate L.',
          'Lee G.J.',
          'Jackson I.',
          'Lord G.M.',
          'Gibbs J.S.',
          'Wilkins M.R.',
          'Ohta-Ogo K.',
          'Nakamura K.',
          'Girerd B.',
          'Coulet F.',
          'Soubrier F.',
          'Humbert M.',
          'Morrell N.W.',
          'Trembath R.C.',
          'Machado R.D.',
        ],
        publication: {
          journalName: 'Hum. Mutat.',
        },
        location: {
          volume: '32',
          firstPage: '1385',
          lastPage: '1389',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '21898662',
          },
          {
            type: 'DOI',
            id: '10.1002/humu.21605',
          },
        ],
      },
      scope: ['POSSIBLE INVOLVEMENT IN PULMONARY HYPERTENSION', 'VARIANT SER-13'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2014',
        title: 'Zinc finger protein 451 is a novel Smad corepressor in transforming growth factor-beta signaling.',
        authors: ['Feng Y.', 'Wu H.', 'Xu Y.', 'Zhang Z.', 'Liu T.', 'Lin X.', 'Feng X.H.'],
        publication: {
          journalName: 'J. Biol. Chem.',
        },
        location: {
          volume: '289',
          firstPage: '2072',
          lastPage: '2083',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '24324267',
          },
          {
            type: 'DOI',
            id: '10.1074/jbc.M113.526905',
          },
        ],
      },
      scope: ['INTERACTION WITH ZNF451', 'IDENTIFICATION IN A COMPLEX WITH ZNF451; SMAD3 AND SMAD2', 'SUBUNIT'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2014',
        title: 'An enzyme assisted RP-RPLC approach for in-depth analysis of human liver phosphoproteome.',
        authors: [
          'Bian Y.',
          'Song C.',
          'Cheng K.',
          'Dong M.',
          'Wang F.',
          'Huang J.',
          'Sun D.',
          'Wang L.',
          'Ye M.',
          'Zou H.',
        ],
        publication: {
          journalName: 'J. Proteomics',
        },
        location: {
          volume: '96',
          firstPage: '253',
          lastPage: '262',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '24275569',
          },
          {
            type: 'DOI',
            id: '10.1016/j.jprot.2013.11.014',
          },
        ],
      },
      source: {
        tissue: [
          {
            value: 'Liver',
          },
        ],
      },
      scope: ['IDENTIFICATION BY MASS SPECTROMETRY [LARGE SCALE ANALYSIS]'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2014',
        title: 'Uncovering global SUMOylation signaling networks in a site-specific manner.',
        authors: ['Hendriks I.A.', "D'Souza R.C.", 'Yang B.', 'Verlaan-de Vries M.', 'Mann M.', 'Vertegaal A.C.'],
        publication: {
          journalName: 'Nat. Struct. Mol. Biol.',
        },
        location: {
          volume: '21',
          firstPage: '927',
          lastPage: '936',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '25218447',
          },
          {
            type: 'DOI',
            id: '10.1038/nsmb.2890',
          },
        ],
      },
      scope: [
        'SUMOYLATION [LARGE SCALE ANALYSIS] AT LYS-113',
        'IDENTIFICATION BY MASS SPECTROMETRY [LARGE SCALE ANALYSIS]',
      ],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2014',
        title:
          'Sustained induction of collagen synthesis by TGF-beta requires regulated intramembrane proteolysis of CREB3L1.',
        authors: ['Chen Q.', 'Lee C.E.', 'Denard B.', 'Ye J.'],
        publication: {
          journalName: 'PLoS ONE',
        },
        location: {
          volume: '9',
          firstPage: 'E108528',
          lastPage: 'E108528',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '25310401',
          },
          {
            type: 'DOI',
            id: '10.1371/journal.pone.0108528',
          },
        ],
      },
      scope: ['INTERACTION WITH CREB3L1'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2015',
        title:
          'System-wide analysis of SUMOylation dynamics in response to replication stress reveals novel small ubiquitin-like modified target proteins and acceptor lysines relevant for genome stability.',
        authors: ['Xiao Z.', 'Chang J.G.', 'Hendriks I.A.', 'Sigurdsson J.O.', 'Olsen J.V.', 'Vertegaal A.C.'],
        publication: {
          journalName: 'Mol. Cell. Proteomics',
        },
        location: {
          volume: '14',
          firstPage: '1419',
          lastPage: '1434',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '25755297',
          },
          {
            type: 'DOI',
            id: '10.1074/mcp.O114.044792',
          },
        ],
      },
      scope: [
        'SUMOYLATION [LARGE SCALE ANALYSIS] AT LYS-113',
        'IDENTIFICATION BY MASS SPECTROMETRY [LARGE SCALE ANALYSIS]',
      ],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2016',
        title: 'Mutations in nuclear pore genes NUP93, NUP205 and XPO5 cause steroid-resistant nephrotic syndrome.',
        authors: [
          'Braun D.A.',
          'Sadowski C.E.',
          'Kohl S.',
          'Lovric S.',
          'Astrinidis S.A.',
          'Pabst W.L.',
          'Gee H.Y.',
          'Ashraf S.',
          'Lawson J.A.',
          'Shril S.',
          'Airik M.',
          'Tan W.',
          'Schapiro D.',
          'Rao J.',
          'Choi W.I.',
          'Hermle T.',
          'Kemper M.J.',
          'Pohl M.',
          'Ozaltin F.',
          'Konrad M.',
          'Bogdanovic R.',
          'Buescher R.',
          'Helmchen U.',
          'Serdaroglu E.',
          'Lifton R.P.',
          'Antonin W.',
          'Hildebrandt F.',
        ],
        publication: {
          journalName: 'Nat. Genet.',
        },
        location: {
          volume: '48',
          firstPage: '457',
          lastPage: '465',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '26878725',
          },
          {
            type: 'DOI',
            id: '10.1038/ng.3512',
          },
        ],
      },
      scope: ['INTERACTION WITH NUP93 AND IPO7'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2017',
        title: 'Site-specific mapping of the human SUMO proteome reveals co-modification with phosphorylation.',
        authors: ['Hendriks I.A.', 'Lyon D.', 'Young C.', 'Jensen L.J.', 'Vertegaal A.C.', 'Nielsen M.L.'],
        publication: {
          journalName: 'Nat. Struct. Mol. Biol.',
        },
        location: {
          volume: '24',
          firstPage: '325',
          lastPage: '336',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '28112733',
          },
          {
            type: 'DOI',
            id: '10.1038/nsmb.3366',
          },
        ],
      },
      scope: [
        'SUMOYLATION [LARGE SCALE ANALYSIS] AT LYS-113',
        'IDENTIFICATION BY MASS SPECTROMETRY [LARGE SCALE ANALYSIS]',
      ],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '1997',
        title: 'A structural basis for mutational inactivation of the tumour suppressor Smad4.',
        authors: ['Shi Y.', 'Hata A.', 'Lo R.S.', 'Massague J.', 'Pavletich N.P.'],
        publication: {
          journalName: 'Nature',
        },
        location: {
          volume: '388',
          firstPage: '87',
          lastPage: '93',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '9214508',
          },
          {
            type: 'DOI',
            id: '10.1038/40431',
          },
        ],
      },
      scope: ['X-RAY CRYSTALLOGRAPHY (2.1 ANGSTROMS) OF 319-543'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '1999',
        title: 'Crystal structure of a transcriptionally active Smad4 fragment.',
        authors: ['Qin B.', 'Lam S.S.', 'Lin K.'],
        publication: {
          journalName: 'Structure',
        },
        location: {
          volume: '7',
          firstPage: '1493',
          lastPage: '1503',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '10647180',
          },
          {
            type: 'DOI',
            id: '10.1016/S0969-2126(00)88340-9',
          },
        ],
      },
      scope: ['X-RAY CRYSTALLOGRAPHY (2.6 ANGSTROMS) OF 285-552'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2001',
        title: 'The L3 loop and C-terminal phosphorylation jointly define Smad protein trimerization.',
        authors: ['Chacko B.M.', 'Qin B.', 'Correia J.J.', 'Lam S.S.', 'de Caestecker M.P.', 'Lin K.'],
        publication: {
          journalName: 'Nat. Struct. Biol.',
        },
        location: {
          volume: '8',
          firstPage: '248',
          lastPage: '253',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '11224571',
          },
          {
            type: 'DOI',
            id: '10.1038/84995',
          },
        ],
      },
      scope: [
        'X-RAY CRYSTALLOGRAPHY (3 ANGSTROMS) OF 273-552 OF WILD TYPE AND MUTANTS ARG-416; ARG-502 AND ARG-515 IN COMPLEX WITH SMAD3',
        'SUBUNIT',
        'MUTAGENESIS OF ARG-416; ARG-502 AND ARG-515',
      ],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2004',
        title: 'Structural basis of heteromeric smad protein assembly in TGF-beta signaling.',
        authors: [
          'Chacko B.M.',
          'Qin B.Y.',
          'Tiwari A.',
          'Shi G.',
          'Lam S.',
          'Hayward L.J.',
          'De Caestecker M.',
          'Lin K.',
        ],
        publication: {
          journalName: 'Mol. Cell',
        },
        location: {
          volume: '15',
          firstPage: '813',
          lastPage: '823',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '15350224',
          },
          {
            type: 'DOI',
            id: '10.1016/j.molcel.2004.07.016',
          },
        ],
      },
      scope: ['X-RAY CRYSTALLOGRAPHY (2.6 ANGSTROMS) OF 314-552 IN COMPLEX WITH SMAD2 OR SMAD3', 'SUBUNIT'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '1998',
        title: 'Mutations in DPC4 (SMAD4) cause juvenile polyposis syndrome, but only account for a minority of cases.',
        authors: [
          'Houlston R.',
          'Bevan S.',
          'Williams A.',
          'Young J.',
          'Dunlop M.',
          'Rozen P.',
          'Eng C.',
          'Markie D.',
          'Woodford-Richens K.',
          'Rodriguez-Bigas M.A.',
          'Leggett B.',
          'Neale K.',
          'Phillips R.',
          'Sheridan E.',
          'Hodgson S.',
          'Iwama T.',
          'Eccles D.',
          'Bodmer W.',
          'Tomlinson I.',
        ],
        publication: {
          journalName: 'Hum. Mol. Genet.',
        },
        location: {
          volume: '7',
          firstPage: '1907',
          lastPage: '1912',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '9811934',
          },
          {
            type: 'DOI',
            id: '10.1093/hmg/7.12.1907',
          },
        ],
      },
      scope: ['VARIANT JPS CYS-361'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2002',
        title: 'Germline SMAD4 or BMPR1A mutations and phenotype of juvenile polyposis.',
        authors: [
          'Sayed M.G.',
          'Ahmed A.F.',
          'Ringold J.R.',
          'Anderson M.E.',
          'Bair J.L.',
          'Mitros F.A.',
          'Lynch H.T.',
          'Tinley S.T.',
          'Petersen G.M.',
          'Giardiello F.M.',
          'Vogelstein B.',
          'Howe J.R.',
        ],
        publication: {
          journalName: 'Ann. Surg. Oncol.',
        },
        location: {
          volume: '9',
          firstPage: '901',
          lastPage: '906',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '12417513',
          },
          {
            type: 'DOI',
            id: '10.1007/BF02557528',
          },
        ],
      },
      scope: ['VARIANTS JPS GLY-330 AND ARG-352'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2004',
        title:
          'A combined syndrome of juvenile polyposis and hereditary haemorrhagic telangiectasia associated with mutations in MADH4 (SMAD4).',
        authors: [
          'Gallione C.J.',
          'Repetto G.M.',
          'Legius E.',
          'Rustgi A.K.',
          'Schelley S.L.',
          'Tejpar S.',
          'Mitchell G.',
          'Drouin E.',
          'Westermann C.J.J.',
          'Marchuk D.A.',
        ],
        publication: {
          journalName: 'Lancet',
        },
        location: {
          volume: '363',
          firstPage: '852',
          lastPage: '859',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '15031030',
          },
          {
            type: 'DOI',
            id: '10.1016/S0140-6736(04)15732-2',
          },
        ],
      },
      scope: ['VARIANTS JP/HHT ARG-352 AND ASP-386'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2006',
        title: 'The consensus coding sequences of human breast and colorectal cancers.',
        authors: [
          'Sjoeblom T.',
          'Jones S.',
          'Wood L.D.',
          'Parsons D.W.',
          'Lin J.',
          'Barber T.D.',
          'Mandelker D.',
          'Leary R.J.',
          'Ptak J.',
          'Silliman N.',
          'Szabo S.',
          'Buckhaults P.',
          'Farrell C.',
          'Meeh P.',
          'Markowitz S.D.',
          'Willis J.',
          'Dawson D.',
          'Willson J.K.V.',
          'Gazdar A.F.',
          'Hartigan J.',
          'Wu L.',
          'Liu C.',
          'Parmigiani G.',
          'Park B.H.',
          'Bachman K.E.',
          'Papadopoulos N.',
          'Vogelstein B.',
          'Kinzler K.W.',
          'Velculescu V.E.',
        ],
        publication: {
          journalName: 'Science',
        },
        location: {
          volume: '314',
          firstPage: '268',
          lastPage: '274',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '16959974',
          },
          {
            type: 'DOI',
            id: '10.1126/science.1133427',
          },
        ],
      },
      scope: ['VARIANTS [LARGE SCALE ANALYSIS] SER-130; ASN-351 AND HIS-361', 'INVOLVEMENT IN COLORECTAL CANCER'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2012',
        title: 'A restricted spectrum of mutations in the SMAD4 tumor-suppressor gene underlies Myhre syndrome.',
        authors: [
          'Caputo V.',
          'Cianetti L.',
          'Niceta M.',
          'Carta C.',
          'Ciolfi A.',
          'Bocchinfuso G.',
          'Carrani E.',
          'Dentici M.L.',
          'Biamino E.',
          'Belligni E.',
          'Garavelli L.',
          'Boccone L.',
          'Melis D.',
          'Andria G.',
          'Gelb B.D.',
          'Stella L.',
          'Silengo M.',
          'Dallapiccola B.',
          'Tartaglia M.',
        ],
        publication: {
          journalName: 'Am. J. Hum. Genet.',
        },
        location: {
          volume: '90',
          firstPage: '161',
          lastPage: '169',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '22243968',
          },
          {
            type: 'DOI',
            id: '10.1016/j.ajhg.2011.12.011',
          },
        ],
      },
      scope: ['VARIANTS MYHRS THR-500 AND VAL-500'],
    },
    {
      citation: {
        type: 'journal article',
        publicationDate: '2012',
        title: 'Mutations at a single codon in Mad homology 2 domain of SMAD4 cause Myhre syndrome.',
        authors: [
          'Le Goff C.',
          'Mahaut C.',
          'Abhyankar A.',
          'Le Goff W.',
          'Serre V.',
          'Afenjar A.',
          'Destree A.',
          'di Rocco M.',
          'Heron D.',
          'Jacquemont S.',
          'Marlin S.',
          'Simon M.',
          'Tolmie J.',
          'Verloes A.',
          'Casanova J.L.',
          'Munnich A.',
          'Cormier-Daire V.',
        ],
        publication: {
          journalName: 'Nat. Genet.',
        },
        location: {
          volume: '44',
          firstPage: '85',
          lastPage: '88',
        },
        dbReferences: [
          {
            type: 'PubMed',
            id: '22158539',
          },
          {
            type: 'DOI',
            id: '10.1038/ng.1016',
          },
        ],
      },
      scope: ['VARIANTS MYHRS MET-500; THR-500 AND VAL-500', 'CHARACTERIZATION OF VARIANT MYHRS THR-500'],
    },
  ],
  sequence: {
    version: 1,
    length: 552,
    mass: 60439,
    modified: '1996-11-01',
    sequence:
      'MDNMSITNTPTSNDACLSIVHSLMCHRQGGESETFAKRAIESLVKKLKEKKDELDSLITAITTNGAHPSKCVTIQRTLDGRLQVAGRKGFPHVIYARLWRWPDLHKNELKHVKYCQYAFDLKCDSVCVNPYHYERVVSPGIDLSGLTLQSNAPSSMMVKDEYVHDFEGQPSLSTEGHSIQTIQHPPSNRASTETYSTPALLAPSESNATSTANFPNIPVASTSQPASILGGSHSEGLLQIASGPQPGQQQNGFTGQPATYHHNSTTTWTGSRTAPYTPNLPHHQNGHLQHHPPMPPHPGHYWPVHNELAFQPPISNHPAPEYWCSIAYFEMDVQVGETFKVPSSCPIVTVDGYVDPSGGDRFCLGQLSNVHRTEAIERARLHIGKGVQLECKGEGDVWVRCLSDHAVFVQSYYLDREAGRAPGDAVHKIYPSAYIKVFDLRQCHRQMQQQAATAQAAAAAQAAAVAGNIPGPGSVGGIAPAISLSAAAGIGVDDLRRLCILRMSFVKGWGPDYPRQSIKETPCWIEIHLHRALQLLDEVLHTMPIADPQPLD',
  },
};
