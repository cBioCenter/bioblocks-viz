import * as NGL from 'ngl';
import * as React from 'react';

let canvas: any;

export class NGLComponent extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
    this.state = { el: undefined };
  }

  public componentDidMount() {
    const stage = new NGL.Stage(canvas);
    stage.loadFile('rcsb://1crn', { defaultRepresentation: true });
  }

  public render() {
    return (
      <div id="ContactComponent">
        <div ref={el => (canvas = el)} style={{ height: 200, width: 200 }} />
      </div>
    );
  }
}
