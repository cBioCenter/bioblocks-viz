import { Structure } from 'ngl';
import { ISpringGraphData } from 'spring';
export declare type CONTACT_MAP_DATA_TYPE = IContactMapData;
export declare type NGL_DATA_TYPE = Structure;
export declare type SPRING_DATA_TYPE = ISpringGraphData;
export declare type T_SNE_DATA_TYPE = number[][];
export declare type CHELL_DATA_TYPE = CONTACT_MAP_DATA_TYPE | NGL_DATA_TYPE | SPRING_DATA_TYPE | T_SNE_DATA_TYPE;
/** Shared data between Spring/T-SNE. Refers to index in points collection. */
export declare type CELL_TYPE = number;
export declare type RESIDUE_TYPE = number;
export declare enum VIZ_TYPE {
  CONTACT_MAP = 'Contact Map',
  NGL = 'NGL',
  SPRING = 'Spring',
  'T-SNE' = 'T-SNE',
}
export interface IContactMapData {
  contactMonomer: IMonomerContact[];
  couplingScore: ICouplingScore[];
  distanceMapMonomer?: IDistanceMapMonomer[];
}
export interface IMonomerContact {
  i: number;
  j: number;
  dist: number;
}
export interface ICouplingScore {
  i: number;
  A_i: string;
  j: number;
  A_j: string;
  fn: number;
  cn: number;
  segment_i: string;
  segment_j: string;
  probability: number;
  dist_intra: number;
  dist_multimer: number;
  dist: number;
  precision: number;
}
export interface IDistanceMapMonomer {
  id: number;
  sec_struct_3state: string;
}
export interface IResiduePair {
  i: number;
  j: number;
}
