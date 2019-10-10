import { VIZ_TYPE } from '~bioblocks-viz~/data';

export interface IUMapEventData {
  annotations?: string[];
  names: string[];
  seqs: string[];
}

export interface ISpringEventData {
  // tslint:disable-next-line:no-reserved-keywords
  type: string;
  payload: {
    currentCategory?: string;
    indices: number[];
    selectedLabel: string;
  };
}

export type VIZ_EVENT_DATA_TYPE<T = unknown> = T extends VIZ_TYPE.SPRING
  ? ISpringEventData
  : T extends VIZ_TYPE.UMAP_SEQUENCE
  ? IUMapEventData
  : Record<string, any>;

export interface IFrameEvent<T extends VIZ_TYPE> extends MessageEvent {
  data: { props: any; viz: T } & VIZ_EVENT_DATA_TYPE<T>;
}
