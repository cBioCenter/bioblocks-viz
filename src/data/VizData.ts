export interface IVizSummaryData {
  authors: string[];
  listAsOriginal: boolean;
  name: string;
  relevantData: string;
  summary: string;
}

export interface IVizExample {
  icon: string;
  name: string;
  link: string;
  summary: string;
}

export interface IVizOverviewData extends IVizSummaryData {
  citations: Array<{
    fullCitation: string;
    link: string;
  }>;
  compatibility: string[];
  detailedSummary: string;
  examples: IVizExample[];
  repo: {
    version: string;
    lastUpdate: string;
    link: string;
  };
}

const springExamples = [
  {
    icon: 'assets/icons/example_hpc_sf2-spring.png',
    link: '/dataset?name=hpc_sf2/full&viz=spring',
    name: 'HPC (hematopoietic progenitor cells)',
    summary:
      'Analysis of 33,473 hematopoietic progenitor cells as they differentiate over 6 days.\
       Barcodes were introduced at day 0 and cell lineage relationships were traced by\
       identifying progeny from their barcodes in scRNAseq of aliquots of the same population taken at several timepoints.',
  },
  {
    icon: 'assets/icons/tabula-muris-thumbnail.png',
    link: '/dataset?name=tabula_muris/10k&viz=spring',
    name: 'CZI Tabula muris',
    summary: 'Analysis of 10K mouse cells from 20 organs and tissues.',
  },
  {
    icon: 'assets/icons/example_tabularmuris_spring-tsne-anatomogram.png',
    link: '/dataset?name=tabula_muris/10k&viz=spring&viz=tfjs-tsne&viz=anatomogram',
    name: 'Tabula Muris - SPRING vs tSNE with Anatomogram',
    summary:
      'Example comparison of data reduction techniques SPRING and tSNE\
    (of top 30 PCA components), on RNAseq profiles from 10000 cells\
    from the CZI Tabula muris dataset. Also includes anatomogram visualization for selection of tissue types.',
  },
  {
    icon: 'assets/icons/example_HPC_spring-tsne-anatomogram.png',
    link: '/dataset?name=hpc/full&viz=spring&viz=tfjs-tsne&viz=anatomogram',
    name: 'HPC - SPRING vs tSNE with Anatomogram',
    summary: 'Example interaction between SPRING, tSNE and Anatomogram visualization on a small dataset.',
  },
];

const anatomogram: IVizOverviewData = {
  authors: ['Alfonso Muñoz-Pomer Fuentes'],
  citations: [],
  compatibility: [],
  detailedSummary: '',
  examples: [springExamples[2]],
  listAsOriginal: true,
  name: 'Anatomogram',
  relevantData: 'scRNA-seq',
  repo: { lastUpdate: '', link: 'https://github.com/ebi-gene-expression-group/anatomogram', version: '' },
  summary: 'Interactive anatomical diagram.',
};

const spring: IVizOverviewData = {
  authors: ['Caleb Weinreb', 'Samuel Wolock', 'Allon Klein'],
  citations: [
    {
      fullCitation:
        'Weinreb, Caleb, Samuel Wolock, and Allon M. Klein.\
      "SPRING: A kinetic interface for visualizing high dimensional single-cell expression data."\
      Bioinformatics 34.7 (2017): 1246-1248.',
      link: 'https://www.ncbi.nlm.nih.gov/pubmed/29228172',
    },
  ],
  compatibility: ['live tSNE', 'UMAP', 'PCA'],
  detailedSummary:
    'SPRING is a tool for uncovering high-dimensional structure in single-cell gene expression data.\
   SPRING takes a (gene X cell) table of expression measurements and outputs a k-nearest-neighbor graph\
   rendered using a force directed layout.\
   Users can overlay prior information, including gene expression values, gene-set scores, cell cluster labels and sample IDs.\
   Users can also upload custom coordinates that have been generated using an outside program such as tSNE.',
  examples: springExamples,
  listAsOriginal: false,
  name: 'SPRING',
  relevantData: 'scRNA-seq',
  repo: {
    lastUpdate: '2018.03.12',
    link: 'https://github.com/AllonKleinLab/SPRING_dev',
    version: '2.0',
  },
  summary: 'SPRING is a tool for uncovering high-dimensional structure in single-cell expression data.',
};

const tfjsTsne: IVizOverviewData = {
  authors: ['Yannick Assogba'],
  citations: [],
  compatibility: [],
  detailedSummary: '',
  examples: [springExamples[2], springExamples[3]],
  listAsOriginal: true,
  name: 'tfjs-tsne',
  relevantData: 'scRNA-seq',
  repo: { lastUpdate: '', link: 'https://github.com/tensorflow/tfjs-tsne', version: '' },
  summary: 'Improved tSNE implementation that runs in the browser.',
};

export const VizData: { [key: string]: IVizOverviewData } = {
  anatomogram,
  spring,
  'tfjs-tsne': tfjsTsne,
  tfjsTsne,
};

export interface IStory {
  authors: string[];
  description: string;
  icon: string;
  link: string;
  title: string;
}

export const Stories: IStory[] = [
  {
    authors: ['Caleb Weinreb', 'Samuel Wolock', 'Allon Klein'],
    description:
      'Analysis of 33,473 hematopoietic progenitor cells as they differentiate over 6 days.\
       Barcodes were introduced at day 0 and cell lineage relationships were traced by\
       identifying progeny from their barcodes in scRNAseq of aliquots of the same population taken at several timepoints.',
    icon: 'assets/icons/example_hpc_sf2-spring.png',
    link: '/dataset?name=hpc_sf2/full&viz=spring',
    title: 'Trajectory analysis of differentiating HPCs',
  },
  {
    authors: ['Drew Diamantoukos', 'Nicholas Gauthier'],
    description: 'Analysis of single cell transcriptomics of 20 mouse organs\
    from the tabula muris project.',
    icon: 'assets/icons/example_tabularmuris_spring-tsne-anatomogram.png',
    link: '/dataset?name=tabula_muris/10k&viz=spring&viz=tfjs-tsne&viz=anatomogram',
    title: 'Dimensionality-reduction analysis of tabula muris',
  },
];

export interface IDatasetInfo {
  authors: string[];
  links: {
    detail: string;
    analysis: string;
  };
  name: string;
  summary: string;
}

export const userDatasets: IDatasetInfo[] = [
  {
    authors: ['Caleb Weinreb', 'Samuel Wolock', 'Allon klein'],
    links: {
      analysis: '',
      detail: '',
    },
    name: 'Differentiating hematopoietic cells',
    summary:
      'Hematopoietic cells were subjected to barcoding and\
aliquots were subjected to scRNAseq as they underwent\
differentiation.',
  },
  {
    authors: ['The Tabula Muris Consortium'],
    links: {
      analysis: '',
      detail: '',
    },
    name: 'Tabula muris - scRNAseq of 20 mouse organs',
    summary:
      'A compendium of single-cell transcriptomic data from the\
  model organism Mus musculus that comprises more than\
  100,000 cells from 20 organs and tissues',
  },
];

export interface IDatasetModalItem {
  description: string;
  enabled: boolean;
  fullName: string;
  serverNeeded: boolean;
}

export const DatasetData: { [key: string]: IDatasetModalItem } = {
  'hpc/full': {
    description: 'Analysis of the RNAseq proles from 4790 hematopoietic progenitor cells',
    enabled: true,
    fullName: 'Hematopoietic progenitor cells',
    serverNeeded: false,
  },
  'hpc_sf2/full': {
    description:
      'Analysis of 33,473 the transcriptional prole of hematopoietic\
    progenitor cells as they dierentiate over 6 days',
    enabled: true,
    fullName: 'Hematopoietic progenitor cells',
    serverNeeded: false,
  },
  'tabula_muris/10k': {
    description:
      'A subset pf 10,000 randomly sampled cells taken from the full\
  tabula_muris dataset (20 organs and tissues from Mus musculus)',
    enabled: true,
    fullName: 'Tabula muris',
    serverNeeded: false,
  },
  'tabula_muris/full': {
    description:
      'A compendium of single-cell transcriptomic data from the\
  model organism Mus musculus that comprises more than\
  100,000 cells from 20 organs and tissues',
    enabled: false,
    fullName: 'Tabula muris',
    serverNeeded: true,
  },
  'tabula_muris/lung': {
    description: 'Analysis of the RNAseq proles from 4790 hematopoietic\
  progenitor cells',
    enabled: false,
    fullName: 'Tabula muris',
    serverNeeded: true,
  },
};
