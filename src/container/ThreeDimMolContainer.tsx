import * as threeDimMol from '3dmol';
import * as $ from 'jquery';
import * as React from 'react';
import * as util from 'util';

interface I3DMolContainerState {
  viewer: any;
}

export class ThreeDimMolContainer extends React.Component<any, I3DMolContainerState> {
  private container: HTMLDivElement | null = null;
  private glviewer: any;

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this.render3dMol();
  }

  public componentDidUpdate() {
    this.render3dMol();
  }

  public render() {
    return (
      <div
        id="ThreeDimMolContainer"
        ref={c => {
          this.container = c;
        }}
        style={{ height: 200, position: 'relative', width: 200 }}
      />
    );
  }

  private render3dMol() {
    if (this.container) {
      const glviewer = threeDimMol.createViewer(jQuery(this.container));
      threeDimMol.download('pdb:1MO8', glviewer, { multimodel: true, frames: true }, () => {
        glviewer.setStyle({}, { cartoon: { color: 'spectrum' } });
        glviewer.render();
      });

      glviewer.render();

      this.glviewer = glviewer;
    }
  }
}
