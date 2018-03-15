import * as NGL from 'ngl';
import * as React from 'react';
import * as util from 'util';

export interface ISeqViewerProps {
  data?: NGL.Structure;
  selectedResname?: string;
}

export class SeqViewer extends React.Component<ISeqViewerProps, any> {
  private featureViewer: HTMLElement | null = null;

  constructor(props: any) {
    super(props);
  }

  public componentWillReceiveProps(nextProps: ISeqViewerProps) {
    console.log(nextProps);
  }

  public render() {
    const { data, selectedResname } = this.props;
    return (
      <div id="ProteinViewer">
        Feature Viewer
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
