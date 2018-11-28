export interface IVizSummaryData {
  authors: string[];
  listAsOriginal: boolean;
  name: string;
  relevantData: string;
  summary: string;
}

export interface IVizOverviewData extends IVizSummaryData {
  citations: Array<{
    fullCitation: string;
    link: string;
  }>;
  compatibility: string[];
  detailedSummary: string;
  repo: {
    version: string;
    lastUpdate: string;
    link: string;
  };
}

const anatomogram: IVizOverviewData = {
  authors: ['Alfonso Muñoz-Pomer Fuentes'],
  citations: [],
  compatibility: [],
  detailedSummary: '',
  listAsOriginal: true,
  name: 'Anatomogram',
  relevantData: 'scRNA-seq',
  repo: { lastUpdate: '', link: 'https://github.com/ebi-gene-expression-group/anatomogram', version: '' },
  summary: 'Interactive anatomical diagram.',
};

const spring: IVizOverviewData = {
  authors: ['caleb weinreb', 'samuel wolock', 'allon klein'],
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
