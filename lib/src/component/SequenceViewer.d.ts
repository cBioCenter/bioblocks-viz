/// <reference types="react" />
import * as NGL from 'ngl';
import * as React from 'react';
export interface ISequenceViewerProps {
  data?: NGL.Structure;
  selectedResNum?: number;
  onSeqHoverCallback?: (...args: any[]) => void;
  onSeqClickCallback?: (...args: any[]) => void;
}
export declare class SequenceViewer extends React.Component<ISequenceViewerProps, any> {
  constructor(props: any);
  public render(): JSX.Element | null;
  protected renderFullSequence(sequence: string, selectedResNum?: number): JSX.Element;
}
