// Type definitions for Chell Visualization Library
// Project: https://github.com/cBioCenter/chell-viz
// Definitions by: cBioCenter @ Dana-Farber <https://github.com/cBioCenter/>, James Lindsay <https://github.com/jim-bo>, Nick Gauthier <https://github.com/npgauth>, Drew Diamantoukos <https://github.com/MercifulCode>,
// TypeScript Version: 2.8
import { Structure } from 'ngl';
import { ISpringGraphData } from 'spring';

export type CONTACT_MAP_DATA_TYPE = IContactMapData;
export type NGL_DATA_TYPE = Structure;
export type SPRING_DATA_TYPE = ISpringGraphData;
export type T_SNE_DATA_TYPE = number[][];

export type CHELL_DATA_TYPE = CONTACT_MAP_DATA_TYPE | NGL_DATA_TYPE | SPRING_DATA_TYPE | T_SNE_DATA_TYPE;

// TODO Better define Cell type to not be indices.
/** Shared data between Spring/T-SNE. Refers to index in points collection. */
export type CELL_TYPE = number;
export type RESIDUE_TYPE = number;

export enum VIZ_TYPE {
  CONTACT_MAP = 'Contact Map',
  NGL = 'NGL',
  SPRING = 'Spring',
  'T-SNE' = 'T-SNE',
}

export interface IContactMapData {
  couplingScores: ICouplingScore[];
}

export interface IMonomerContact {
  i: number;
  j: number;
  dist: number;
}

export interface ICouplingScore {
  i: number;
  A_i?: string;
  j: number;
  A_j?: string;
  fn?: number;
  cn?: number;
  segment_i?: string;
  segment_j?: string;
  probability?: number;
  dist_intra?: number;
  dist_multimer?: number;
  dist: number;
  precision?: number;
}

export interface IDistanceMapMonomer {
  id: number;
  sec_struct_3state: string;
}

export interface IResiduePair {
  i: number;
  j: number;
}
