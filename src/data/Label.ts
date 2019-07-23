export interface ILabel {
  name: string;
  color: string;
  shape?: string;
}

export interface ILabelCategory {
  [category: string]: {
    [label: string]: ILabel;
  };
}

/*
const tabula: ILabelCategory[] = [
  {
    cell_ontology_class: {
      Langerhans: {
        color: 'red',
      },
      'B cell': {
        color: '#5cff9a',
      },
    },
  },
];
*/
