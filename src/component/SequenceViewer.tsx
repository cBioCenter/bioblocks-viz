import * as NGL from 'ngl';
import * as React from 'react';

export interface ISequenceViewerProps {
  data?: NGL.Structure;
  selectedResNum?: number;
  onSeqHoverCallback?: (...args: any[]) => void;
  onSeqClickCallback?: (...args: any[]) => void;
}

export class SequenceViewer extends React.Component<ISequenceViewerProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const { data, selectedResNum } = this.props;
    if (data) {
      const fullSeq = data.getSequence().join('');
      return (
        <div id="SequenceViewer">
          {this.renderFullSequence(fullSeq, selectedResNum)}
          {data.residueMap.list.map((value, index) => {
            if (
              selectedResNum &&
              value.resname === data.residueMap.get(data.residueStore.residueTypeId[selectedResNum]).resname
            ) {
              return <div key={index}>{`${value.resname} was selected!`}</div>;
            } else {
              return <div key={index}>{value.resname}</div>;
            }
          })}
        </div>
      );
    } else {
      return null;
    }
  }

  private renderFullSequence(sequence: string, selectedResNum: number = -1) {
    return (
      <div style={{ width: 400, maxHeight: 400, wordWrap: 'break-word' }}>
        {sequence.substr(0, selectedResNum + 1)}
        <span style={{ color: 'red', fontSize: 24 }}>{sequence[selectedResNum]}</span>
        {sequence.substr(selectedResNum + 1)}
      </div>
    );
  }
}
