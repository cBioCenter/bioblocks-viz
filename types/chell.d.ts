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
