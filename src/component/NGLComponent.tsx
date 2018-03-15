import * as NGL from 'ngl';
import * as React from 'react';

import { IStageLoadFileParams, PickingProxy, Stage, StructureComponent } from 'ngl';

export interface INGLComponentProps {
  data?: NGL.Structure;
  onHoverCallback?: (...args: any[]) => void;
}

export interface INGLComponentState {
  stage?: NGL.Stage;
}

export class NGLComponent extends React.Component<INGLComponentProps, INGLComponentState> {
  private canvas: HTMLElement | null = null;

  constructor(props: any) {
    super(props);
    this.state = {
      stage: undefined,
    };
  }

  public componentWillReceiveProps(nextProps: INGLComponentProps) {
    if (!this.state.stage && nextProps.data && this.canvas) {
      const stage = new NGL.Stage(this.canvas);

      const structureComponent = stage.addComponentFromObject(nextProps.data);
      stage.defaultFileRepresentation(structureComponent);

      let ele: NGL.RepresentationElement;

      stage.mouseControls.add('hoverPick', (aStage: Stage, pickingProxy: PickingProxy) => {
        if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
          const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
          if (ele) {
            structureComponent.removeRepresentation(ele);
          }
          ele = structureComponent.addRepresentation('spacefill', {
            sele: atom.resno.toString(),
          });
          if (this.props.onHoverCallback) {
            this.props.onHoverCallback(atom.resname);
          }
        }
      });

      this.setState({
        stage,
      });
    }
  }

  public render() {
    return (
      <div id="NGLContainer">
        <div ref={el => (this.canvas = el)} style={{ height: 400, width: 400 }} />
      </div>
    );
  }
}
