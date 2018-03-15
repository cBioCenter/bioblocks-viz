import * as fs from 'fs';
import * as NGL from 'ngl';
import * as React from 'react';

import { NGLComponent } from '../component/NGLComponent';
import { SeqViewer } from '../component/SeqViewer';

export interface IProteinViewerState {
  data?: NGL.Structure;
  resname?: string;
}

export class ProteinViewer extends React.Component<any, IProteinViewerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: undefined,
    };
  }

  public async componentDidMount() {
    this.setState({
      data: undefined,
    });
    const fileLoc = 'assets/1fqg.pdb';
    const data = (await NGL.autoLoad(fileLoc)) as NGL.Structure;
    this.setState({
      data,
    });
  }

  public render() {
    const onHoverCallback = (resname: string) => {
      console.log(resname);
      this.setState({
        resname,
      });
    };
    return (
      <div id="ProteinViewer">
        <NGLComponent data={this.state.data} onHoverCallback={onHoverCallback} />
        <SeqViewer data={this.state.data} selectedResname={this.state.resname} />
      </div>
    );
  }
}
