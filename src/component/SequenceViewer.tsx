import * as NGL from 'ngl';
import * as React from 'react';

export interface ISequenceViewerProps {
  data?: NGL.Structure;
  selectedResname?: string;
  onSeqHoverCallback?: (...args: any[]) => void;
  onSeqClickCallback?: (...args: any[]) => void;
}

export class SequenceViewer extends React.Component<ISequenceViewerProps, any> {
  private featureViewer: HTMLElement | null = null;

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { data, selectedResname } = this.props;
    return (
      <div id="SequenceViewer">
        <div onMouseOver={this.props.onSeqHoverCallback}>{data && data.getSequence().slice(0, 50)}</div>
        {data &&
          data.residueMap.list.map((value, index) => {
            if (value.resname === selectedResname) {
              return <div key={index}>{`${value.resname} was selected!`}</div>;
            } else {
              return <div key={index}>{value.resname}</div>;
            }
          })}
        <div id="fv1" ref={el => (this.featureViewer = el)} style={{ height: 400, width: 400 }} />
      </div>
    );
  }
}
