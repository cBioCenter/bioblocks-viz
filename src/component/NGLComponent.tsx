import * as NGL from 'ngl';
import * as React from 'react';

import { PickingProxy, Stage, StructureComponent } from 'ngl';

export interface INGLComponentProps {
  data?: NGL.Structure;
  onHoverPickCallback?: (...args: any[]) => void;
}

export interface INGLComponentState {
  stage?: NGL.Stage;
  selectedResNum?: number;
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

      const structureComponent: StructureComponent = stage.addComponentFromObject(nextProps.data);
      stage.defaultFileRepresentation(structureComponent);

      let ele: NGL.RepresentationElement;

      stage.mouseControls.add(NGL.MouseActions.HOVER_PICK, (aStage: Stage, pickingProxy: PickingProxy) => {
        if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
          const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
          if (ele) {
            structureComponent.removeRepresentation(ele);
          }
          if (this.state.selectedResNum) {
            ele = structureComponent.addRepresentation('spacefill', {
              sele: this.state.selectedResNum.toString(),
            });
          }
          if (this.props.onHoverPickCallback) {
            this.props.onHoverPickCallback(atom.resno);
          }
          this.setState({
            selectedResNum: atom.resno,
          });
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
