import { Map } from 'immutable';
import { cloneDeep } from 'lodash';
import * as NGL from 'ngl';
import * as React from 'react';
import { Matrix4, Vector2 } from 'three';

import { Dimmer, Loader } from 'semantic-ui-react';
import { ComponentCard } from '~bioblocks-viz~/component';
import {
  AMINO_ACID_THREE_LETTER_CODE,
  AMINO_ACIDS_BY_THREE_LETTER_CODE,
  BIOBLOCKS_CSS_STYLE,
  BioblocksPDB,
  BioblocksWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  CONTACT_DISTANCE_PROXIMITY,
  RESIDUE_TYPE,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_SECTION,
} from '~bioblocks-viz~/data';
import {
  capitalizeFirstLetter,
  createBallStickRepresentation,
  createDistanceRepresentation,
  createSecStructRepresentation,
  EMPTY_FUNCTION,
} from '~bioblocks-viz~/helper';
import { ILockedResiduePair } from '~bioblocks-viz~/reducer';

export type NGL_HOVER_CB_RESULT_TYPE = number;

export type RepresentationDict = Map<string, NGL.RepresentationElement[]>;

export interface INGLComponentProps {
  backgroundColor: string | number;
  candidateResidues: RESIDUE_TYPE[];
  data: BioblocksPDB[];
  height: number | string;
  hoveredResidues: RESIDUE_TYPE[];
  hoveredSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  isDataLoading: boolean;
  lockedResiduePairs: ILockedResiduePair;
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
  selectedSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  showConfigurations: boolean;
  style?: BIOBLOCKS_CSS_STYLE;
  width: number | string;
  addCandidateResidues(residues: RESIDUE_TYPE[]): void;
  addHoveredResidues(residues: RESIDUE_TYPE[]): void;
  addLockedResiduePair(residuePair: ILockedResiduePair): void;
  dispatchPdbFetch(dataset: string, fetchFn: () => Promise<BioblocksPDB>): void;
  onMeasuredProximityChange?(value: number): void;
  onResize?(event?: UIEvent): void;
  removeAllLockedResiduePairs(): void;
  removeHoveredResidues(): void;
  removeNonLockedResidues(): void;
  removeLockedResiduePair(key: string): void;
  removeCandidateResidues(): void;
}

export const initialNGLState = {
  activeRepresentations: new Array<NGL.RepresentationElement>(),
  stage: undefined as NGL.Stage | undefined,
};

export type NGLComponentState = Readonly<typeof initialNGLState>;

export class NGLComponent extends React.Component<INGLComponentProps, NGLComponentState> {
  public static defaultProps = {
    addCandidateResidues: EMPTY_FUNCTION,
    addHoveredResidues: EMPTY_FUNCTION,
    addLockedResiduePair: EMPTY_FUNCTION,
    backgroundColor: '#ffffff',
    candidateResidues: [],
    data: [],
    dispatchNglFetch: EMPTY_FUNCTION,
    dispatchPdbFetch: EMPTY_FUNCTION,
    height: '90%',
    hoveredResidues: [],
    hoveredSecondaryStructures: [],
    isDataLoading: false,
    lockedResiduePairs: {},
    measuredProximity: CONTACT_DISTANCE_PROXIMITY.C_ALPHA,
    onMeasuredProximityChange: EMPTY_FUNCTION,
    onResize: EMPTY_FUNCTION,
    removeAllLockedResiduePairs: EMPTY_FUNCTION,
    removeCandidateResidues: EMPTY_FUNCTION,
    removeHoveredResidues: EMPTY_FUNCTION,
    removeLockedResiduePair: EMPTY_FUNCTION,
    removeNonLockedResidues: EMPTY_FUNCTION,
    selectedSecondaryStructures: [],
    showConfigurations: true,
    width: '100%',
  };
  public readonly state: NGLComponentState = initialNGLState;

  public prevCanvas: HTMLElement | null = null;
  public canvas: HTMLElement | null = null;

  constructor(props: INGLComponentProps) {
    super(props);
  }

  public componentDidMount() {
    const { backgroundColor, data } = this.props;
    if (this.canvas) {
      const stage = this.generateStage(this.canvas, { backgroundColor });
      stage.removeAllComponents();

      data.map(pdb => {
        this.initData(stage, pdb.nglStructure);
      });

      this.setState({
        stage,
      });
    }
    window.addEventListener('resize', this.onResizeHandler, false);
  }

  public componentWillUnmount() {
    const { stage } = this.state;
    if (stage) {
      stage.viewer.renderer.forceContextLoss();
      stage.dispose();
      this.setState({
        activeRepresentations: [],
        stage: undefined,
      });
    }
    window.removeEventListener('resize', this.onResizeHandler);
  }

  public componentDidUpdate(prevProps: INGLComponentProps, prevState: NGLComponentState) {
    const {
      candidateResidues,
      hoveredResidues,
      hoveredSecondaryStructures,
      lockedResiduePairs,
      data,
      measuredProximity,
      selectedSecondaryStructures,
    } = this.props;
    const { stage } = this.state;

    if (stage && data.length !== prevProps.data.length) {
      stage.removeAllComponents();
      data.map(pdb => {
        this.initData(stage, pdb.nglStructure);
      });
    }

    if (stage && stage.compList.length === 2) {
      NGL.superpose(stage.compList[0].object as NGL.Structure, stage.compList[1].object as NGL.Structure, true);
      stage.compList[0].updateRepresentations({ position: true });
      stage.compList[0].autoView();
    } else if (stage && stage.compList.length >= 1) {
      const structureComponent = stage.compList[0] as NGL.StructureComponent;

      const isHighlightUpdateNeeded =
        candidateResidues !== prevProps.candidateResidues ||
        hoveredResidues !== prevProps.hoveredResidues ||
        hoveredSecondaryStructures !== prevProps.hoveredSecondaryStructures ||
        lockedResiduePairs !== prevProps.lockedResiduePairs ||
        measuredProximity !== prevProps.measuredProximity ||
        selectedSecondaryStructures !== prevProps.selectedSecondaryStructures;
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
    const { height, isDataLoading, style, width } = this.props;
    const computedStyle = { ...style, height, width };

    return (
      <ComponentCard componentName={'NGL Viewer'}>
        <div className="NGLComponent" style={computedStyle}>
          <Dimmer active={isDataLoading}>
            <Loader />
          </Dimmer>
          <div
            className="NGLCanvas"
            onKeyDown={this.onKeyDown}
            onMouseLeave={this.onCanvasLeave}
            ref={this.canvasRefCallback}
            role={'img'}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </ComponentCard>
    );
  }

  protected canvasRefCallback = (el: HTMLDivElement) => {
    this.prevCanvas = this.canvas;
    this.canvas = el;

    if (this.prevCanvas === null && this.canvas !== null && this.state.stage !== undefined) {
      const orientation = this.state.stage.viewerControls.getOrientation() as Matrix4;
      this.state.stage.removeAllComponents();
      const { data } = this.props;
      const { parameters } = this.state.stage;
      const stage = this.generateStage(this.canvas, parameters);

      data.map(pdb => {
        this.initData(stage, pdb.nglStructure);
      });
      stage.viewerControls.orient(orientation);
      stage.viewer.requestRender();
      this.setState({
        stage,
      });
    }
  };

  protected initData(stage: NGL.Stage, structure: NGL.Structure | null) {
    if (structure) {
      // !IMPORTANT! We need to deeply clone the NGL data!
      // If we have multiple NGL components displaying the same data, removing the component will affect
      // the others because they (internally) delete keys/references.

      this.addStructureToStage(cloneDeep(structure), stage);
    }
    stage.viewer.requestRender();
  }

  protected deriveActiveRepresentations(structureComponent: NGL.StructureComponent) {
    const {
      candidateResidues,
      hoveredResidues,
      hoveredSecondaryStructures,
      lockedResiduePairs,
      selectedSecondaryStructures,
    } = this.props;

    return [
      ...this.highlightCandidateResidues(
        structureComponent,
        [...candidateResidues, ...hoveredResidues]
          .filter((value, index, array) => array.indexOf(value) === index)
          .sort(),
      ),
      ...this.highlightLockedDistancePairs(structureComponent, lockedResiduePairs),
      ...this.highlightSecondaryStructures(structureComponent, [
        ...hoveredSecondaryStructures,
        ...selectedSecondaryStructures,
      ]),
    ];
  }

  /**
   * Adds a NGL structure to the stage.
   *
   * @param structure A NGL Structure.
   * @param stage A NGL Stage.
   */
  protected addStructureToStage(structure: NGL.Structure, stage: NGL.Stage) {
    const structureComponent = stage.addComponentFromObject(structure);
    structureComponent.stage.mouseControls.add(
      NGL.MouseActions.HOVER_PICK,
      (aStage: NGL.Stage, pickingProxy: NGL.PickingProxy) => {
        this.onHover(aStage, pickingProxy);
      },
    );

    stage.defaultFileRepresentation(structureComponent);
    stage.signals.clicked.add(this.onClick);
    const activeRepresentations = this.deriveActiveRepresentations(structureComponent);
    this.setState({
      activeRepresentations,
    });
    stage.viewer.requestRender();
  }

  protected getConfigurations = () => {
    const { removeAllLockedResiduePairs } = this.props;

    return [
      {
        name: 'Clear Selections',
        onClick: removeAllLockedResiduePairs,
        type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
      },
      {
        current: CONTACT_DISTANCE_PROXIMITY.CLOSEST,
        name: 'Proximity Metric',
        onChange: this.measuredProximityHandler,
        options: Object.values(CONTACT_DISTANCE_PROXIMITY).map(capitalizeFirstLetter),
        type: CONFIGURATION_COMPONENT_TYPE.RADIO,
      },
      {
        current: 'default',
        name: 'Structure Representation Type',
        onChange: (value: number) => {
          const { stage } = this.state;
          const reps = ['default', 'spacefill', 'backbone', 'cartoon', 'surface', 'tube'];
          if (stage && stage.compList.length >= 1) {
            const structureComponent = stage.compList[0] as NGL.StructureComponent;
            structureComponent.removeAllRepresentations();
            if (value === 0) {
              stage.defaultFileRepresentation(structureComponent);
            } else {
              structureComponent.addRepresentation(reps[value] as NGL.StructureRepresentationType);
            }
            this.setState({
              activeRepresentations: this.deriveActiveRepresentations(structureComponent),
            });
            stage.viewer.requestRender();
          }
        },
        options: Object.values(['Default', 'Spacefill', 'Backbone', 'Cartoon', 'Surface', 'Tube']),
        type: CONFIGURATION_COMPONENT_TYPE.RADIO,
      },
    ] as BioblocksWidgetConfig[];
  };

  protected onClick = (pickingProxy: NGL.PickingProxy) => {
    const {
      addLockedResiduePair,
      addCandidateResidues,
      candidateResidues,
      hoveredResidues,
      removeLockedResiduePair,
      removeCandidateResidues,
      removeNonLockedResidues,
    } = this.props;
    const { stage } = this.state;
    if (this.canvas && stage) {
      const structureComponent = stage.compList[0] as NGL.StructureComponent;
      if (pickingProxy) {
        const isDistancePicker = pickingProxy.picker && pickingProxy.picker.type === 'distance';

        if (isDistancePicker) {
          const residues = [pickingProxy.distance.atom1.resno, pickingProxy.distance.atom2.resno];
          removeLockedResiduePair(residues.sort().toString());
        } else if (pickingProxy.atom || pickingProxy.closestBondAtom) {
          const atom = pickingProxy.atom || pickingProxy.closestBondAtom;

          if (candidateResidues.length >= 1) {
            const sortedResidues = [...candidateResidues, atom.resno].sort();
            addLockedResiduePair({ [sortedResidues.toString()]: [...candidateResidues, atom.resno] });
            removeCandidateResidues();
          } else {
            addCandidateResidues([atom.resno]);
          }
        }
      } else if (candidateResidues.length >= 1 && hoveredResidues.length >= 1) {
        hoveredResidues.forEach(residueIndex => {
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
            const sortedResidues = [...candidateResidues, residueIndex].sort();
            addLockedResiduePair({ [sortedResidues.toString()]: [...candidateResidues, residueIndex] });

            removeCandidateResidues();
          } else {
            removeNonLockedResidues();
          }
        });
      } else {
        // User clicked off-structure, so clear non-locked residue state.
        removeNonLockedResidues();
      }
    }
  };

  protected onHover(aStage: NGL.Stage, pickingProxy: NGL.PickingProxy) {
    const { addHoveredResidues, candidateResidues, hoveredResidues, removeHoveredResidues } = this.props;
    const { stage } = this.state;
    if (stage) {
      if (pickingProxy && (pickingProxy.atom || pickingProxy.closestBondAtom)) {
        const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
        const resname = AMINO_ACIDS_BY_THREE_LETTER_CODE[atom.resname as AMINO_ACID_THREE_LETTER_CODE]
          ? AMINO_ACIDS_BY_THREE_LETTER_CODE[atom.resname as AMINO_ACID_THREE_LETTER_CODE].singleLetterCode
          : atom.resname;
        stage.tooltip.textContent = `${atom.resno}${resname}`;
        addHoveredResidues([atom.resno]);
      } else if (candidateResidues.length === 0 && hoveredResidues.length !== 0) {
        removeHoveredResidues();
      }
    }
  }

  protected measuredProximityHandler = (value: number) => {
    const { onMeasuredProximityChange } = this.props;
    if (onMeasuredProximityChange) {
      onMeasuredProximityChange(value);
    }
  };

  protected getDistanceRepForResidues(structureComponent: NGL.StructureComponent, residues: RESIDUE_TYPE[]) {
    const { data, measuredProximity } = this.props;

    if (measuredProximity === CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
      return createDistanceRepresentation(structureComponent, `${residues.join('.CA, ')}.CA`);
    } else if (data.length >= 1) {
      const { atomIndexI, atomIndexJ } = data[0].getMinDistBetweenResidues(residues[0], residues[1]);

      return createDistanceRepresentation(structureComponent, [atomIndexI, atomIndexJ]);
    }
  }

  protected highlightCandidateResidues(structureComponent: NGL.StructureComponent, residues: RESIDUE_TYPE[]) {
    const reps = new Array<NGL.RepresentationElement>();

    if (residues.length >= 1) {
      reps.push(createBallStickRepresentation(structureComponent, residues));
      if (residues.length >= 2) {
        const rep = this.getDistanceRepForResidues(structureComponent, residues);
        if (rep) {
          reps.push(rep);
        }
      }
    }

    return reps;
  }

  protected highlightLockedDistancePairs(
    structureComponent: NGL.StructureComponent,
    lockedResidues: ILockedResiduePair,
  ) {
    const reps = new Array<NGL.RepresentationElement>();

    for (const residues of Object.values(lockedResidues)) {
      reps.push(createBallStickRepresentation(structureComponent, residues));

      if (residues.length >= 2) {
        const rep = this.getDistanceRepForResidues(structureComponent, residues);
        if (rep) {
          reps.push(rep);
        }
      }
    }

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
    const { removeNonLockedResidues } = this.props;
    removeNonLockedResidues();
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
    e.preventDefault();
    const ESC_KEY_CODE = 27;

    if (e.which === ESC_KEY_CODE || e.keyCode === ESC_KEY_CODE) {
      const { removeNonLockedResidues } = this.props;
      removeNonLockedResidues();
    }
  };

  protected generateStage = (canvas: HTMLElement, params?: NGL.Partial<NGL.IStageParameters>) => {
    const stage = new NGL.Stage(canvas, params);

    // !IMPORTANT! This is needed to prevent the canvas shifting when the user clicks the canvas.
    // It's unclear why the focus does this, but it's undesirable.
    stage.keyBehavior.domElement.focus = () => {
      return;
    };

    return stage;
  };
}
