// Type definitions for Chell Visualization Library
// Project: https://github.com/cBioCenter/chell-viz
// Definitions by: cBioCenter @ Dana-Farber <https://github.com/cBioCenter/>, James Lindsay <https://github.com/jim-bo>, Nick Gauthier <https://github.com/npgauth>, Drew Diamantoukos <https://github.com/MercifulCode>,
// TypeScript Version: 2.8
import { Structure } from 'ngl';
import { ISpringGraphData } from 'spring';
import Chell1DSection from './Chell1DSection';
import { ChellPDB } from './ChellPDB';
import { CouplingContainer } from './CouplingContainer';

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
  couplingScores: CouplingContainer;
  pdbData?: ChellPDB;
  secondaryStructures: ISecondaryStructureData[];
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

export enum CONTACT_DISTANCE_PROXIMITY {
  CLOSEST = 'CLOSEST',
  C_ALPHA = 'C-α',
}

export enum CONFIGURATION_COMPONENT_TYPE {
  RADIO = 'RADIO',
  SLIDER = 'SLIDER',
}

export interface ISecondaryStructureData {
  resno: number;
  structId: SECONDARY_STRUCTURE_KEYS;
}

export type SECONDARY_STRUCTURE_SECTION = Chell1DSection<SECONDARY_STRUCTURE_KEYS>;
export type SECONDARY_STRUCTURE = Array<Chell1DSection<SECONDARY_STRUCTURE_KEYS>>;

export interface IResiduePair {
  i: number;
  j: number;
}

export enum SECONDARY_STRUCTURE_CODES {
  'G' = '310_HELIX',
  'H' = 'ALPHA_HELIX',
  'I' = 'PI_HELIX',
  'T' = 'HYDROGEN_BONDED_TURN',
  'E' = 'BETA_SHEET',
  'B' = 'BETA_BRIDGE',
  'S' = 'BEND',
  'C' = 'COIL',
}

export type SECONDARY_STRUCTURE_KEYS = keyof typeof SECONDARY_STRUCTURE_CODES;

export interface ISecondaryStructure {
  code: SECONDARY_STRUCTURE_CODES;
  name: string;
  minResidueLength: number;
}
