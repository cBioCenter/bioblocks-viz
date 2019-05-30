import { Map } from 'immutable';
import { cloneDeep } from 'lodash';
import * as NGL from 'ngl';
import * as React from 'react';
import { Dimmer, Grid, Icon, Loader } from 'semantic-ui-react';
import { Matrix4, Vector2 } from 'three';

import { ComponentCard, IComponentMenuBarItem } from '~bioblocks-viz~/component';
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
  capitalizeEveryWord,
  capitalizeFirstLetter,
  createBallStickRepresentation,
  createDistanceRepresentation,
  createSecStructRepresentation,
  EMPTY_FUNCTION,
} from '~bioblocks-viz~/helper';
import { ILockedResiduePair } from '~bioblocks-viz~/reducer';

export type NGL_HOVER_CB_RESULT_TYPE = number;

export type RepresentationDict = Map<string, NGL.RepresentationElement[]>;
export type SUPERPOSITION_STATUS_TYPE = 'NONE' | 'PREDICTED' | 'EXPERIMENTAL' | 'BOTH';

export interface INGLComponentProps {
  backgroundColor: string | number;
  candidateResidues: RESIDUE_TYPE[];
  experimentalProteins: BioblocksPDB[];
  height: number | string;
  hoveredResidues: RESIDUE_TYPE[];
  hoveredSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  isDataLoading: boolean;
  lockedResiduePairs: ILockedResiduePair;
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
  menuItems: IComponentMenuBarItem[];
  predictedProteins: BioblocksPDB[];
  selectedSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  style?: BIOBLOCKS_CSS_STYLE;
  width: number | string;
  addCandidateResidues(residues: RESIDUE_TYPE[]): void;
  addHoveredResidues(residues: RESIDUE_TYPE[]): void;
  addLockedResiduePair(residuePair: ILockedResiduePair): void;
  onMeasuredProximityChange?(value: number): void;
  onResize?(event?: UIEvent): void;
  removeAllLockedResiduePairs(): void;
  removeHoveredResidues(): void;
  removeNonLockedResidues(): void;
  removeLockedResiduePair(key: string): void;
  removeCandidateResidues(): void;
}

export const initialNGLState = {
  activeRepresentations: {
    experimental: {
      reps: new Array<NGL.RepresentationElement>(),
      structType: 'default' as NGL.StructureRepresentationType,
    },
    predicted: {
      reps: new Array<NGL.RepresentationElement>(),
      structType: 'default' as NGL.StructureRepresentationType,
    },
  },
  isMovePickEnabled: false,
  stage: undefined as NGL.Stage | undefined,
  superpositionStatus: 'NONE' as SUPERPOSITION_STATUS_TYPE,
};

export type NGLComponentState = Readonly<typeof initialNGLState>;

export class NGLComponent extends React.Component<INGLComponentProps, NGLComponentState> {
  public static defaultProps = {
    addCandidateResidues: EMPTY_FUNCTION,
    addHoveredResidues: EMPTY_FUNCTION,
    addLockedResiduePair: EMPTY_FUNCTION,
    backgroundColor: '#ffffff',
    candidateResidues: [],
    experimentalProteins: [],
    height: '92%',
    hoveredResidues: [],
    hoveredSecondaryStructures: [],
    isDataLoading: false,
    lockedResiduePairs: {},
    measuredProximity: CONTACT_DISTANCE_PROXIMITY.C_ALPHA,
    menuItems: [],
    onMeasuredProximityChange: EMPTY_FUNCTION,
    onResize: EMPTY_FUNCTION,
    predictedProteins: [],
    removeAllLockedResiduePairs: EMPTY_FUNCTION,
    removeCandidateResidues: EMPTY_FUNCTION,
    removeHoveredResidues: EMPTY_FUNCTION,
    removeLockedResiduePair: EMPTY_FUNCTION,
    removeNonLockedResidues: EMPTY_FUNCTION,
    selectedSecondaryStructures: [],
    width: '100%',
  };
  public readonly state: NGLComponentState = initialNGLState;

  public prevCanvas: HTMLElement | null = null;
  public canvas: HTMLElement | null = null;

  constructor(props: INGLComponentProps) {
    super(props);
  }

  public componentDidMount() {
    const { backgroundColor, experimentalProteins, predictedProteins } = this.props;
    if (this.canvas) {
      const stage = this.generateStage(this.canvas, { backgroundColor });
      stage.removeAllComponents();

      const allProteins = [...experimentalProteins, ...predictedProteins];
      allProteins.map(pdb => {
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
        activeRepresentations: initialNGLState.activeRepresentations,
        stage: undefined,
      });
    }
    window.removeEventListener('resize', this.onResizeHandler);
  }

  public componentDidUpdate(prevProps: INGLComponentProps, prevState: NGLComponentState) {
    const {
      candidateResidues,
      experimentalProteins,
      hoveredResidues,
      hoveredSecondaryStructures,
      lockedResiduePairs,
      predictedProteins,
      measuredProximity,
      selectedSecondaryStructures,
    } = this.props;
    const { stage, superpositionStatus } = this.state;

    const allProteins = [...experimentalProteins, ...predictedProteins];
    if (stage && allProteins.length !== [...prevProps.experimentalProteins, ...prevProps.predictedProteins].length) {
      stage.removeAllComponents();
      allProteins.map(pdb => {
        this.initData(stage, pdb.nglStructure);
      });
      this.handleSuperposition(stage, superpositionStatus);
    }

    if (stage && stage.compList.length >= 1) {
      if (superpositionStatus !== prevState.superpositionStatus) {
        this.handleSuperposition(stage, superpositionStatus);
      }

      const isHighlightUpdateNeeded =
        candidateResidues !== prevProps.candidateResidues ||
        hoveredResidues !== prevProps.hoveredResidues ||
        hoveredSecondaryStructures !== prevProps.hoveredSecondaryStructures ||
        lockedResiduePairs !== prevProps.lockedResiduePairs ||
        measuredProximity !== prevProps.measuredProximity ||
        selectedSecondaryStructures !== prevProps.selectedSecondaryStructures;

      if (isHighlightUpdateNeeded) {
        this.setState({
          activeRepresentations: { ...this.handleRepresentationUpdate(stage) },
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
    const { height, isDataLoading, menuItems, style, width } = this.props;
    const computedStyle = { ...style, height, width };

    return (
      <ComponentCard
        componentName={'NGL Viewer'}
        menuItems={[
          ...menuItems,
          {
            component: {
              configs: this.getConfigurations(),
              name: 'POPUP',
              props: {
                trigger: <Icon name={'setting'} />,
              },
            },
            description: 'Settings',
          },
        ]}
      >
        <div className={'NGLComponent'} style={computedStyle}>
          <Dimmer active={isDataLoading}>
            <Loader />
          </Dimmer>
          <div
            className={'NGLCanvas'}
            onKeyDown={this.onKeyDown}
            onMouseLeave={this.onCanvasLeave}
            ref={this.canvasRefCallback}
            role={'img'}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        {this.renderBottomToggles()}
      </ComponentCard>
    );
  }

  /**
   * Adds a NGL structure to the stage.
   *
   * @param structure A NGL Structure.
   * @param stage A NGL Stage.
   */
  protected addStructureToStage(structure: NGL.Structure, stage: NGL.Stage) {
    const structureComponent = stage.addComponentFromObject(structure);
    const { predictedProteins } = this.props;
    const { activeRepresentations } = this.state;

    stage.signals.clicked.add(this.onClick);

    if (predictedProteins.find(pred => pred.nglStructure.name === structureComponent.name)) {
      if (activeRepresentations.predicted.structType === 'default') {
        stage.defaultFileRepresentation(structureComponent);
      } else {
        structureComponent.addRepresentation(activeRepresentations.predicted.structType);
      }
      this.setState({
        activeRepresentations: {
          experimental: { ...activeRepresentations.experimental },
          predicted: {
            ...activeRepresentations.predicted,
            reps: [...this.deriveActiveRepresentations(structureComponent)],
          },
        },
      });
    } else {
      if (activeRepresentations.experimental.structType === 'default') {
        stage.defaultFileRepresentation(structureComponent);
      } else {
        structureComponent.addRepresentation(activeRepresentations.experimental.structType);
      }
      this.setState({
        activeRepresentations: {
          experimental: {
            ...activeRepresentations.experimental,
            reps: [...this.deriveActiveRepresentations(structureComponent)],
          },
          predicted: { ...activeRepresentations.predicted },
        },
      });
    }
    stage.viewer.requestRender();
  }

  /**
   * Callback for when the canvas element is mounted.
   * This is needed to ensure the NGL camera preserves orientation if the DOM node is re-mounted, like for full-page mode.
   *
   * @param el The canvas element.
   */
  protected canvasRefCallback = (el: HTMLDivElement) => {
    this.prevCanvas = this.canvas;
    this.canvas = el;

    if (this.prevCanvas === null && this.canvas !== null && this.state.stage !== undefined) {
      const orientation = this.state.stage.viewerControls.getOrientation() as Matrix4;
      this.state.stage.removeAllComponents();
      const { experimentalProteins, predictedProteins } = this.props;
      const { superpositionStatus } = this.state;
      const allProteins = [...experimentalProteins, ...predictedProteins];
      const { parameters } = this.state.stage;
      const stage = this.generateStage(this.canvas, parameters);

      allProteins.map(pdb => {
        this.initData(stage, pdb.nglStructure);
      });
      this.handleSuperposition(stage, superpositionStatus);
      stage.viewerControls.orient(orientation);
      stage.viewer.requestRender();
      this.setState({
        stage,
      });
    }
  };

  protected centerCamera = () => {
    const { stage } = this.state;
    if (stage) {
      stage.autoView();
    }
  };

  protected switchCameraType = () => {
    const { stage } = this.state;
    if (stage) {
      if (stage.parameters.cameraType === 'stereo') {
        stage.setParameters({
          cameraType: 'perspective',
        });
      } else {
        stage.setParameters({
          cameraFov: 65,
          cameraType: 'stereo',
        });
      }
    }
  };

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

  protected generateStage = (canvas: HTMLElement, params?: Partial<NGL.IStageParameters>) => {
    const stage = new NGL.Stage(canvas, params);
    stage.mouseControls.add('hoverPick', (aStage: NGL.Stage, pickingProxy: NGL.PickingProxy) => {
      this.onHover(aStage, pickingProxy);
    });
    stage.mouseControls.remove('clickPick-*', NGL.MouseActions.movePick);
    // !IMPORTANT! This is needed to prevent the canvas shifting when the user clicks the canvas.
    // It's unclear why the focus does this, but it's undesirable.
    stage.keyBehavior.domElement.focus = () => {
      return;
    };

    return stage;
  };

  protected getConfigurations = () => {
    const { measuredProximity, removeAllLockedResiduePairs } = this.props;
    const { isMovePickEnabled } = this.state;

    return [
      {
        name: 'Clear Selections',
        onClick: removeAllLockedResiduePairs,
        type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
      },
      {
        current: isMovePickEnabled ? 'Enable' : 'Disable',
        name: 'Zoom on Click',
        onChange: this.toggleMovePick,
        options: ['Enable', 'Disable'],
        type: CONFIGURATION_COMPONENT_TYPE.RADIO,
      },
      {
        current: measuredProximity,
        name: 'Proximity Metric',
        onChange: this.measuredProximityHandler,
        options: Object.values(CONTACT_DISTANCE_PROXIMITY).map(capitalizeEveryWord),
        type: CONFIGURATION_COMPONENT_TYPE.RADIO,
      },
      {
        current: capitalizeFirstLetter(this.state.activeRepresentations.predicted.structType),
        name: 'Predicted Structure Representation',
        onChange: (value: number) => {
          const { predictedProteins } = this.props;
          const { stage } = this.state;
          const rep = ['default', 'spacefill', 'backbone', 'cartoon', 'surface', 'tube'][
            value
          ] as NGL.StructureRepresentationType;
          if (stage) {
            const activeRepresentations = this.state.activeRepresentations;
            activeRepresentations.predicted.reps = [];
            activeRepresentations.predicted.structType = rep;
            for (const structureComponent of stage.compList) {
              if (predictedProteins.find(pred => pred.nglStructure.name === structureComponent.name)) {
                structureComponent.removeAllRepresentations();
                if (rep === 'default') {
                  stage.defaultFileRepresentation(structureComponent);
                } else {
                  structureComponent.addRepresentation(rep);
                }
                activeRepresentations.predicted.reps.push(
                  ...this.deriveActiveRepresentations(structureComponent as NGL.StructureComponent),
                );
              }
            }

            this.setState({
              activeRepresentations,
            });
            stage.viewer.requestRender();
          }
        },
        options: Object.values(['Default', 'Spacefill', 'Backbone', 'Cartoon', 'Surface', 'Tube']),
        type: CONFIGURATION_COMPONENT_TYPE.RADIO,
      },
      {
        current: capitalizeFirstLetter(this.state.activeRepresentations.experimental.structType),
        name: 'Experimental Structure Representation',
        onChange: (value: number) => {
          const { experimentalProteins } = this.props;
          const { stage } = this.state;
          const rep = ['default', 'spacefill', 'backbone', 'cartoon', 'surface', 'tube'][
            value
          ] as NGL.StructureRepresentationType;
          if (stage) {
            const activeRepresentations = this.state.activeRepresentations;
            activeRepresentations.experimental.reps = [];
            activeRepresentations.experimental.structType = rep;
            for (const structureComponent of stage.compList) {
              if (experimentalProteins.find(exp => exp.nglStructure.name === structureComponent.name)) {
                structureComponent.removeAllRepresentations();
                if (rep === 'default') {
                  stage.defaultFileRepresentation(structureComponent);
                } else {
                  structureComponent.addRepresentation(rep);
                }
                activeRepresentations.experimental.reps.push(
                  ...this.deriveActiveRepresentations(structureComponent as NGL.StructureComponent),
                );
              }
            }
            this.setState({
              activeRepresentations,
            });
            stage.viewer.requestRender();
          }
        },
        options: Object.values(['Default', 'Spacefill', 'Backbone', 'Cartoon', 'Surface', 'Tube']),
        type: CONFIGURATION_COMPONENT_TYPE.RADIO,
      },
    ] as BioblocksWidgetConfig[];
  };

  protected getDistanceRepForResidues(structureComponent: NGL.StructureComponent, residues: RESIDUE_TYPE[]) {
    const { experimentalProteins, predictedProteins, measuredProximity } = this.props;

    const pdbData = [...experimentalProteins, ...predictedProteins].find(
      pdb => pdb.nglStructure.name === structureComponent.name,
    );
    if (measuredProximity === CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
      return createDistanceRepresentation(structureComponent, `${residues.join('.CA, ')}.CA`);
    } else if (pdbData) {
      const { atomIndexI, atomIndexJ } = pdbData.getMinDistBetweenResidues(residues[0], residues[1]);

      return createDistanceRepresentation(structureComponent, [atomIndexI, atomIndexJ]);
    }
  }

  protected handleRepresentationUpdate(stage: NGL.Stage) {
    const { predictedProteins } = this.props;
    const { activeRepresentations } = this.state;
    for (const structureComponent of stage.compList) {
      let isExperimental = true;

      if (predictedProteins.find(pred => pred.nglStructure.name === structureComponent.name)) {
        isExperimental = false;
      }

      for (const rep of isExperimental
        ? this.state.activeRepresentations.experimental.reps
        : this.state.activeRepresentations.predicted.reps) {
        structureComponent.removeRepresentation(rep);
      }

      if (isExperimental) {
        for (const rep of this.state.activeRepresentations.experimental.reps) {
          structureComponent.removeRepresentation(rep);
        }
        activeRepresentations.experimental.reps.push(
          ...this.deriveActiveRepresentations(structureComponent as NGL.StructureComponent),
        );
      } else {
        for (const rep of this.state.activeRepresentations.predicted.reps) {
          structureComponent.removeRepresentation(rep);
        }
        activeRepresentations.predicted.reps.push(
          ...this.deriveActiveRepresentations(structureComponent as NGL.StructureComponent),
        );
      }
    }

    return activeRepresentations;
  }

  protected handleSuperposition(stage: NGL.Stage, superpositionStatus: SUPERPOSITION_STATUS_TYPE) {
    if (superpositionStatus === 'BOTH') {
      for (let i = 1; i < stage.compList.length; ++i) {
        NGL.superpose(stage.compList[i].object as NGL.Structure, stage.compList[0].object as NGL.Structure, true);
      }

      for (const component of stage.compList) {
        component.setPosition([0, 0, 0]);
        component.updateRepresentations({ position: true });
      }

      if (stage.compList[0]) {
        stage.compList[0].autoView();
      } else {
        stage.autoView();
      }
    } else if (superpositionStatus === 'NONE') {
      stage.compList.forEach((component, index) => {
        component.setPosition([index * 50, 0, 0]);
        component.updateRepresentations({ position: true });
      });
      stage.autoView();
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

  protected initData(stage: NGL.Stage, structure: NGL.Structure | null) {
    if (structure) {
      // !IMPORTANT! We need to deeply clone the NGL data!
      // If we have multiple NGL components displaying the same data, removing the component will affect
      // the others because they (internally) delete keys/references.

      this.addStructureToStage(cloneDeep(structure), stage);
    }
    stage.viewer.requestRender();
  }

  protected measuredProximityHandler = (value: number) => {
    const { onMeasuredProximityChange } = this.props;
    if (onMeasuredProximityChange) {
      onMeasuredProximityChange(value);
    }
  };

  protected onCanvasLeave = () => {
    const { removeNonLockedResidues } = this.props;
    removeNonLockedResidues();
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
      for (const structureComponent of stage.compList as NGL.StructureComponent[]) {
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
            const {
              down,
              canvasPosition,
              position,
              prevClickCP,
              prevPosition,
            } = structureComponent.stage.mouseObserver;
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

  protected onKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault();
    const ESC_KEY_CODE = 27;

    if (event.which === ESC_KEY_CODE || event.keyCode === ESC_KEY_CODE) {
      const { removeNonLockedResidues } = this.props;
      removeNonLockedResidues();
    }
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

  protected onSuperpositionToggle = (event?: React.MouseEvent) => {
    const { superpositionStatus } = this.state;
    if (superpositionStatus === 'NONE') {
      this.setState({
        superpositionStatus: 'BOTH',
      });
    } else {
      this.setState({
        superpositionStatus: 'NONE',
      });
    }
  };

  protected renderBottomToggles = () => {
    const isSuperPositionOn = this.state.superpositionStatus !== 'NONE';

    return (
      <Grid>
        <Grid.Row centered={true} columns={3}>
          <Grid.Column>
            <div style={{ userSelect: 'none' }}>
              <a aria-pressed={false} onClick={this.switchCameraType} role={'button'}>
                {`Switch to ${
                  this.state.stage && this.state.stage.parameters.cameraType === 'stereo' ? `Perspective` : 'Stereo'
                }`}
              </a>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={{ userSelect: 'none' }}>
              <a aria-pressed={false} onClick={this.centerCamera} role={'button'}>
                Center View
              </a>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={{ userSelect: 'none' }}>
              <a aria-pressed={isSuperPositionOn} onClick={this.onSuperpositionToggle} role={'button'}>
                {`Superimpose: ${isSuperPositionOn ? 'on' : 'off'}`}
              </a>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  protected toggleMovePick = (event?: React.MouseEvent) => {
    const { stage } = this.state;
    if (stage) {
      const clickPickEnabled =
        stage.mouseControls.actionList.find(action => action.callback === NGL.MouseActions.movePick) !== undefined;
      if (clickPickEnabled) {
        stage.mouseControls.remove('clickPick-*', NGL.MouseActions.movePick);
      } else {
        stage.mouseControls.add('clickPick-left', NGL.MouseActions.movePick);
      }

      this.setState({
        isMovePickEnabled: !clickPickEnabled,
      });
    }
  };
}
