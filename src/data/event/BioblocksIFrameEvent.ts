import {
  IAnatomogramContainerProps,
  IContactMapContainerProps,
  INGLContainerProps,
  ISpringContainerProps,
  ITensorContainerProps,
  IUMAPSequenceContainerProps,
  IUMAPTranscriptionalContainerProps,
} from '~bioblocks-viz~/container';
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

export type VIZ_PROPS_DATA_TYPE<T = unknown> = T extends VIZ_TYPE.SPRING
  ? ISpringContainerProps
  : T extends VIZ_TYPE.UMAP_SEQUENCE
  ? IUMAPSequenceContainerProps
  : T extends VIZ_TYPE.UMAP_TRANSCRIPTION
  ? IUMAPTranscriptionalContainerProps
  : T extends VIZ_TYPE.NGL
  ? INGLContainerProps
  : T extends VIZ_TYPE.CONTACT_MAP
  ? IContactMapContainerProps
  : T extends VIZ_TYPE.T_SNE
  ? ITensorContainerProps
  : T extends VIZ_TYPE.ANATOMOGRAM
  ? IAnatomogramContainerProps
  : Record<string, any>;

export interface IFrameEvent<T extends VIZ_TYPE> extends MessageEvent {
  data: { props: VIZ_PROPS_DATA_TYPE<T>; viz: T } & VIZ_EVENT_DATA_TYPE<T>;
}
