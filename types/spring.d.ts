declare module 'spring' {
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
    links: ISpringLink[];
  }

  export interface ISpringLink {
    distance: number;
    source: ISpringNode | number | string;
    target: ISpringNode | number | string;
  }

  export interface ISpringNode {
    category: string;
    colorHex: number;
    fixed: boolean;
    name: string;
    number: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
  }
}
