import * as NGL from 'ngl';
import { PickingProxy, Stage, StructureComponent, StructureRepresentationType } from 'ngl';
import * as React from 'react';
import { Button, GridRow } from 'semantic-ui-react';

import ResidueContext, { initialResidueContext, ResidueSelection } from '../context/ResidueContext';
import { RESIDUE_TYPE } from '../data/chell-data';
import { createBallStickRepresentation, createDistanceRepresentation } from '../helper/NGLHelper';
import { withDefaultProps } from '../helper/ReactHelper';

export type NGL_HOVER_CB_RESULT_TYPE = number;

export type RepresentationDict = Map<string, NGL.RepresentationElement[]>;

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

export const defaultNGLProps = {
  data: undefined as NGL.Structure | undefined,
  height: 400,
  ...initialResidueContext,
  padding: 0,
  width: 400,
};

export const initialNGLState = {
  residueOffset: 0,
  residueSelectionRepresentations: new Map() as RepresentationDict,
  stage: undefined as NGL.Stage | undefined,
  structureComponent: undefined as NGL.StructureComponent | undefined,
};

export type NGLComponentProps = {} & typeof defaultNGLProps;
export type NGLComponentState = Readonly<typeof initialNGLState>;

export class NGLComponentClass extends React.Component<NGLComponentProps, NGLComponentState> {
  public readonly state: NGLComponentState = initialNGLState;

  public canvas: HTMLElement | null = null;

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
        this.addStructureToStage(data, stage);
      }
    }
  }

  public componentWillUnmount() {
    const { stage } = this.state;
    if (stage) {
      stage.dispose();
      this.setState({
        residueSelectionRepresentations: new Map(),
        stage: undefined,
      });
    }
  }

  public componentDidUpdate(prevProps: NGLComponentProps, prevState: NGLComponentState) {
    const { data, lockedResiduePairs } = this.props;
    const { stage, structureComponent } = this.state;

    const isNewData = data && data !== prevProps.data;
    if (data && stage && isNewData) {
      stage.removeAllComponents();
      this.addStructureToStage(data, stage);
    } else {
      if (structureComponent && prevProps.lockedResiduePairs !== lockedResiduePairs) {
        this.removeHighlights(structureComponent, prevProps.lockedResiduePairs);
        this.highlightResidues(structureComponent, lockedResiduePairs);
      }
      if (structureComponent && this.props.hoveredResidues !== prevProps.hoveredResidues) {
        this.removeNonLockedRepresentations(structureComponent);
        this.highlightResidues(structureComponent, this.props.hoveredResidues);
      }
    }
  }

  /**
   * Renders the NGL canvas.
   *
   * Because we are working with WebGL via the canvas, updating this visualization happens through the canvas reference.
   *
   * @returns The NGL Component
   */
  public render() {
    const { height, padding, width } = this.props;
    return (
      <div className="NGLComponent" style={{ padding }}>
        <div
          className="NGLCanvas"
          ref={el => (this.canvas = el)}
          style={{ height, width }}
          onMouseLeave={this.onCanvasLeave}
        />
        <GridRow>
          <Button onClick={this.props.removeAllLockedResiduePairs}>Remove Locked Distance Pairs</Button>
        </GridRow>
      </div>
    );
  }

  /**
   * Adds a NGL structure to the stage.
   *
   * @param data A NGL Structure.
   * @param stage A NGL Stage.
   */
  protected addStructureToStage(data: NGL.Structure, stage: NGL.Stage) {
    const structureComponent = stage.addComponentFromObject(data);

    this.setState({
      residueOffset: data.residueStore.resno[0],
      structureComponent,
    });

    stage.defaultFileRepresentation(structureComponent);

    structureComponent.stage.mouseControls.add(
      NGL.MouseActions.HOVER_PICK,
      (aStage: Stage, pickingProxy: PickingProxy) => this.onHover(aStage, pickingProxy),
    );

    stage.signals.clicked.add(this.onClick);
  }

  protected onHover(aStage: Stage, pickingProxy: PickingProxy) {
    const { addHoveredResidues, candidateResidues, hoveredResidues, removeHoveredResidues } = this.props;
    const { structureComponent } = this.state;
    if (structureComponent) {
      if (pickingProxy && (pickingProxy.atom || pickingProxy.closestBondAtom)) {
        const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
        const resno = atom.resno + this.state.residueOffset;

        this.removeNonLockedRepresentations(structureComponent);
        this.highlightResidues(structureComponent, [resno]);
        addHoveredResidues([resno]);

        if (candidateResidues.length >= 1) {
          this.highlightResidues(structureComponent, [...candidateResidues, resno].sort());
        }
      } else if (candidateResidues.length === 0 && hoveredResidues.length !== 0) {
        removeHoveredResidues();
      }
    }
  }

  protected onClick = (pickingProxy: PickingProxy) => {
    const {
      addCandidateResidues,
      addLockedResiduePair,
      candidateResidues,
      removeCandidateResidues,
      removeHoveredResidues,
      removeLockedResiduePair,
    } = this.props;
    const { structureComponent } = this.state;
    if (pickingProxy && structureComponent) {
      const isDistancePicker = pickingProxy.picker && pickingProxy.picker.type === 'distance';

      if (isDistancePicker) {
        const residues = [
          pickingProxy.distance.atom1.resno + this.state.residueOffset,
          pickingProxy.distance.atom2.resno + this.state.residueOffset,
        ];
        removeLockedResiduePair(residues);
      } else {
        if (pickingProxy.atom || pickingProxy.closestBondAtom) {
          const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
          const resno = atom.resno + this.state.residueOffset;

          if (candidateResidues.length >= 1) {
            addLockedResiduePair([...candidateResidues, resno]);
            removeCandidateResidues();
          } else {
            addCandidateResidues([resno]);
          }
        } else {
          // User clicked off-structure, so clear non-locked residue state.
          this.removeNonLockedRepresentations(structureComponent);
          removeCandidateResidues();
          removeHoveredResidues();
        }
      }
    }
  };

  protected removeHighlights(structureComponent: StructureComponent, residues: ResidueSelection = new Map()) {
    const repDict = this.state.residueSelectionRepresentations;
    Array.from(residues.keys()).map(key => {
      repDict.get(key)!.map(rep => structureComponent.removeRepresentation(rep));
    });
    this.setState({
      residueSelectionRepresentations: new Map(),
    });
  }

  /**
   * Highlight a specific residue on a 3D structure.
   *
   * @param structureComponent The structure for which the residue to highlight belongs.
   * @param selection [NGL Selection](https://github.com/arose/ngl/blob/master/doc/usage/selection-language.md) for what to highlight.
   */
  protected highlightResidues(
    structureComponent: StructureComponent,
    residuesToHighlight: ResidueSelection | RESIDUE_TYPE[],
  ) {
    const { residueOffset } = this.state;
    const repDict = this.state.residueSelectionRepresentations;

    const allResidues = Array.isArray(residuesToHighlight)
      ? new Map<string, RESIDUE_TYPE[]>([['0', residuesToHighlight]])
      : residuesToHighlight;

    allResidues.forEach(residues => {
      const residueKey = residues.toString();
      const residueWithOffset = residues.map(res => res - residueOffset);

      if (repDict.has(residueKey)) {
        repDict.get(residueKey)!.map(rep => structureComponent.removeRepresentation(rep));
      } else {
        repDict.set(residueKey, []);
      }

      if (residueWithOffset.length >= 2) {
        const selection = residueWithOffset.join('.CA, ') + '.CA';
        repDict.get(residueKey)!.push(createDistanceRepresentation(structureComponent, selection));
      }

      if (residueWithOffset.length !== 0) {
        repDict.get(residueKey)!.push(createBallStickRepresentation(structureComponent, residueWithOffset));
      }
    });

    this.setState({
      residueSelectionRepresentations: repDict,
    });
  }

  protected removeNonLockedRepresentations(structureComponent: NGL.StructureComponent) {
    const repDict = new Map(this.state.residueSelectionRepresentations);
    Array.from(repDict.keys()).map(key => {
      if (!this.props.lockedResiduePairs.has(key)) {
        repDict
          .get(key)!
          .filter(rep => structureComponent.hasRepresentation(rep))
          .forEach(rep => structureComponent.removeRepresentation(rep));
        repDict.delete(key);
      }
    });
    this.setState({
      residueSelectionRepresentations: repDict,
    });
  }

  protected onCanvasLeave = () => {
    const { removeCandidateResidues, removeHoveredResidues } = this.props;
    removeCandidateResidues();
    removeHoveredResidues();
  };
}

export const NGLComponentWithDefaultProps = withDefaultProps(defaultNGLProps, NGLComponentClass);

// TODO The required props should be discernable from `withDefaultProps` without needing to duplicate.
// However the Context consumer syntax is still new to me and I can't find the right combination :(
type requiredProps = Partial<typeof defaultNGLProps> & Required<Omit<NGLComponentProps, keyof typeof defaultNGLProps>>;

const NGLComponent = (props: requiredProps) => (
  <ResidueContext.Consumer>
    {context => <NGLComponentWithDefaultProps {...props} {...context} />}
  </ResidueContext.Consumer>
);

export default NGLComponent;
export { NGLComponent };
