export interface ISpringCategoricalColorDataInput {
  [k: string]: {
    label_colors: { [key: string]: string | number };
    label_list: string[];
  };
}

export interface ISpringCategoricalColorData {
  label_colors: { [key: string]: number };
  label_list: string[];
}

export interface ISpringGraphData {
  nodes: ISpringNode[];
  links?: ISpringLink[];
}

export interface ISpringLink {
  distance: number;
  source: ISpringNode | number | string;
  target: ISpringNode | number | string;
}

export interface ISpringNode {
  labelForCategory: { [key: string]: string };
  // tslint:disable-next-line:no-reserved-keywords
  number: number;
}
