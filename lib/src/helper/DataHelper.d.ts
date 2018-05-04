import { IContactMapData, VIZ_TYPE } from 'chell';
import * as NGL from 'ngl';
import { ISpringGraphData } from 'spring';
export declare const fetchAppropriateData: (
  viz: VIZ_TYPE,
  dataDir: string,
) => Promise<IContactMapData | NGL.Structure | ISpringGraphData | number[][]>;
export declare const fetchColorData: (
  file: string,
) => Promise<{
  [k: string]: any;
}>;
