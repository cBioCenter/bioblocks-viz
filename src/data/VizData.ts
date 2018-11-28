export interface IVizData {
  name: string;
  authors: string[];
  listAsOriginal: boolean;
  relevantData: string;
  summary: string;
}

const anatomogram: IVizData = {
  authors: ['Alfonso Muñoz-Pomer Fuentes'],
  listAsOriginal: true,
  name: 'Anatomogram',
  relevantData: 'scRNA-seq',
  summary: 'Interactive anatomical diagram.',
};

const spring: IVizData = {
  authors: ['caleb weinreb', 'samuel wolock', 'allon klein'],
  listAsOriginal: false,
  name: 'SPRING',
  relevantData: 'scRNA-seq',
  summary: 'SPRING is a tool for uncovering high-dimensional structure in single-cell expression data.',
};

const tfjsTsne: IVizData = {
  authors: ['Yannick Assogba'],
  listAsOriginal: true,
  name: 'tfjs-tsne',
  relevantData: 'scRNA-seq',
  summary: 'Improved tSNE implementation that runs in the browser.',
};

export const VizData = {
  anatomogram,
  spring,
  tfjsTsne,
};
