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
    icon: 'assets/icons/example_spring-hpc.png',
    link: '/dataset?name=hpc/full&viz=spring',
    name: 'HPC (hematopoietic progenitor cells)',
    summary: 'Analysis of the RNAseq profiles from 4790 hematopoietic progenitor cells.',
  },
  {
    icon: 'assets/icons/tabula-muris-thumbnail.png',
    link: '/dataset?name=tabula_muris/full&viz=spring',
    name: 'CZI Tabula muris',
    summary: 'Analysis of ~100K mouse cells from 20 organs and tissues.',
  },
  {
    icon: 'assets/icons/example_spring-tsne-anatomogram.png',
    link: '/dataset?name=tabula_muris/full&viz=spring&viz=tfjs-tsne&viz=anatomogram',
    name: 'SPRING vs tSNE with Anatomogram',
    summary:
      'Example comparison of data reduction techniques SPRING and tSNE\
    (of top 30 PCA components), on RNAseq profiles from 56778 cells\
    from the CZI Tabula muris dataset. Also includes anatomogram visualization for selection of tissue types.',
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
  examples: [springExamples[2]],
  listAsOriginal: true,
  name: 'tfjs-tsne',
  relevantData: 'scRNA-seq',
  repo: { lastUpdate: '', link: 'https://github.com/tensorflow/tfjs-tsne', version: '' },
  summary: 'Improved tSNE implementation that runs in the browser.',
};

export const VizData = {
  anatomogram,
  spring,
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
      'We analyze scRNA seq of ~5000 differentiating\
    hematopoietic cells using SPRING - a tool for uncovering\
    high-dimensional structure in single-cell gene expression data.',
    icon: 'assets/icons/example_spring-hpc.png',
    link: '/dataset?name=hpc/full&viz=spring',
    title: 'Trajectory analysis of differentiating HPCs',
  },
  {
    authors: ['Drew Diamantoukos', 'Nicholas Gauthier'],
    description: 'Analysis of single cell transcriptomics of 20 mouse organs\
    from the tabula muris project.',
    icon: 'assets/icons/example_spring-tsne-anatomogram.png',
    link: '/dataset?name=tabula_muris/full&viz=spring&viz=tfjs-tsne&viz=anatomogram',
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
