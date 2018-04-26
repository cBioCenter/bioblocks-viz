import * as NGL from 'ngl';
import * as React from 'react';

import { NGLComponent } from '../component/NGLComponent';
import { SequenceViewer } from '../component/SequenceViewer';

export interface IProteinViewerState {
  data?: NGL.Structure;
}

export class ProteinViewer extends React.Component<any, IProteinViewerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: undefined,
    };
  }

  public async componentDidMount() {
    const fileLoc = 'assets/1fqg.pdb';
    try {
      const data = (await NGL.autoLoad(fileLoc)) as NGL.Structure;
      this.setState({
        data,
      });
    } catch (e) {
      console.log(`Error loading NGL file: ${e}`);
    }
  }

  public render() {
    return (
      <div id="ProteinViewer">
        <NGLComponent data={this.state.data} />
        <SequenceViewer data={this.state.data} />
      </div>
    );
  }
}
