import * as NGL from 'ngl';
import { PickingProxy, Stage, StructureComponent } from 'ngl';
import * as React from 'react';
import { Button, GridRow } from 'semantic-ui-react';

import ResidueContext, { initialResidueContext, ResidueSelection } from '../context/ResidueContext';
import { initialSecondaryStructureContext, SecondaryStructureContext } from '../context/SecondaryStructureContext';
import { RESIDUE_TYPE } from '../data/chell-data';
import {
  createBallStickRepresentation,
  createDistanceRepresentation,
  createSecStructRepresentation,
} from '../helper/NGLHelper';
import { withDefaultProps } from '../helper/ReactHelper';

export type NGL_HOVER_CB_RESULT_TYPE = number;

export type RepresentationDict = Map<string, NGL.RepresentationElement[]>;

export const defaultNGLProps = {
  data: undefined as NGL.Structure | undefined,
  height: 400,
  ...initialResidueContext,
  ...initialSecondaryStructureContext,
  padding: 0,
  width: 400,
};

export const initialNGLState = {
  activeRepresentations: new Array<NGL.RepresentationElement>(),
  residueOffset: 0,
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
        activeRepresentations: [],
        stage: undefined,
      });
    }
  }

  public componentDidUpdate(prevProps: NGLComponentProps, prevState: NGLComponentState) {
    const { data } = this.props;
    const { stage, structureComponent } = this.state;

    const isNewData = data && data !== prevProps.data;
    if (data && stage && isNewData) {
      stage.removeAllComponents();
      this.addStructureToStage(data, stage);
    } else if (stage && structureComponent) {
      const { candidateResidues, hoveredResidues, lockedResiduePairs, selectedSecondaryStructures } = this.props;

      const isHighlightUpdateNeeded =
        hoveredResidues !== prevProps.hoveredResidues ||
        candidateResidues !== prevProps.candidateResidues ||
        lockedResiduePairs !== prevProps.lockedResiduePairs ||
        selectedSecondaryStructures !== prevProps.selectedSecondaryStructures;

      if (isHighlightUpdateNeeded) {
        for (const rep of this.state.activeRepresentations) {
          structureComponent.removeRepresentation(rep);
        }

        this.setState({
          activeRepresentations: [
            // ...this.highlightCandidateResidues(structureComponent, hoveredResidues),
            // ...this.highlightCandidateResidues(structureComponent, candidateResidues),
            ...this.highlightCandidateResidues(
              structureComponent,
              [...candidateResidues, ...hoveredResidues]
                .filter((value, index, array) => array.indexOf(value) === index)
                .sort(),
            ),
            ...this.highlightLockedDistancePairs(structureComponent, lockedResiduePairs),
            ...this.highlightSecondaryStructures(structureComponent),
          ],
        });
      }
      stage.viewer.requestRender();
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
          <Button onClick={this.props.removeAllLockedResiduePairs}>Remove All Locked Distance Pairs</Button>
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
        addHoveredResidues([resno]);
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
      removeNonLockedResidues,
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
      } else if (pickingProxy.atom || pickingProxy.closestBondAtom) {
        const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
        const resno = atom.resno + this.state.residueOffset;

        if (candidateResidues.length >= 1) {
          addLockedResiduePair([...candidateResidues, resno]);
          removeCandidateResidues();
        } else {
          addCandidateResidues([resno]);
        }
      }
    } else {
      // User clicked off-structure, so clear non-locked residue state.
      removeNonLockedResidues();
    }
  };

  protected highlightCandidateResidues(structureComponent: StructureComponent, residues: RESIDUE_TYPE[]) {
    const reps = new Array<NGL.RepresentationElement>();

    if (residues.length >= 1) {
      const { residueOffset } = this.state;
      const residueWithOffset = residues.map(res => res - residueOffset);

      reps.push(createBallStickRepresentation(structureComponent, residueWithOffset));
      if (residueWithOffset.length >= 2) {
        const selection = residueWithOffset.join('.CA, ') + '.CA';
        reps.push(createDistanceRepresentation(structureComponent, selection));
      }
    }

    return reps;
  }

  protected highlightLockedDistancePairs(structureComponent: StructureComponent, lockedResidues: ResidueSelection) {
    const { residueOffset } = this.state;
    const reps = new Array<NGL.RepresentationElement>();

    lockedResidues.forEach(residues => {
      const residueWithOffset = residues.map(res => res - residueOffset);
      reps.push(createBallStickRepresentation(structureComponent, residueWithOffset));

      if (residueWithOffset.length >= 2) {
        const selection = residueWithOffset.join('.CA, ') + '.CA';
        reps.push(createDistanceRepresentation(structureComponent, selection));
      }
    });

    return reps;
  }

  protected highlightSecondaryStructures(structureComponent: StructureComponent) {
    const { selectedSecondaryStructures } = this.props;
    const reps = new Array<NGL.RepresentationElement>();

    for (const structure of selectedSecondaryStructures) {
      reps.push(createSecStructRepresentation(structureComponent, structure));
    }
    return reps;
  }

  protected onCanvasLeave = () => {
    const { removeNonLockedResidues } = this.props;
    removeNonLockedResidues();
  };
}

export const NGLComponentWithDefaultProps = withDefaultProps(defaultNGLProps, NGLComponentClass);

// TODO The required props should be discernable from `withDefaultProps` without needing to duplicate.
// However the Context consumer syntax is still new to me and I can't find the right combination :(
type requiredProps = Partial<typeof defaultNGLProps> & Required<Omit<NGLComponentProps, keyof typeof defaultNGLProps>>;

const NGLComponent = (props: requiredProps) => (
  <SecondaryStructureContext.Consumer>
    {secStructContext => (
      <ResidueContext.Consumer>
        {residueContext => <NGLComponentWithDefaultProps {...props} {...residueContext} {...secStructContext} />}
      </ResidueContext.Consumer>
    )}
  </SecondaryStructureContext.Consumer>
);

export default NGLComponent;
export { NGLComponent };
