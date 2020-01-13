import { Map } from 'immutable';
import { cloneDeep } from 'lodash';
import {
  AtomProxy,
  Component,
  IStageParameters,
  PickingProxy,
  RepresentationElement,
  ResidueStore,
  Stage,
  Structure,
  StructureComponent,
  StructureRepresentationType,
} from 'ngl';
import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Matrix4, Vector2 } from 'three';

import { ComponentCard, IComponentCardProps, IComponentMenuBarItem, IDockItem } from '~bioblocks-viz~/component';
import {
  BIOBLOCKS_CSS_STYLE,
  BioblocksPDB,
  BioblocksWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  CONTACT_DISTANCE_PROXIMITY,
  RESIDUE_TYPE,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_SECTION,
} from '~bioblocks-viz~/data';
import { AminoAcid } from '~bioblocks-viz~/data/AminoAcid';
import {
  capitalizeEveryWord,
  capitalizeFirstLetter,
  createBallStickRepresentation,
  createDistanceRepresentation,
  createSecStructRepresentation,
  EMPTY_FUNCTION,
  NGLInstanceManager,
} from '~bioblocks-viz~/helper';
import { LockedResiduePair } from '~bioblocks-viz~/reducer';

export type NGL_HOVER_CB_RESULT_TYPE = number;

export type RepresentationDict = Map<string, RepresentationElement[]>;
export type SUPERPOSITION_STATUS_TYPE = 'NONE' | 'PREDICTED' | 'EXPERIMENTAL' | 'BOTH';

export interface INGLHoverInfo {
  atom: AtomProxy;
  pickingProxy: PickingProxy;
  stage: Stage;
}

export interface INGLComponentProps {
  backgroundColor: string | number;
  candidateResidues: RESIDUE_TYPE[];
  cardProps: IComponentCardProps;
  experimentalProteins: BioblocksPDB[];
  height: number | string;
  hoveredResidues: RESIDUE_TYPE[];
  hoveredSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  isDataLoading: boolean;
  lockedResiduePairs: LockedResiduePair;
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
  menuItems: IComponentMenuBarItem[];
  predictedProteins: BioblocksPDB[];
  selectedSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  style?: BIOBLOCKS_CSS_STYLE;
  width: number | string;
  addCandidateResidues(residues: RESIDUE_TYPE[]): void;
  addHoveredResidues(residues: RESIDUE_TYPE[]): void;
  addLockedResiduePair(residuePair: LockedResiduePair): void;
  hoveredResidueTooltipTextCb(hoverInfo: INGLHoverInfo): string;
  onMeasuredProximityChange?(value: number): void;
  onResize?(event?: UIEvent): void;
  removeAllLockedResiduePairs(): void;
  removeAllSelectedSecondaryStructures(): void;
  removeHoveredResidues(): void;
  removeNonLockedResidues(): void;
  removeLockedResiduePair(key: string): void;
  removeCandidateResidues(): void;
}

export const initialNGLState = {
  activeRepresentations: {
    experimental: {
      reps: new Array<RepresentationElement>(),
      structType: 'default' as StructureRepresentationType,
    },
    predicted: {
      reps: new Array<RepresentationElement>(),
      structType: 'cartoon' as StructureRepresentationType,
    },
  },
  isDistRepEnabled: true,
  isMovePickEnabled: false,
  stage: undefined as Stage | undefined,
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
    cardProps: {},
    experimentalProteins: [],
    height: '92%',
    hoveredResidueTooltipTextCb: (hoverInfo: INGLHoverInfo) => {
      const { atom } = hoverInfo;
      const aa = AminoAcid.fromThreeLetterCode(atom.resname);
      const resname = aa ? aa.singleLetterCode : atom.resname;

      return `${resname}${atom.resno}`;
    },
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
    removeAllSelectedSecondaryStructures: EMPTY_FUNCTION,
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
    const { experimentalProteins, predictedProteins } = this.props;
    const { stage, superpositionStatus } = this.state;
    const allProteins = [...experimentalProteins, ...predictedProteins];
    const proteinChangedFlag =
      !BioblocksPDB.arePDBArraysEqual(prevProps.experimentalProteins, experimentalProteins) ||
      !BioblocksPDB.arePDBArraysEqual(prevProps.predictedProteins, predictedProteins);

    if (stage && proteinChangedFlag) {
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

      if (this.isHighlightUpdateNeeded(prevProps, prevState)) {
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
    const {
      cardProps,
      experimentalProteins,
      height,
      isDataLoading,
      menuItems,
      predictedProteins,
      style,
      width,
    } = this.props;
    const computedStyle = { ...style, height, width };

    return (
      <ComponentCard
        {...{
          componentName: 'NGL Viewer',
          dockItems: this.getDockItems(),
          isDataReady: experimentalProteins.length >= 1 || predictedProteins.length >= 1,
          menuItems: [
            ...menuItems,
            {
              component: {
                configs: { ...this.getSettingsConfigurations(), ...this.getRepresentationConfigs() },
                name: 'POPUP',
                props: {
                  position: 'top center',
                },
              },
              description: 'Settings',
            },
          ],
          ...cardProps,
        }}
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
      </ComponentCard>
    );
  }

  protected addNewHoveredResidue = (pickingProxy: PickingProxy, stage: Stage) => {
    const { addHoveredResidues, hoveredResidueTooltipTextCb } = this.props;
    const atom = pickingProxy.atom || pickingProxy.closestBondAtom;

    stage.tooltip.textContent = hoveredResidueTooltipTextCb({ atom, pickingProxy, stage });
    addHoveredResidues([atom.resno]);
  };

  /**
   * Adds a NGL structure to the stage.
   *
   * @param structure A NGL Structure.
   * @param stage A NGL Stage.
   */
  protected addStructureToStage(structure: Structure, stage: Stage) {
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

  protected deriveActiveRepresentations(structureComponent: StructureComponent) {
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

  protected generateStage = (canvas: HTMLElement, params?: Partial<IStageParameters>) => {
    const stage = new NGLInstanceManager.instance.Stage(canvas, params);
    stage.mouseControls.add('hoverPick', (aStage: Stage, pickingProxy: PickingProxy) => {
      this.onHover(aStage, pickingProxy);
    });
    stage.mouseControls.remove('clickPick-*', NGLInstanceManager.instance.MouseActions.movePick);
    // !IMPORTANT! This is needed to prevent the canvas shifting when the user clicks the canvas.
    // It's unclear why the focus does this, but it's undesirable.
    stage.keyBehavior.domElement.focus = () => {
      return;
    };

    return stage;
  };

  protected getClearSelectionDockItem = (): IDockItem => ({
    isVisibleCb: () =>
      this.props.selectedSecondaryStructures.length >= 1 ||
      Object.values(this.props.lockedResiduePairs).length >= 1 ||
      this.props.candidateResidues.length >= 1,
    onClick: () => {
      this.props.removeAllLockedResiduePairs();
      this.props.removeAllSelectedSecondaryStructures();
      this.props.removeCandidateResidues();
      this.props.removeHoveredResidues();
    },
    text: 'Clear Selections',
  });

  protected getDistanceRepForResidues(structureComponent: StructureComponent, residues: RESIDUE_TYPE[]) {
    const { experimentalProteins, predictedProteins, measuredProximity } = this.props;
    const { isDistRepEnabled } = this.state;

    const pdbData = [...experimentalProteins, ...predictedProteins].find(
      pdb => pdb.nglStructure.name === structureComponent.name,
    );
    if (measuredProximity === CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
      return createDistanceRepresentation(structureComponent, `${residues.join('.CA, ')}.CA`, isDistRepEnabled);
    } else if (pdbData) {
      const { atomIndexI, atomIndexJ } = pdbData.getMinDistBetweenResidues(residues[0], residues[1]);

      return createDistanceRepresentation(structureComponent, [atomIndexI, atomIndexJ], isDistRepEnabled);
    }
  }

  protected getDockItems = () => {
    const isSuperPositionOn = this.state.superpositionStatus !== 'NONE';

    return [
      this.getClearSelectionDockItem(),
      {
        onClick: this.centerCamera,
        text: 'Center View',
      },
      {
        isVisibleCb: () => this.props.experimentalProteins.length + this.props.predictedProteins.length >= 2,
        onClick: this.onSuperpositionToggle,
        text: `Superimpose: ${isSuperPositionOn ? 'On' : 'Off'}`,
      },
      {
        onClick: this.switchCameraType,
        text: `${
          this.state.stage && this.state.stage.parameters.cameraType === 'stereo' ? `Disable` : 'Enable'
        } Stereo`,
      },
    ];
  };

  protected getRepresentationConfigs = () => {
    const reps: StructureRepresentationType[] = ['default', 'spacefill', 'backbone', 'cartoon', 'surface', 'tube'];

    return {
      'Structure Representations': [
        {
          current: capitalizeFirstLetter(this.state.activeRepresentations.predicted.structType),
          name: 'Predicted Structure Representation',
          onChange: (value: number) => {
            const { predictedProteins } = this.props;
            const { activeRepresentations, stage } = this.state;
            if (stage) {
              this.setState({
                activeRepresentations: {
                  ...activeRepresentations,
                  predicted: this.updateRepresentation(stage, reps[value], predictedProteins),
                },
              });
              stage.viewer.requestRender();
            }
          },
          options: ['Rainbow', 'Spacefill', 'Backbone', 'Cartoon', 'Surface', 'Tube'],
          type: CONFIGURATION_COMPONENT_TYPE.RADIO,
        },
        {
          current: capitalizeFirstLetter(this.state.activeRepresentations.experimental.structType),
          name: 'Experimental Structure Representation',
          onChange: (value: number) => {
            const { experimentalProteins } = this.props;
            const { activeRepresentations, stage } = this.state;
            if (stage) {
              this.setState({
                activeRepresentations: {
                  ...activeRepresentations,
                  experimental: this.updateRepresentation(stage, reps[value], experimentalProteins),
                },
              });
              stage.viewer.requestRender();
            }
          },
          options: ['Rainbow', 'Spacefill', 'Backbone', 'Cartoon', 'Surface', 'Tube'],
          type: CONFIGURATION_COMPONENT_TYPE.RADIO,
        },
      ] as BioblocksWidgetConfig[],
    };
  };

  protected getSettingsConfigurations = () => {
    const { measuredProximity } = this.props;
    const { isDistRepEnabled, isMovePickEnabled } = this.state;

    return {
      'View Options': [
        {
          checked: isMovePickEnabled,
          name: 'Zoom on Click',
          onChange: this.toggleMovePick,
          type: CONFIGURATION_COMPONENT_TYPE.CHECKBOX,
        },
        {
          checked: isDistRepEnabled,
          name: 'Display Distance in Ångström',
          onChange: this.toggleDistRep,
          type: CONFIGURATION_COMPONENT_TYPE.CHECKBOX,
        },
        {
          current: measuredProximity,
          name: 'Proximity Metric',
          onChange: this.measuredProximityHandler,
          options: Object.values(CONTACT_DISTANCE_PROXIMITY).map(capitalizeEveryWord),
          type: CONFIGURATION_COMPONENT_TYPE.RADIO,
        },
      ] as BioblocksWidgetConfig[],
    };
  };

  protected handleAtomClick = (pickingProxy: PickingProxy) => {
    const { addLockedResiduePair, addCandidateResidues, candidateResidues, removeCandidateResidues } = this.props;

    const atom = pickingProxy.atom || pickingProxy.closestBondAtom;

    if (candidateResidues.length >= 1) {
      const sortedResidues = [...candidateResidues, atom.resno].sort();
      addLockedResiduePair({ [sortedResidues.toString()]: [...candidateResidues, atom.resno] });
      removeCandidateResidues();
    } else {
      addCandidateResidues([atom.resno]);
    }
  };

  protected handleBothSuperposition = (stage: Stage) => {
    for (let i = 1; i < stage.compList.length; ++i) {
      NGLInstanceManager.instance.superpose(
        stage.compList[i].object as Structure,
        stage.compList[0].object as Structure,
        true,
      );
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
  };

  protected handleClickHover = (structureComponent: Component) => {
    const { hoveredResidues } = this.props;

    hoveredResidues.forEach(residueIndex => {
      this.handleHoveredDistances(residueIndex, structureComponent);
    });
  };

  protected handleClickPick = (pickingProxy: PickingProxy) => {
    const { removeLockedResiduePair } = this.props;

    if (pickingProxy.picker && pickingProxy.picker.type === 'distance') {
      const residues = [pickingProxy.distance.atom1.resno, pickingProxy.distance.atom2.resno];
      removeLockedResiduePair(residues.sort().toString());
    } else if (pickingProxy.atom || pickingProxy.closestBondAtom) {
      this.handleAtomClick(pickingProxy);
    }
  };

  protected handleHoveredDistances = (residueIndex: number, structureComponent: Component) => {
    const { addLockedResiduePair, candidateResidues, removeCandidateResidues, removeNonLockedResidues } = this.props;
    const getMinDist = (residueStore: ResidueStore, target: Vector2) => {
      let minDist = Number.MAX_SAFE_INTEGER;
      const atomOffset = residueStore.atomOffset[residueIndex];
      const atomCount = residueStore.atomCount[residueIndex];
      for (let i = 0; i < atomCount; ++i) {
        const atomProxy = structureComponent.structure.getAtomProxy(atomOffset + i);
        const atomPosition = structureComponent.stage.viewerControls.getPositionOnCanvas(atomProxy.positionToVector3());
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
  };

  protected handleRepresentationUpdate(stage: Stage) {
    const { activeRepresentations } = this.state;
    const result = {
      experimental: {
        reps: new Array<RepresentationElement>(),
        structType: activeRepresentations.experimental.structType,
      },
      predicted: {
        reps: new Array<RepresentationElement>(),
        structType: activeRepresentations.predicted.structType,
      },
    };
    for (const structureComponent of stage.compList) {
      const isExperimental = this.isExperimentalStructure(structureComponent);

      for (const rep of [...activeRepresentations.experimental.reps, ...activeRepresentations.predicted.reps]) {
        if (structureComponent.reprList.includes(rep)) {
          structureComponent.removeRepresentation(rep);
        }
      }

      if (isExperimental) {
        result.experimental.reps.push(...this.deriveActiveRepresentations(structureComponent as StructureComponent));
      } else {
        result.predicted.reps.push(...this.deriveActiveRepresentations(structureComponent as StructureComponent));
      }
    }

    return result;
  }

  protected handleStructureClick = (structureComponent: StructureComponent, pickingProxy: PickingProxy) => {
    const { candidateResidues, hoveredResidues, removeNonLockedResidues } = this.props;
    if (pickingProxy) {
      this.handleClickPick(pickingProxy);
    } else if (candidateResidues.length >= 1 && hoveredResidues.length >= 1) {
      this.handleClickHover(structureComponent);
    } else {
      // User clicked off-structure, so clear non-locked residue state.
      removeNonLockedResidues();
    }
  };

  protected handleSuperposition(stage: Stage, superpositionStatus: SUPERPOSITION_STATUS_TYPE) {
    if (superpositionStatus === 'BOTH') {
      this.handleBothSuperposition(stage);
    } else if (superpositionStatus === 'NONE') {
      stage.compList.forEach((component, index) => {
        component.setPosition([index * 50, 0, 0]);
        component.updateRepresentations({ position: true });
      });
      stage.autoView();
    }
  }

  protected highlightCandidateResidues(structureComponent: StructureComponent, residues: RESIDUE_TYPE[]) {
    const reps = new Array<RepresentationElement>();

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

  protected highlightLockedDistancePairs(structureComponent: StructureComponent, lockedResidues: LockedResiduePair) {
    const reps = new Array<RepresentationElement>();

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
    structureComponent: StructureComponent,
    secondaryStructures: SECONDARY_STRUCTURE,
  ) {
    const reps = new Array<RepresentationElement>();

    for (const structure of secondaryStructures) {
      reps.push(createSecStructRepresentation(structureComponent, structure));
    }

    return reps;
  }

  protected initData(stage: Stage, structure: Structure | null) {
    if (structure) {
      // !IMPORTANT! We need to deeply clone the NGL data!
      // If we have multiple NGL components displaying the same data, removing the component will affect
      // the others because they (internally) delete keys/references.

      this.addStructureToStage(cloneDeep(structure), stage);
    }
    stage.viewer.requestRender();
  }

  protected isExperimentalStructure = (structureComponent: Component) => {
    const { predictedProteins } = this.props;
    if (predictedProteins.find(pred => pred.nglStructure.name === structureComponent.name)) {
      return false;
    }

    return true;
  };

  protected isHighlightUpdateNeeded = (prevProps: INGLComponentProps, prevState: NGLComponentState) => {
    const {
      candidateResidues,
      hoveredResidues,
      hoveredSecondaryStructures,
      lockedResiduePairs,
      measuredProximity,
      selectedSecondaryStructures,
    } = this.props;
    const { isDistRepEnabled } = this.state;

    return (
      candidateResidues !== prevProps.candidateResidues ||
      hoveredResidues !== prevProps.hoveredResidues ||
      hoveredSecondaryStructures !== prevProps.hoveredSecondaryStructures ||
      isDistRepEnabled !== prevState.isDistRepEnabled ||
      lockedResiduePairs !== prevProps.lockedResiduePairs ||
      measuredProximity !== prevProps.measuredProximity ||
      selectedSecondaryStructures !== prevProps.selectedSecondaryStructures
    );
  };

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

  protected onClick = (pickingProxy: PickingProxy) => {
    const { stage } = this.state;
    const { candidateResidues, hoveredResidues, removeNonLockedResidues } = this.props;

    if (stage) {
      if (pickingProxy) {
        this.handleClickPick(pickingProxy);
      } else if (candidateResidues.length >= 1 && hoveredResidues.length >= 1) {
        for (const structureComponent of stage.compList as StructureComponent[]) {
          this.handleClickHover(structureComponent);
        }
      } else {
        // User clicked off-structure, so clear non-locked residue state.
        removeNonLockedResidues();
      }
    }
  };

  protected onHover(aStage: Stage, pickingProxy: PickingProxy) {
    const { candidateResidues, hoveredResidues, removeHoveredResidues } = this.props;
    const { stage } = this.state;
    if (stage) {
      if (pickingProxy && (pickingProxy.atom || pickingProxy.closestBondAtom)) {
        this.addNewHoveredResidue(pickingProxy, stage);
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
      this.forceUpdate();
    }
  };

  protected toggleDistRep = (event?: React.MouseEvent) => {
    const { isDistRepEnabled } = this.state;
    this.setState({
      isDistRepEnabled: !isDistRepEnabled,
    });
  };

  protected toggleMovePick = (event?: React.MouseEvent) => {
    const { isMovePickEnabled, stage } = this.state;
    if (stage) {
      if (isMovePickEnabled) {
        stage.mouseControls.remove('clickPick-*', NGLInstanceManager.instance.MouseActions.movePick);
      } else {
        stage.mouseControls.add('clickPick-left', NGLInstanceManager.instance.MouseActions.movePick);
      }

      this.setState({
        isMovePickEnabled: !isMovePickEnabled,
      });
    }
  };

  protected updateRepresentation = (stage: Stage, rep: StructureRepresentationType, pdbs: BioblocksPDB[]) => {
    const result = {
      reps: new Array<RepresentationElement>(),
      structType: rep,
    };

    for (const structureComponent of stage.compList) {
      if (pdbs.find(pdb => pdb.nglStructure.name === structureComponent.name)) {
        structureComponent.removeAllRepresentations();
        if (rep === 'default') {
          stage.defaultFileRepresentation(structureComponent);
        } else {
          structureComponent.addRepresentation(rep);
        }
        result.reps.push(...this.deriveActiveRepresentations(structureComponent as StructureComponent));
      }
    }

    return result;
  };
}
