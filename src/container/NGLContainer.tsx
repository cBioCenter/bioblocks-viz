import * as NGL from 'ngl';
import * as React from 'react';

import { GeneInfo } from '../component/GeneInfo';

export class NGLContainer extends React.Component<any, any> {
  private canvas: HTMLElement | null = null;
  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    if (this.canvas) {
      const stage = new NGL.Stage(this.canvas);
      stage.loadFile('assets/1fqg.pdb', { defaultRepresentation: true });
    }
  }

  public render() {
    return (
      <div id="NGLContainer">
        <div ref={el => (this.canvas = el)} style={{ height: 200, width: 200 }} />
        <GeneInfo />
      </div>
    );
  }
}
