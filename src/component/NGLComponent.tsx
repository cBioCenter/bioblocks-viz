import { cloneDeep } from 'lodash';
import * as NGL from 'ngl';
import * as React from 'react';
import { Button, GridRow } from 'semantic-ui-react';
import { Vector2 } from 'three';

import withCouplingContext, { ICouplingContext, initialCouplingContext } from '../context/CouplingContext';
import { initialResidueContext, IResidueContext, ResidueSelection } from '../context/ResidueContext';
import { initialSecondaryStructureContext, ISecondaryStructureContext } from '../context/SecondaryStructureContext';
import { CONTACT_DISTANCE_PROXIMITY, RESIDUE_TYPE, SECONDARY_STRUCTURE } from '../data/chell-data';
import { ChellPDB } from '../data/ChellPDB';
import {
  createBallStickRepresentation,
  createDistanceRepresentation,
  createSecStructRepresentation,
} from '../helper/NGLHelper';

export type NGL_HOVER_CB_RESULT_TYPE = number;

export type RepresentationDict = Map<string, NGL.RepresentationElement[]>;

export interface INGLComponentProps {
  backgroundColor: string | number;
  couplingContext: ICouplingContext;
  data: NGL.Structure | undefined;
  height: number | string;
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
  onResize?: (event?: UIEvent) => void;
  residueContext: IResidueContext;
  secondaryStructureContext: ISecondaryStructureContext;
  showConfiguration: boolean;
  style?: React.CSSProperties;
  width: number | string;
}

export const initialNGLState = {
  activeRepresentations: new Array<NGL.RepresentationElement>(),
  pdbData: undefined as ChellPDB | undefined,
  stage: undefined as NGL.Stage | undefined,
  structureComponent: undefined as NGL.StructureComponent | undefined,
};

export type NGLComponentState = Readonly<typeof initialNGLState>;

export class NGLComponentClass extends React.Component<INGLComponentProps, NGLComponentState> {
  public static defaultProps = {
    backgroundColor: '#000000',
    couplingContext: { ...initialCouplingContext },
    data: undefined,
    height: 400,
    measuredProximity: CONTACT_DISTANCE_PROXIMITY.C_ALPHA,
    residueContext: { ...initialResidueContext },
    secondaryStructureContext: {
      ...initialSecondaryStructureContext,
    },
    showConfiguration: true,
    width: 400,
  };
  public readonly state: NGLComponentState = initialNGLState;

  public canvas: HTMLElement | null = null;

  constructor(props: INGLComponentProps) {
    super(props);
  }

  public componentDidMount({ backgroundColor } = this.props) {
    if (this.canvas) {
      const stage = new NGL.Stage(this.canvas, { backgroundColor });
      const { data } = this.props;

      this.initData(stage, data);

      this.setState({
        stage,
      });
    }
    window.addEventListener('resize', event => this.onResizeHandler(event), false);
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
    window.removeEventListener('resize', () => this.onResizeHandler());
  }

  public componentDidUpdate(prevProps: INGLComponentProps, prevState: NGLComponentState) {
    const { data } = this.props;
    const { stage, structureComponent } = this.state;

    if (stage && data !== prevProps.data) {
      this.initData(stage, data);
    }

    if (stage && data && structureComponent) {
      const { residueContext, secondaryStructureContext } = this.props;

      const isHighlightUpdateNeeded =
        residueContext !== prevProps.residueContext ||
        secondaryStructureContext !== prevProps.secondaryStructureContext;

      if (isHighlightUpdateNeeded) {
        for (const rep of this.state.activeRepresentations) {
          structureComponent.removeRepresentation(rep);
        }

        this.setState({
          activeRepresentations: this.deriveActiveRepresentations(structureComponent),
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
    const { height, residueContext, showConfiguration, style, width } = this.props;
    return (
      <div className="NGLComponent" style={{ ...style }}>
        <div
          className="NGLCanvas"
          ref={el => (this.canvas = el)}
          style={{ height, width }}
          onMouseLeave={this.onCanvasLeave}
          onKeyDown={this.onKeyDown}
        />
        {showConfiguration && (
          <GridRow>
            <Button onClick={residueContext.removeAllLockedResiduePairs}>Remove All Locked Distance Pairs</Button>
          </GridRow>
        )}
      </div>
    );
  }

  protected initData(stage: NGL.Stage, structure?: NGL.Structure) {
    stage.removeAllComponents();

    if (structure) {
      // !IMPORTANT! We need to deeply clone the NGL data!
      // If we have multiple NGL components displaying the same data, removing the component will affect
      // the others because they (internally) delete keys/references.
      this.addStructureToStage(cloneDeep(structure), stage);
      this.setState({
        pdbData: ChellPDB.createPDBFromNGLData(structure),
      });
    } else {
      this.setState({
        pdbData: undefined,
        structureComponent: undefined,
      });
    }
  }

  protected deriveActiveRepresentations(structureComponent: NGL.StructureComponent) {
    const { residueContext, secondaryStructureContext } = this.props;
    const result = [
      ...this.highlightCandidateResidues(
        structureComponent,
        [...residueContext.candidateResidues, ...residueContext.hoveredResidues]
          .filter((value, index, array) => array.indexOf(value) === index)
          .sort(),
      ),
      ...this.highlightLockedDistancePairs(structureComponent, residueContext.lockedResiduePairs),
      ...this.highlightSecondaryStructures(structureComponent, [
        ...secondaryStructureContext.selectedSecondaryStructures,
        ...secondaryStructureContext.temporarySecondaryStructures,
      ]),
    ];

    return result;
  }

  /**
   * Adds a NGL structure to the stage.
   *
   * @param data A NGL Structure.
   * @param stage A NGL Stage.
   */
  protected addStructureToStage(data: NGL.Structure, stage: NGL.Stage) {
    const structureComponent = stage.addComponentFromObject(data);

    structureComponent.stage.mouseControls.add(
      NGL.MouseActions.HOVER_PICK,
      (aStage: NGL.Stage, pickingProxy: NGL.PickingProxy) => this.onHover(aStage, pickingProxy),
    );

    stage.defaultFileRepresentation(structureComponent);
    stage.signals.clicked.add(this.onClick);

    stage.viewer.requestRender();

    this.setState({
      activeRepresentations: this.deriveActiveRepresentations(structureComponent),
      stage,
      structureComponent,
    });
  }

  protected onHover(aStage: NGL.Stage, pickingProxy: NGL.PickingProxy) {
    const { residueContext } = this.props;
    const { structureComponent } = this.state;
    if (structureComponent) {
      if (pickingProxy && (pickingProxy.atom || pickingProxy.closestBondAtom)) {
        const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
        residueContext.addHoveredResidues([atom.resno]);
      } else if (residueContext.candidateResidues.length === 0 && residueContext.hoveredResidues.length !== 0) {
        residueContext.removeHoveredResidues();
      }
    }
  }

  protected onClick = (pickingProxy: NGL.PickingProxy) => {
    const { residueContext } = this.props;
    const { structureComponent } = this.state;
    if (this.canvas && structureComponent) {
      if (pickingProxy) {
        const isDistancePicker = pickingProxy.picker && pickingProxy.picker.type === 'distance';

        if (isDistancePicker) {
          const residues = [pickingProxy.distance.atom1.resno, pickingProxy.distance.atom2.resno];
          residueContext.removeLockedResiduePair(residues);
        } else if (pickingProxy.atom || pickingProxy.closestBondAtom) {
          const atom = pickingProxy.atom || pickingProxy.closestBondAtom;

          if (residueContext.candidateResidues.length >= 1) {
            residueContext.addLockedResiduePair([...residueContext.candidateResidues, atom.resno]);
            residueContext.removeCandidateResidues();
          } else {
            residueContext.addCandidateResidues([atom.resno]);
          }
        }
      } else if (residueContext.candidateResidues.length >= 1 && residueContext.hoveredResidues.length >= 1) {
        residueContext.hoveredResidues.forEach(residueIndex => {
          const getMinDist = (residueStore: NGL.ResidueStore, target: Vector2) => {
            let minDist = Number.MAX_SAFE_INTEGER;
            const atomOffset = residueStore.atomOffset[residueIndex];
            const atomCount = residueStore.atomCount[residueIndex];
            for (let i = 0; i < atomCount; ++i) {
              const atomProxy = structureComponent.structure.getAtomProxy(atomOffset + i);
              const atomPosition = structureComponent.stage.viewerControls.getPositionOnCanvas(
                atomProxy.positionToVector3(),
              );
              minDist = Math.min(minDist, target.distanceTo(atomPosition));
            }
            return minDist;
          };

          // ! IMPORTANT !
          // This is a rather brute force approach to see if the mouse is close to a residue.
          // The main problem is __reliably__ getting the (x,y) of where the user clicked and the "residue" they were closest to.
          const { down, canvasPosition, position, prevClickCP, prevPosition } = structureComponent.stage.mouseObserver;
          const minDistances = [down, canvasPosition, prevClickCP, prevPosition, position].map(pos =>
            getMinDist(structureComponent.structure.residueStore, pos),
          );

          // Shorthand to make it clearer that this method is just checking if any distance is within 100.
          const isWithinSnappingDistance = (distances: number[], limit = 100) =>
            distances.filter(dist => dist < limit).length >= 1;

          if (isWithinSnappingDistance(minDistances)) {
            residueContext.addLockedResiduePair([...residueContext.candidateResidues, residueIndex]);
            residueContext.removeCandidateResidues();
          } else {
            residueContext.removeNonLockedResidues();
          }
        });
      } else {
        // User clicked off-structure, so clear non-locked residue state.
        residueContext.removeNonLockedResidues();
      }
    }
  };

  protected getDistanceRepForResidues(
    structureComponent: NGL.StructureComponent,
    residues: RESIDUE_TYPE[],
    pdbData: ChellPDB,
  ) {
    const { measuredProximity } = this.props;

    if (measuredProximity === CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
      return createDistanceRepresentation(structureComponent, residues.join('.CA, ') + '.CA');
    } else {
      const { atomIndexI, atomIndexJ } = pdbData.getMinDistBetweenResidues(residues[0], residues[1]);
      return createDistanceRepresentation(structureComponent, [atomIndexI, atomIndexJ]);
    }
  }

  protected highlightCandidateResidues(structureComponent: NGL.StructureComponent, residues: RESIDUE_TYPE[]) {
    const reps = new Array<NGL.RepresentationElement>();
    const { pdbData } = this.state;

    if (residues.length >= 1) {
      reps.push(createBallStickRepresentation(structureComponent, residues));
      if (residues.length >= 2 && pdbData) {
        reps.push(this.getDistanceRepForResidues(structureComponent, residues, pdbData));
      }
    }

    return reps;
  }

  protected highlightLockedDistancePairs(structureComponent: NGL.StructureComponent, lockedResidues: ResidueSelection) {
    const { pdbData } = this.state;

    const reps = new Array<NGL.RepresentationElement>();

    lockedResidues.forEach(residues => {
      reps.push(createBallStickRepresentation(structureComponent, residues));

      if (residues.length >= 2 && pdbData) {
        reps.push(this.getDistanceRepForResidues(structureComponent, residues, pdbData));
      }
    });

    return reps;
  }

  protected highlightSecondaryStructures(
    structureComponent: NGL.StructureComponent,
    secondaryStructures: SECONDARY_STRUCTURE,
  ) {
    const reps = new Array<NGL.RepresentationElement>();

    for (const structure of secondaryStructures) {
      reps.push(createSecStructRepresentation(structureComponent, structure));
    }
    return reps;
  }

  protected onCanvasLeave = () => {
    const { residueContext } = this.props;
    residueContext.removeNonLockedResidues();
  };

  protected onResizeHandler = (event?: UIEvent) => {
    const { onResize } = this.props;
    const { stage } = this.state;
    if (stage) {
      stage.handleResize();
    }
    if (onResize) {
      onResize(event);
    }
  };

  protected onKeyDown = (e: React.KeyboardEvent) => {
    const ESC_KEY_CODE = 27;

    if (e.which === ESC_KEY_CODE || e.keyCode === ESC_KEY_CODE) {
      const { residueContext } = this.props;
      residueContext.removeNonLockedResidues();
    }
  };
}

type requiredProps = Omit<INGLComponentProps, keyof typeof NGLComponentClass.defaultProps> &
  Partial<INGLComponentProps>;

const NGLComponent = (props: requiredProps) => withCouplingContext(NGLComponentClass)({ ...props });

export default NGLComponent;
export { NGLComponent };
