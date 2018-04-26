import * as NGL from 'ngl';
import * as React from 'react';

import { IResiduePair } from 'chell';
import { PickingProxy, Stage, StructureComponent, StructureRepresentationType } from 'ngl';
import { ResidueContext } from '../context/ResidueContext';

export type NGL_HOVER_CB_RESULT_TYPE = number;

export interface INGLComponentProps {
  currentResiduePair?: IResiduePair;
  data?: NGL.Structure;
  selectNewResiduePair?: (residuePair: IResiduePair) => void;
}

export const SUPPORTED_REPS: StructureRepresentationType[] = [
  'axes',
  'backbone',
  'ball+stick',
  'distance',
  'label',
  'line',
  'hyperball',
  'spacefill',
];

const initialState = {
  max_x: 0,
  min_x: 1000,
  nodeSize: 4,
  probabilityFilter: 0.99,
  residueOffset: 0,
  stage: undefined as NGL.Stage | undefined,
  structureComponent: undefined as NGL.StructureComponent | undefined,
};

type State = Readonly<typeof initialState>;

class NGLComponentClass extends React.Component<INGLComponentProps, State> {
  public readonly state: State = initialState;

  protected canvas: HTMLElement | null = null;
  protected distRepresentation?: NGL.RepresentationElement;
  protected ballStickRepresentation?: NGL.RepresentationElement;

  constructor(props: any) {
    super(props);
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

  public componentDidUpdate(prevProps: INGLComponentProps, prevState: State) {
    const { data, currentResiduePair } = this.props;
    const { residueOffset, stage, structureComponent } = this.state;

    const isNewData = data && data !== prevProps.data;
    if (stage && isNewData) {
      stage.removeAllComponents();
    }
    if (stage && isNewData && data) {
      this.setupStage(data, stage);
    } else if (currentResiduePair !== prevProps.currentResiduePair && structureComponent) {
      const residues = [currentResiduePair!.i - residueOffset, currentResiduePair!.j - residueOffset];

      this.highlightElement(structureComponent, residues, 'distance');
    } else if (this.distRepresentation && structureComponent) {
      structureComponent.removeRepresentation(this.distRepresentation);
      this.distRepresentation = structureComponent.addRepresentation('distance', {
        sele: this.distRepresentation.parameters.sele,
      });
    }
  }

  public render() {
    return (
      <div id="NGLComponent" style={{ padding: 15 }}>
        <div ref={el => (this.canvas = el)} style={{ height: 370, width: 370 }} />
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
    structureComponent.reprList.forEach(rep => {
      rep.setParameters({ opacity: 1.0 });
    });

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
      const resno = atom.resno + this.state.residueOffset;
      this.props.selectNewResiduePair!({ i: resno, j: resno });
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
    residues: number[],
    representationType: NGL.StructureRepresentationType = 'spacefill',
  ) {
    if (this.distRepresentation) {
      structureComponent.removeRepresentation(this.distRepresentation);
    }
    if (this.ballStickRepresentation) {
      structureComponent.removeRepresentation(this.ballStickRepresentation);
    }

    if (residues.length >= 2) {
      const selection = residues.join('.CA, ') + '.CA';
      this.distRepresentation = structureComponent.addRepresentation(representationType, {
        atomPair: [selection.split(',')],
        color: 'skyblue',
        labelUnit: 'nm',
      });
    }

    this.ballStickRepresentation = structureComponent.addRepresentation('ball+stick', {
      sele: residues.join(', '),
    });
  }
}

export const NGLComponent = (props: INGLComponentProps) => (
  <ResidueContext.Consumer>
    {({ currentResiduePair, selectNewResiduePair }) => (
      <NGLComponentClass
        {...props}
        currentResiduePair={currentResiduePair}
        selectNewResiduePair={selectNewResiduePair}
      />
    )}
  </ResidueContext.Consumer>
);
