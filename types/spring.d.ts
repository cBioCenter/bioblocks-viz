declare module 'spring' {
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
    fixed: boolean;
    name: string;
    number: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
  }
}
