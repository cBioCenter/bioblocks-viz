import * as NGL from 'ngl';
import * as React from 'react';

import { ICouplingScore } from 'chell';
import { PickingProxy, Stage, StructureComponent } from 'ngl';

export type NGL_DATA_TYPE = NGL.Structure;

export interface INGLComponentProps {
  data?: NGL.Structure;
  onHoverPickCallback?: (...args: any[]) => void;
  selectedData?: ICouplingScore;
}

export interface INGLComponentState {
  stage?: NGL.Stage;
  structureComponent?: NGL.StructureComponent;
}

export class NGLComponent extends React.Component<INGLComponentProps, INGLComponentState> {
  protected canvas: HTMLElement | null = null;
  protected ele?: NGL.RepresentationElement;

  constructor(props: any) {
    super(props);
    this.state = {
      stage: undefined,
    };
  }

  public componentDidMount() {
    if (this.canvas) {
      const stage = new NGL.Stage(this.canvas);

      this.setState({
        stage,
      });
    }
  }

  public componentDidUpdate(prevProps: INGLComponentProps, prevState: INGLComponentState) {
    const { data, selectedData } = this.props;
    const { stage } = this.state;

    if (stage && data && !this.state.structureComponent) {
      const structureComponent = stage.addComponentFromObject(data);
      this.setState({
        structureComponent,
      });

      stage.defaultFileRepresentation(structureComponent);
      stage.mouseControls.add(NGL.MouseActions.HOVER_PICK, (aStage: Stage, pickingProxy: PickingProxy) =>
        this.onHover(aStage, pickingProxy, data, structureComponent),
      );
    } else if (selectedData && selectedData !== prevProps.selectedData && this.state.structureComponent) {
      const i = selectedData.i - 8;
      // const j = selectedData.j - 8;

      this.highlightElement(this.state.structureComponent, i);
    }
  }

  public render() {
    return (
      <div id="NGLComponent">
        <div ref={el => (this.canvas = el)} style={{ height: 400, width: 400 }} />
      </div>
    );
  }

  protected onHover(
    aStage: Stage,
    pickingProxy: PickingProxy,
    data: NGL.Structure,
    structureComponent: StructureComponent,
  ) {
    if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
      const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
      const nglSeq = data.getSequence().join('');
      const fullSeq = 'MALLHSARVLSGVASAFHPGLAAAASARASSWWAHVEMGPPDPILGVTEAYKRDTNSKKM';
      console.log(data.getSequence());
      console.log(nglSeq);
      console.log(nglSeq.length);
      console.log(fullSeq);
      console.log(fullSeq.length);
      console.log(`fullSeq.indexOf(nglSeq): ${fullSeq.indexOf(nglSeq)}`);

      this.highlightElement(structureComponent, atom.resno);
      if (this.props.onHoverPickCallback) {
        this.props.onHoverPickCallback(atom.resno);
      }
    }
  }

  /**
   * Highlight a specific residue on a 3D structure.
   *
   * @protected
   * @param {StructureComponent} structureComponent The structure for which the residue to highlight belongs.
   * @param {number} resNum The residue number to highlight.
   * @param {NGL.StructureRepresentationType} [representationType='spacefill'] The NGL representation type to use for this residue.
   * @memberof NGLComponent
   */
  protected highlightElement(
    structureComponent: StructureComponent,
    resNum: number,
    representationType: NGL.StructureRepresentationType = 'spacefill',
  ) {
    if (this.ele) {
      structureComponent.removeRepresentation(this.ele);
    }
    this.ele = structureComponent.addRepresentation(representationType, {
      sele: resNum.toString(),
    });
  }
}
