// ~bb-viz~
// Label
// Interfaces to abstract association between categories, their labels, and the style of said labels.
// ~bb-viz~

export interface ILabel {
  name: string;
  color: string;
  lineColor?: string;
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
