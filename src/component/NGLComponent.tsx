import * as NGL from 'ngl';
import * as React from 'react';

import { ICouplingScore } from 'chell';
import { PickingProxy, Stage, StructureComponent } from 'ngl';

export type NGL_DATA_TYPE = NGL.Structure;
export type NGL_HOVER_CB_RESULT_TYPE = number;

export interface INGLComponentProps {
  data?: NGL.Structure;
  onHoverPickCallback?: (resno: NGL_HOVER_CB_RESULT_TYPE) => void;
  selectedData?: ICouplingScore;
}

export interface INGLComponentState {
  residueOffset: number;
  stage?: NGL.Stage;
  structureComponent?: NGL.StructureComponent;
}

export class NGLComponent extends React.Component<INGLComponentProps, INGLComponentState> {
  protected canvas: HTMLElement | null = null;
  protected ele?: NGL.RepresentationElement;

  constructor(props: any) {
    super(props);
    this.state = {
      residueOffset: 0,
      stage: undefined,
    };
  }

  public componentDidMount() {
    if (this.canvas) {
      const stage = new NGL.Stage(this.canvas);

      this.setState({
        stage,
      });

      const { data } = this.props;
      if (data) {
        this.setupStage(data, stage);
      }
    }
  }

  public componentWillUnmount() {
    const { stage } = this.state;
    if (stage) {
      stage.dispose();
      this.setState({
        stage: undefined,
      });
    }
  }

  public componentDidUpdate(prevProps: INGLComponentProps, prevState: INGLComponentState) {
    const { data, selectedData } = this.props;
    const { stage } = this.state;

    const isNewData = data && data !== prevProps.data;
    if (stage && isNewData) {
      stage.removeAllComponents();
    }
    if (stage && isNewData && data) {
      this.setupStage(data, stage);
    } else if (selectedData && selectedData !== prevProps.selectedData && this.state.structureComponent) {
      const residues = [selectedData.i, selectedData.j].map(index => (index - this.state.residueOffset).toString());

      this.highlightElement(this.state.structureComponent, residues.join(', '), 'ball+stick');
    }
  }

  public render() {
    return (
      <div id="NGLComponent">
        <div ref={el => (this.canvas = el)} style={{ height: 400, width: 400 }} />
      </div>
    );
  }

  protected setupStage(data: NGL.Structure, stage: NGL.Stage) {
    const structureComponent = stage.addComponentFromObject(data) as NGL.StructureComponent;

    this.setState({
      residueOffset: data.residueStore.resno[0],
      structureComponent,
    });

    stage.defaultFileRepresentation(structureComponent);

    structureComponent.stage.mouseControls.add(
      NGL.MouseActions.HOVER_PICK,
      (aStage: Stage, pickingProxy: PickingProxy) => this.onHover(aStage, pickingProxy, data, structureComponent),
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

      // this.highlightElement(structureComponent, atom.resno.toString());
      if (this.props.onHoverPickCallback) {
        this.props.onHoverPickCallback(atom.resno + this.state.residueOffset);
      }
    }
  }

  /**
   * Highlight a specific residue on a 3D structure.
   *
   * @protected
   * @param {StructureComponent} structureComponent The structure for which the residue to highlight belongs.
   * @param {string} selection [NGL Selection](https://github.com/arose/ngl/blob/master/doc/usage/selection-language.md) for what to highlight.
   * @param {NGL.StructureRepresentationType} [representationType='spacefill'] The NGL representation type to use for this residue.
   * @memberof NGLComponent
   */
  protected highlightElement(
    structureComponent: StructureComponent,
    selection: string,
    representationType: NGL.StructureRepresentationType = 'spacefill',
  ) {
    if (this.ele) {
      structureComponent.removeRepresentation(this.ele);
    }
    this.ele = structureComponent.addRepresentation(representationType, {
      sele: selection,
    });
  }
}
