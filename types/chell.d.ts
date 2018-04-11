// Type definitions for Chell Visualization Library
// Project: https://github.com/cBioCenter/chell-viz
// Definitions by: cBioCenter @ Dana-Farber <https://github.com/cBioCenter/>, James Lindsay <https://github.com/jim-bo>, Nick Gauthier <https://github.com/npgauth>, Drew Diamantoukos <https://github.com/MercifulCode>,
// TypeScript Version: 2.8

declare module 'chell' {
  type CONTACT_MAP_DATA_TYPE = IContactMapData;

  interface IContactMapData {
    contactMonomer: IMonomerContact[];
    couplingScore: ICouplingScore[];
    distanceMapMonomer: IDistanceMapMonomer[];
  }

  interface IMonomerContact {
    i: number;
    j: number;
    dist: number;
  }

  interface ICouplingScore {
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

  interface IDistanceMapMonomer {
    id: number;
    sec_struct_3state: string;
  }
}
